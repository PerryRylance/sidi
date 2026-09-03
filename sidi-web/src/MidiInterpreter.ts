import { Event, ControlEvent, MetaEvent, NoteOnEvent, NoteOffEvent, ControllerEvent, SysExEvent, PitchWheelEvent } from "@perry-rylance/midi";
import { SID } from "../compiled/libresidfp";
import { Pal } from "./ClockFrequencyHz";
import ContinuousController from "./ContinuousController";

const { Attack, Decay, PulseWidth, Release, Sustain, Tri, Saw, Pulse, Noise, Gate, Sync, Ring, Test, FilterCutoff, FilterResonance, FilterEnable, FilterLowPass, FilterBandPass, FilterHighPass, Oscillator3Mute, MainVolume, AdsrWorkaroundGlobal, AdsrWorkaroundChannel } = ContinuousController;

export default class MidiInterpreter
{
    private pcmFrequencyHz: number = 44100;
    private attackDecay: Uint8Array = new Uint8Array(3);
    private sustainRelease: Uint8Array = new Uint8Array(3);
    private controlRegister: Uint8Array = new Uint8Array(3);
    // NB: See flush() - the control register packs waveform select bits alongside gate/sync/ring/
    // test, but a MIDI voice change typically arrives as several same-tick CC events (eg. Noise off
    // then Tri on). Writing each one straight to the chip means the chip briefly, but really, sees an
    // all-zero waveform selection mid-change - and reSIDfp's WaveformGenerator::writeCONTROL_REG
    // faithfully treats that as the real "floating DAC input" hardware state, arming a ~55-800k-cycle
    // fade timer that later corrupts whatever's actually playing when it expires. Deferring the write
    // until the value has settled avoids ever exposing that transient state to the chip.
    private controlRegisterDirty: boolean[] = [false, false, false];
    private lastPressedKey: Array<number | null> = [null, null, null];
    private filterResonanceSelect: number = 0;
    private filterModeVolumeSelect: number = 0;

    private adsrWorkaroundGlobalEnabled: boolean = false;
    private adsrWorkaroundChannelEnabled: boolean[] = [false, false, false];
    private pendingAdsrRelease: boolean[] = [false, false, false];

    private rpnMsb: Uint8Array = new Uint8Array([127, 127, 127]);
    private rpnLsb: Uint8Array = new Uint8Array([127, 127, 127]);
    private maxBendSemitones: Uint8Array = new Uint8Array([2, 2, 2]);
    private pitchBendAmount: Float32Array = new Float32Array(3);

    constructor(
        private sid: SID,
        private clockFrequencyHz: number = Pal,
        initialControlRegister: number = 0,
        initialSustainRelease: number = 0,
    )
    {
        this.sid.setSamplingParameters(this.clockFrequencyHz, 0, this.pcmFrequencyHz);

        // NB: Seed our shadow copies from explicit values rather than the chip itself - write-only
        // SID registers share a single external data bus, so reading one back after some other,
        // later register write (eg. SidChipAdapter's main volume write) returns that later write's
        // value, not what's actually at the address being read. Callers wrapping an adapter that
        // applies its own power-on defaults (eg. SidChipAdapter) should pass those values in here.
        for (let channel = 0; channel < 3; channel++)
        {
            this.controlRegister[channel] = initialControlRegister;
            this.sustainRelease[channel] = initialSustainRelease;
        }
    }

    private getExtrapolatedBitValue(value: number, inBits: number, outBits: number)
    {
        const maxIn = (1 << inBits) - 1;
        const maxOut = (1 << outBits) - 1;

        if (maxIn <= 0) return 0;

        return Math.round((value / maxIn) * maxOut);
    }

    private updateFrequency(channel: number): void
    {
        const key = this.lastPressedKey[channel];
        if (key === null) return;

        const bendAmount = this.pitchBendAmount[channel];
        const bendRange = this.maxBendSemitones[channel];
        const bentKey = key + (bendAmount * bendRange);

        const frequencyHz = 440 * Math.pow(2, (bentKey - 69) / 12);
        const regValue = Math.round((frequencyHz * 16777216) / this.clockFrequencyHz);
        const clamped = Math.max(0, Math.min(65535, regValue));

        const offset = channel * 7;
        const lo = clamped & 0xFF;
        const hi = (clamped >> 8) & 0xFF;

        this.sid.write(offset + 0, lo);
        this.sid.write(offset + 1, hi);
    }

