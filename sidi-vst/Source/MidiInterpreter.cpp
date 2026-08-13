#include "MidiInterpreter.h"
#include "ContinuousController.h"
#include <cmath>

// Port of sidi-web/src/Driver.ts's interpret*() methods, dispatching on the
// incoming juce::MidiMessage instead of a parsed midi-file Event.

namespace
{
    int getExtrapolatedBitValue (int value, int inBits, int outBits)
    {
        const int maxIn = (1 << inBits) - 1;
        const int maxOut = (1 << outBits) - 1;

        if (maxIn <= 0)
            return 0;

        return (int) std::round (((double) value / (double) maxIn) * (double) maxOut);
    }
}

MidiInterpreter::MidiInterpreter (ISidChip& sidChip, uint8_t initialControlRegister, uint8_t initialSustainRelease)
    : sid (sidChip)
{
    for (int channel = 0; channel < 3; ++channel)
    {
        controlRegister[(size_t) channel] = initialControlRegister;
        sustainRelease[(size_t) channel] = initialSustainRelease;
    }
}

void MidiInterpreter::process (const juce::MidiMessage& message)
{
    // NB: Only 3 oscillators exist (see MidiInterpreter.h's class comment). Every
    // process*() below indexes fixed-size 3-element arrays by channel with no further
    // checking, so a message on channel 4+ must be rejected here rather than there -
    // std::array::operator[] doesn't bounds-check, so letting one through is UB, not
    // a no-op.
    if (message.getChannel() - 1 >= 3)
        return;

    if (message.isController())
        processController (message);
    else if (message.isNoteOn())
        processNoteOn (message);
    else if (message.isNoteOff())
        processNoteOff (message);
    else if (message.isPitchWheel())
        processPitchWheel (message);
}

void MidiInterpreter::updateFrequency (int channel)
{
    const int key = lastPressedKey[(size_t) channel];
    if (key < 0)
        return;

    const double bendAmount = (double) pitchBendAmount[(size_t) channel];
    const double bendRange = (double) maxBendSemitones[(size_t) channel];
    const double bentKey = (double) key + (bendAmount * bendRange);

    const double frequencyHz = 440.0 * std::pow (2.0, (bentKey - 69.0) / 12.0);
    const int regValue = (int) std::round ((frequencyHz * 16777216.0) / clockFrequencyHz);
    const int clamped = juce::jlimit (0, 65535, regValue);

    const int offset = channel * 7;
    sid.write (offset + 0, (uint8_t) (clamped & 0xFF));
    sid.write (offset + 1, (uint8_t) ((clamped >> 8) & 0xFF));
}

void MidiInterpreter::processNoteOn (const juce::MidiMessage& message)
{
    const int channel = message.getChannel() - 1;

    lastPressedKey[(size_t) channel] = message.getNoteNumber();
    updateFrequency (channel);

    const int offset = channel * 7;

    // NB: The real SID's envelope rate counter never resets between notes (the
    // "ADSR bug" - see the MIDIbox SID manual's drum section and
    // https://csdb.dk/forums/?roomid=14&topicid=159900), so attack timing after
    // a bare GATE edge can jitter by up to ~30ms depending on where that counter
    // already was. TEST does NOT touch the envelope generator at all (confirmed
    // in that thread by someone who's read reSIDfp's ADSR implementation) - it
    // only resets the waveform generator, so raising it bought nothing for the
    // bug and only risked an audible click from resetting oscillator phase out
    // from under a still-sounding voice.
    const bool useAdsrWorkaround = adsrWorkaroundGlobalEnabled.load (std::memory_order_relaxed)
        && adsrWorkaroundChannelEnabled[(size_t) channel].load (std::memory_order_relaxed);

    if (useAdsrWorkaround)
    {
        pendingAdsrRelease[(size_t) channel] = true;

        // NB: Zeroing the whole control register guarantees a real 0->1 GATE
        // edge below (see the "already gated" comment in the non-workaround
        // branch - the same problem applies here), and priming attack=0/
        // sustain=max on top of that clean edge makes the rate counter
        // recapture near-instantly instead of jittering.
        sid.write (offset + 4, 0x00);

        // NB: GATE alone starts the envelope (reSIDfp's EnvelopeGenerator knows
        // nothing about TEST), so without this the patch's real attack/decay
        // would run to completion silently, and releasing the hold below would
        // only ever reveal whatever's left of the envelope by then (eg. a kick
        // with its punch already decayed away). Forcing attack=0, sustain=max
        // here races the envelope to full peak and parks it there well within
        // the hold, regardless of the patch's real values; releaseAdsrHold()
        // swaps those real values back in once the hold elapses, so the
        // audible decay starts fresh from peak, exactly on time.
        sid.write (offset + 5, 0x00);
        sid.write (offset + 6, 0xF0);
    }
    else if ((controlRegister[(size_t) channel] & 0x01) != 0)
    {
        // NB: The envelope generator only (re)starts on a 0->1 GATE transition
        // (see reSIDfp's EnvelopeGenerator::writeCONTROL_REG). When several
        // percussive hits share one voice - the classic C64 trick of keeping
        // one oscillator free for drums - a new hit can arrive before the
        // previous one's note off, leaving GATE already high; writing 1 again
        // would be a no-op at the chip level and the hit would silently fail
        // to retrigger. Forcing GATE low first guarantees a real edge every
        // time, regardless of what the incoming note on/off pairing did. The
        // workaround branch above already gets this for free from its own
        // zero-write, so this only runs when that branch didn't.
        sid.write (offset + 4, (uint8_t) (controlRegister[(size_t) channel] & ~0x01));
    }

    controlRegister[(size_t) channel] |= 0x01;

    sid.write (offset + 4, controlRegister[(size_t) channel]);
}

