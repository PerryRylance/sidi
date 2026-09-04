#pragma once

#include "ISidChip.h"
#include <juce_audio_basics/juce_audio_basics.h>
#include <array>
#include <atomic>
#include <cstdint>

/**
    Translates MIDI events into SID register writes on the ISidChip it's
    given. Mirrors sidi-web/src/Driver.ts's single `interpret(event)` entry
    point: takes a juce::MidiMessage and dispatches on its type internally,
    rather than exposing one method per message type.

    MIDI channels are 1-based per JUCE convention; they map to 0-based
    oscillator indices (channels 1-3 select oscillators 0-2, see the
    top-level README).
*/
class MidiInterpreter
{
public:
    // NB: initialControlRegister/initialSustainRelease/initialFilterModeVolumeSelect should be the
    // real chip's power-on defaults (see SidChipAdapter::DEFAULT_CONTROL_REGISTER/
    // DEFAULT_SUSTAIN_RELEASE/DEFAULT_FILTER_MODE_VOLUME) - write-only SID registers can't be read
    // back reliably, so these shadow copies must be seeded explicitly by the caller rather than
    // assumed here. Mirrors sidi-web/src/MidiInterpreter.ts's constructor.
    explicit MidiInterpreter (ISidChip& sidChip, uint8_t initialControlRegister = 0, uint8_t initialSustainRelease = 0,
                               uint8_t initialFilterModeVolumeSelect = 0);

    void process (const juce::MidiMessage& message);

    // NB: Safe to call from any thread; used by the editor to display live
    // interpreter state (not reflected in the SID's own registers) without
    // touching the audio thread's data.
    int getLastPressedKey (int channel) const noexcept { return lastPressedKey[(size_t) channel].load (std::memory_order_relaxed); }
    uint8_t getRpnMsb (int channel) const noexcept { return rpnMsb[(size_t) channel].load (std::memory_order_relaxed); }
    uint8_t getRpnLsb (int channel) const noexcept { return rpnLsb[(size_t) channel].load (std::memory_order_relaxed); }
    uint8_t getMaxBendSemitones (int channel) const noexcept { return maxBendSemitones[(size_t) channel].load (std::memory_order_relaxed); }
    float getPitchBendAmount (int channel) const noexcept { return pitchBendAmount[(size_t) channel].load (std::memory_order_relaxed); }

    // NB: See ContinuousController::AdsrWorkaroundGlobal/AdsrWorkaroundChannel.
    // Global is a single engine-wide flag regardless of which channel the CC
    // arrived on; the per-channel flag only has an effect while global is on.
    bool isAdsrWorkaroundGlobalEnabled() const noexcept { return adsrWorkaroundGlobalEnabled.load (std::memory_order_relaxed); }
    bool isAdsrWorkaroundEnabledForChannel (int channel) const noexcept { return adsrWorkaroundChannelEnabled[(size_t) channel].load (std::memory_order_relaxed); }

    // NB: True after processNoteOn primed the ADSR registers to attack=0/
    // sustain=max on channel (see processNoteOn) and until releaseAdsrHold(channel)
    // - or a subsequent note off - clears it. The block-processing layer polls
    // this right after feeding a note-on through process() to know whether to
    // schedule a releaseAdsrHold() call ~30ms of chip time later.
    bool hasPendingAdsrRelease (int channel) const noexcept { return pendingAdsrRelease[(size_t) channel].load (std::memory_order_relaxed); }

    // NB: Restores the patch's real ATTACK_DECAY/SUSTAIN_RELEASE values in
    // place of processNoteOn's priming ones - the "fully controlled, audible
    // moment" once the ~30ms hold has given the envelope's rate counter time
    // to recapture (see processNoteOn and https://csdb.dk/forums/?roomid=14&topicid=159900).
    // GATE is left alone throughout - there's no TEST bit involved to release.
    // No-op if there's no pending hold on this channel (eg. it was already
    // cleared by a note off).
    void releaseAdsrHold (int channel);

private:
    void processNoteOn (const juce::MidiMessage& message);
    void processNoteOff (const juce::MidiMessage& message);
    void processPitchWheel (const juce::MidiMessage& message);
    void processController (const juce::MidiMessage& message);

    void updateFrequency (int channel);

    ISidChip& sid;

    double clockFrequencyHz = 985248.0; // NB: PAL clock, see sidi-web/src/ClockFrequencyHz.ts

    std::array<uint8_t, 3> attackDecay {};
    std::array<uint8_t, 3> sustainRelease {};
    std::array<uint8_t, 3> controlRegister {};
    std::array<std::atomic<int>, 3> lastPressedKey { -1, -1, -1 };
    uint8_t filterResonanceSelect = 0;
    uint8_t filterModeVolumeSelect = 0;

    std::atomic<bool> adsrWorkaroundGlobalEnabled { false };
    std::array<std::atomic<bool>, 3> adsrWorkaroundChannelEnabled { false, false, false };
    std::array<std::atomic<bool>, 3> pendingAdsrRelease { false, false, false };

    std::array<std::atomic<uint8_t>, 3> rpnMsb { 127, 127, 127 };
    std::array<std::atomic<uint8_t>, 3> rpnLsb { 127, 127, 127 };
    std::array<std::atomic<uint8_t>, 3> maxBendSemitones { 2, 2, 2 };
    std::array<std::atomic<float>, 3> pitchBendAmount { 0.0f, 0.0f, 0.0f };
};