    private processNoteOn(event: NoteOnEvent): void
    {
        if(event.channel > 2)
            return;

        this.lastPressedKey[event.channel] = event.key;
        this.updateFrequency(event.channel);

        const offset = event.channel * 7;

        // NB: The real SID's envelope rate counter never resets between notes (the
        // "ADSR bug" - see the MIDIbox SID manual's drum section and
        // https://csdb.dk/forums/?roomid=14&topicid=159900), so attack timing after
        // a bare GATE edge can jitter by up to ~30ms depending on where that counter
        // already was. TEST does NOT touch the envelope generator at all (confirmed
        // in that thread by someone who's read reSIDfp's ADSR implementation) - it
        // only resets the waveform generator, so it buys nothing for the bug and
        // only risks an audible click. Mirrors sidi-vst's MidiInterpreter.cpp.
        const useAdsrWorkaround = this.adsrWorkaroundGlobalEnabled && this.adsrWorkaroundChannelEnabled[event.channel];

        if (useAdsrWorkaround)
        {
            this.pendingAdsrRelease[event.channel] = true;

            // NB: Zeroing the whole control register guarantees a real 0->1 GATE
            // edge below (see the "already gated" comment in the non-workaround
            // branch - the same problem applies here), and priming attack=0/
            // sustain=max on top of that clean edge makes the rate counter
            // recapture near-instantly instead of jittering.
            this.sid.write(offset + 4, 0x00);

            // NB: GATE alone starts the envelope (reSIDfp's EnvelopeGenerator knows
            // nothing about TEST), so without this the patch's real attack/decay
            // would run to completion silently, and releasing the hold later would
            // only ever reveal whatever's left of the envelope by then (eg. a kick
            // with its punch already decayed away). Forcing attack=0, sustain=max
            // here races the envelope to full peak and parks it there well within
            // the hold, regardless of the patch's real values; releaseAdsrHold()
            // swaps those real values back in once the hold elapses, so the
            // audible decay starts fresh from peak, exactly on time.
            this.sid.write(offset + 5, 0x00);
            this.sid.write(offset + 6, 0xF0);
        }
        else if (this.controlRegister[event.channel] & 0x01)
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
            this.sid.write(offset + 4, this.controlRegister[event.channel] & ~0x01);
        }