void MidiInterpreter::processNoteOff (const juce::MidiMessage& message)
{
    const int channel = message.getChannel() - 1;
    const int key = message.getNoteNumber();

    if (lastPressedKey[(size_t) channel] == key)
    {
        const int offset = channel * 7;
        controlRegister[(size_t) channel] &= (uint8_t) ~0x01;

        // NB: A note off arriving mid-hold (before releaseAdsrHold's ~30ms hold
        // has elapsed) must not release using the priming ADSR values still
        // sitting in the registers (see processNoteOn) - restore the patch's
        // real values so GATE's fall uses the intended release rate.
        if (pendingAdsrRelease[(size_t) channel].load (std::memory_order_relaxed))
        {
            sid.write (offset + 5, attackDecay[(size_t) channel]);
            sid.write (offset + 6, sustainRelease[(size_t) channel]);

            pendingAdsrRelease[(size_t) channel] = false;
        }

        sid.write (offset + 4, controlRegister[(size_t) channel]);
        lastPressedKey[(size_t) channel] = -1;
    }
}

void MidiInterpreter::releaseAdsrHold (int channel)
{
    if (!pendingAdsrRelease[(size_t) channel].load (std::memory_order_relaxed))
        return;

    const int offset = channel * 7;

    // NB: Restore the patch's real ADSR values now that the hold has elapsed,
    // so the audible decay/sustain starts from the intended shape at exactly
    // this deterministic moment - see processNoteOn's priming comment. GATE
    // itself never changed during the hold (there's no TEST bit to release
    // here, see processNoteOn), so no control register write is needed.
    sid.write (offset + 5, attackDecay[(size_t) channel]);
    sid.write (offset + 6, sustainRelease[(size_t) channel]);

    pendingAdsrRelease[(size_t) channel] = false;
}

void MidiInterpreter::processPitchWheel (const juce::MidiMessage& message)
{
    const int channel = message.getChannel() - 1;
    const int value = message.getPitchWheelValue();

    // NB: Mirrors @perry-rylance/midi's PitchWheelEvent amount getter -
    // the raw 14-bit value doesn't map symmetrically about the centre,
    // see sidi-web/node_modules/@perry-rylance/midi's PitchWheelEvent.js.
    const float amount = value <= 0x2000
        ? (float) (-1.0 + 2.0 * ((1.0 + value) / 0x3FFF))
        : (float) (-1.0 + 2.0 * ((double) value / 0x3FFF));

    pitchBendAmount[(size_t) channel] = amount;
    updateFrequency (channel);
}