        this.controlRegister[event.channel] |= 0x01;
        this.sid.write(offset + 4, this.controlRegister[event.channel]);
        this.controlRegisterDirty[event.channel] = false;
    }

    private processPitchWheel(event: PitchWheelEvent): void
    {
        if(event.channel > 2)
            return;

        this.pitchBendAmount[event.channel] = event.amount;
        this.updateFrequency(event.channel);
    }

    private processNoteOff(event: NoteOffEvent): void
    {
        if(event.channel > 2)
            return;

        if (this.lastPressedKey[event.channel] === event.key)
        {
            const offset = event.channel * 7;
            this.controlRegister[event.channel] &= ~0x01;

            // NB: A note off arriving mid-hold (before releaseAdsrHold's ~30ms hold
            // has elapsed) must not release using the priming ADSR values still
            // sitting in the registers (see processNoteOn) - restore the patch's
            // real values so GATE's fall uses the intended release rate.
            if (this.pendingAdsrRelease[event.channel])
            {
                this.sid.write(offset + 5, this.attackDecay[event.channel]);
                this.sid.write(offset + 6, this.sustainRelease[event.channel]);

                this.pendingAdsrRelease[event.channel] = false;
            }

            this.sid.write(offset + 4, this.controlRegister[event.channel]);
            this.controlRegisterDirty[event.channel] = false;
            this.lastPressedKey[event.channel] = null;
        }
    }

    // NB: True after processNoteOn primed the ADSR registers to attack=0/sustain=max on channel
    // (see processNoteOn) and until releaseAdsrHold(channel) - or a subsequent note off - clears
    // it. The scheduling layer (Processor) polls this right after feeding a note on through
    // process() to know whether to schedule a releaseAdsrHold() call ~30ms of sample-time later.
    // Mirrors sidi-vst's MidiInterpreter::hasPendingAdsrRelease.
    hasPendingAdsrRelease(channel: number): boolean
    {
        return this.pendingAdsrRelease[channel];
    }

    // NB: Restores the patch's real ATTACK_DECAY/SUSTAIN_RELEASE values in place of processNoteOn's
    // priming ones - the "fully controlled, audible moment" once the ~30ms hold has given the
    // envelope's rate counter time to recapture (see processNoteOn and
    // https://csdb.dk/forums/?roomid=14&topicid=159900). GATE is left alone throughout - there's
    // no TEST bit involved to release. No-op if there's no pending hold on this channel (eg. it
    // was already cleared by a note off). Mirrors sidi-vst's MidiInterpreter::releaseAdsrHold.
    releaseAdsrHold(channel: number): void
    {
        if (!this.pendingAdsrRelease[channel])
            return;

        const offset = channel * 7;

        this.sid.write(offset + 5, this.attackDecay[channel]);
        this.sid.write(offset + 6, this.sustainRelease[channel]);

        this.pendingAdsrRelease[channel] = false;
    }

    // NB: See ContinuousController.AdsrWorkaroundGlobal/AdsrWorkaroundChannel. Global is a single
    // engine-wide flag regardless of which channel the CC arrived on; the per-channel flag only
    // has an effect while global is on. Mirrors sidi-vst's MidiInterpreter's equivalent getters.
    isAdsrWorkaroundGlobalEnabled(): boolean
    {
        return this.adsrWorkaroundGlobalEnabled;
    }

    isAdsrWorkaroundEnabledForChannel(channel: number): boolean
    {
        return this.adsrWorkaroundChannelEnabled[channel];
    }

    private processController(event: ControllerEvent): void
    {
        switch(Number(event.controller))
        {
            case FilterCutoff: {
                const mapped = this.getExtrapolatedBitValue(event.value, 7, 11);
                const lo = mapped & 0x07;
                const hi = (mapped >> 3) & 0xFF;

                this.sid.write(0x15, lo);
                this.sid.write(0x16, hi);
                break;
            }

            case FilterResonance: {
                const mapped = this.getExtrapolatedBitValue(event.value, 7, 4);
                this.filterResonanceSelect = (this.filterResonanceSelect & 0x0F) | (mapped << 4);
                this.sid.write(0x17, this.filterResonanceSelect);
                break;
            }

            case FilterEnable: {
                const on = event.value >= 64;
                const mask = 1 << event.channel;
                this.filterResonanceSelect = on
                    ? (this.filterResonanceSelect | mask)
                    : (this.filterResonanceSelect & ~mask);
                this.sid.write(0x17, this.filterResonanceSelect);
                break;
            }

            case FilterLowPass:
            case FilterBandPass:
            case FilterHighPass:
            case Oscillator3Mute: {
                const on = event.value >= 64;
                const maskMap: Record<number, number> = {
                    [FilterLowPass]:  0x10,
                    [FilterBandPass]: 0x20,
                    [FilterHighPass]: 0x40,
                    [Oscillator3Mute]: 0x80,
                };
                const mask = maskMap[event.controller];
                this.filterModeVolumeSelect = on
                    ? (this.filterModeVolumeSelect | mask)
                    : (this.filterModeVolumeSelect & ~mask);
                this.sid.write(0x18, this.filterModeVolumeSelect);
                break;
            }

            case MainVolume: {
                const mapped = this.getExtrapolatedBitValue(event.value, 7, 4);
                this.filterModeVolumeSelect = (this.filterModeVolumeSelect & 0xF0) | mapped;
                this.sid.write(0x18, this.filterModeVolumeSelect);
                break;
            }

            case PulseWidth:
                if(event.channel > 2) return;

                // NB: Pulse width modulation
                const mapped = this.getExtrapolatedBitValue(event.value, 7, 12);
                const offset = event.channel * 7 + 2;
                const lo = mapped & 0xFF;
                const hi = (mapped >> 8) & 0xFF;

                this.sid.write(offset + 0, lo);
                this.sid.write(offset + 1, hi);

                break;

            case Attack:
            case Decay:
            case Sustain:
            case Release: {
                if(event.channel > 2) return;

                const mapped = this.getExtrapolatedBitValue(event.value, 7, 4);
                const config: Record<number, { array: Uint8Array, shift: number, mask: number, regOffset: number }> = {
                    [Attack]:  { array: this.attackDecay,       shift: 4, mask: 0x0F, regOffset: 5 },
                    [Decay]:   { array: this.attackDecay,       shift: 0, mask: 0xF0, regOffset: 5 },
                    [Sustain]: { array: this.sustainRelease,    shift: 4, mask: 0x0F, regOffset: 6 },
                    [Release]: { array: this.sustainRelease,    shift: 0, mask: 0xF0, regOffset: 6 },
                };

                const { array, shift, mask, regOffset } = config[event.controller];
                const address = event.channel * 7 + regOffset;
                const currentVal = array[event.channel];
                const newVal = (currentVal & mask) | (mapped << shift);

                array[event.channel] = newVal;
                this.sid.write(address, newVal);
                break;
            }
            case Tri:
            case Saw:
            case Pulse:
            case Noise:
            case Gate:
            case Sync:
            case Ring:
            case Test: {
                if(event.channel > 2) return;

                const on = event.value >= 64;
                const maskMap: Record<number, number> = {
                    [Gate]:  0x01,
                    [Sync]:  0x02,
                    [Ring]:  0x04,
                    [Test]:  0x08,
                    [Tri]:   0x10,
                    [Saw]:   0x20,
                    [Pulse]: 0x40,
                    [Noise]: 0x80,
                };
                const mask = maskMap[event.controller];
                const currentVal = this.controlRegister[event.channel];
                const newVal = on ? (currentVal | mask) : (currentVal & ~mask);

                // NB: Not written to the chip here - see flush() and the comment on
                // controlRegisterDirty for why.
                this.controlRegister[event.channel] = newVal;
                this.controlRegisterDirty[event.channel] = true;
                break;
            }
            case AdsrWorkaroundGlobal:
                this.adsrWorkaroundGlobalEnabled = event.value >= 64;
                break;

            case AdsrWorkaroundChannel:
                if(event.channel > 2) return;
                this.adsrWorkaroundChannelEnabled[event.channel] = event.value >= 64;
                break;

            case 101: // RPN MSB Selection
                if(event.channel > 2) return;
                this.rpnMsb[event.channel] = event.value;
                break;

            case 100: // RPN LSB Selection
                if(event.channel > 2) return;
                this.rpnLsb[event.channel] = event.value;
                break;

            case 6: // Data Entry MSB (Sets the value of the selected RPN)
                if(event.channel > 2) return;
                if (this.rpnMsb[event.channel] === 0 && this.rpnLsb[event.channel] === 0) {
                    this.maxBendSemitones[event.channel] = event.value;
                }
                break;
        }
    }

    // NB: Commits any control register bits (waveform/sync/ring/test - not gate, which processNoteOn
    // and processNoteOff always write immediately for their own reasons) deferred by processController.
    // Must be called before any real time advance (Processor.process()'s clock() calls) - otherwise a
    // voice change with no accompanying note on/off at the same tick would never reach the chip.
    flush(): void
    {
        for (let channel = 0; channel < 3; channel++)
        {
            if (this.controlRegisterDirty[channel])
            {
                this.sid.write(channel * 7 + 4, this.controlRegister[channel]);
                this.controlRegisterDirty[channel] = false;
            }
        }
    }

    // NB: Public dispatcher mirrors sidi-vst's MidiInterpreter::process(const juce::MidiMessage&).
    process(event: Event): void
    {
        if(event instanceof ControllerEvent)
            return this.processController(event);

        if(event instanceof NoteOnEvent)
            return this.processNoteOn(event);

        if(event instanceof NoteOffEvent)
            return this.processNoteOff(event);

        if(event instanceof PitchWheelEvent)
            return this.processPitchWheel(event);
    }
}