void MidiInterpreter::processController (const juce::MidiMessage& message)
{
    using namespace ContinuousController;

    const int channel = message.getChannel() - 1;
    const int controller = message.getControllerNumber();
    const int value = message.getControllerValue();

    switch (controller)
    {
        case FilterCutoff:
        {
            const int mapped = getExtrapolatedBitValue (value, 7, 11);
            sid.write (0x15, (uint8_t) (mapped & 0x07));
            sid.write (0x16, (uint8_t) ((mapped >> 3) & 0xFF));
            break;
        }

        case FilterResonance:
        {
            const int mapped = getExtrapolatedBitValue (value, 7, 4);
            filterResonanceSelect = (uint8_t) ((filterResonanceSelect & 0x0F) | (mapped << 4));
            sid.write (0x17, filterResonanceSelect);
            break;
        }

        case FilterEnable:
        {
            const bool on = value >= 64;
            const int mask = 1 << channel;
            filterResonanceSelect = (uint8_t) (on ? (filterResonanceSelect | mask) : (filterResonanceSelect & ~mask));
            sid.write (0x17, filterResonanceSelect);
            break;
        }

        case FilterLowPass:
        case FilterBandPass:
        case FilterHighPass:
        case Oscillator3Mute:
        {
            const bool on = value >= 64;
            int mask = 0;

            switch (controller)
            {
                case FilterLowPass:   mask = 0x10; break;
                case FilterBandPass:  mask = 0x20; break;
                case FilterHighPass:  mask = 0x40; break;
                case Oscillator3Mute: mask = 0x80; break;
            }

            filterModeVolumeSelect = (uint8_t) (on ? (filterModeVolumeSelect | mask) : (filterModeVolumeSelect & ~mask));
            sid.write (0x18, filterModeVolumeSelect);
            break;
        }

        case MainVolume:
        {
            const int mapped = getExtrapolatedBitValue (value, 7, 4);
            filterModeVolumeSelect = (uint8_t) ((filterModeVolumeSelect & 0xF0) | mapped);
            sid.write (0x18, filterModeVolumeSelect);
            break;
        }

        case PulseWidth:
        {
            const int mapped = getExtrapolatedBitValue (value, 7, 12);
            const int offset = channel * 7 + 2;
            sid.write (offset + 0, (uint8_t) (mapped & 0xFF));
            sid.write (offset + 1, (uint8_t) ((mapped >> 8) & 0xFF));
            break;
        }

        case Attack:
        case Decay:
        case Sustain:
        case Release:
        {
            const int mapped = getExtrapolatedBitValue (value, 7, 4);

            std::array<uint8_t, 3>* array = nullptr;
            int shift = 0;
            uint8_t mask = 0;
            int regOffset = 0;

            switch (controller)
            {
                case Attack:  array = &attackDecay;    shift = 4; mask = 0x0F; regOffset = 5; break;
                case Decay:   array = &attackDecay;    shift = 0; mask = 0xF0; regOffset = 5; break;
                case Sustain: array = &sustainRelease; shift = 4; mask = 0x0F; regOffset = 6; break;
                case Release: array = &sustainRelease; shift = 0; mask = 0xF0; regOffset = 6; break;
            }

            const int address = channel * 7 + regOffset;
            const uint8_t currentVal = (*array)[(size_t) channel];
            const uint8_t newVal = (uint8_t) ((currentVal & mask) | (mapped << shift));

            (*array)[(size_t) channel] = newVal;
            sid.write (address, newVal);
            break;
        }

        case Tri:
        case Saw:
        case Pulse:
        case Noise:
        case Gate:
        case Sync:
        case Ring:
        case Test:
        {
            const bool on = value >= 64;
            int mask = 0;

            switch (controller)
            {
                case Gate:  mask = 0x01; break;
                case Sync:  mask = 0x02; break;
                case Ring:  mask = 0x04; break;
                case Test:  mask = 0x08; break;
                case Tri:   mask = 0x10; break;
                case Saw:   mask = 0x20; break;
                case Pulse: mask = 0x40; break;
                case Noise: mask = 0x80; break;
            }

            const int address = channel * 7 + 4;
            const uint8_t currentVal = controlRegister[(size_t) channel];
            const uint8_t newVal = (uint8_t) (on ? (currentVal | mask) : (currentVal & ~mask));

            controlRegister[(size_t) channel] = newVal;
            sid.write (address, newVal);
            break;
        }

        case RpnMsb:
            rpnMsb[(size_t) channel] = (uint8_t) value;
            break;

        case RpnLsb:
            rpnLsb[(size_t) channel] = (uint8_t) value;
            break;

        case DataEntryMsb:
            if (rpnMsb[(size_t) channel] == 0 && rpnLsb[(size_t) channel] == 0)
                maxBendSemitones[(size_t) channel] = (uint8_t) value;
            break;

        case AdsrWorkaroundGlobal:
            adsrWorkaroundGlobalEnabled = (value >= 64);
            break;

        case AdsrWorkaroundChannel:
            adsrWorkaroundChannelEnabled[(size_t) channel] = (value >= 64);
            break;

        default:
            break;
    }
}
