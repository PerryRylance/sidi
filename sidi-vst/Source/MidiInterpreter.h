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
    explicit MidiInterpreter (ISidChip& sidChip);

    void process (const juce::MidiMessage& message);

    // NB: Safe to call from any thread; used by the editor to display live
    // interpreter state (not reflected in the SID's own registers) without
    // touching the audio thread's data.
    int getLastPressedKey (int channel) const noexcept { return lastPressedKey[(size_t) channel].load (std::memory_order_relaxed); }
    uint8_t getRpnMsb (int channel) const noexcept { return rpnMsb[(size_t) channel].load (std::memory_order_relaxed); }
    uint8_t getRpnLsb (int channel) const noexcept { return rpnLsb[(size_t) channel].load (std::memory_order_relaxed); }
    uint8_t getMaxBendSemitones (int channel) const noexcept { return maxBendSemitones[(size_t) channel].load (std::memory_order_relaxed); }
    float getPitchBendAmount (int channel) const noexcept { return pitchBendAmount[(size_t) channel].load (std::memory_order_relaxed); }

private:
    void processNoteOn (const juce::MidiMessage& message);
    void processNoteOff (const juce::MidiMessage& message);
    void processPitchWheel (const juce::MidiMessage& message);
    void processController (const juce::MidiMessage& message);

    void updateFrequency (int channel);

    ISidChip& sid;

    double clockFrequencyHz = 985248.0; // NB: PAL clock, see sidi-web/src/ClockFrequencyHz.ts

    std::array<uint8_t, 3> attackDecay {};
    std::array<uint8_t, 3> sustainRelease { 0xF0, 0xF0, 0xF0 }; // NB: Full sustain, no release - mirrors SidChipAdapter's hardware default
    std::array<uint8_t, 3> controlRegister { 0x20, 0x20, 0x20 }; // NB: Default saw waveform
    std::array<std::atomic<int>, 3> lastPressedKey { -1, -1, -1 };
    uint8_t filterResonanceSelect = 0;
    uint8_t filterModeVolumeSelect = 0;

    std::array<std::atomic<uint8_t>, 3> rpnMsb { 127, 127, 127 };
    std::array<std::atomic<uint8_t>, 3> rpnLsb { 127, 127, 127 };
    std::array<std::atomic<uint8_t>, 3> maxBendSemitones { 2, 2, 2 };
    std::array<std::atomic<float>, 3> pitchBendAmount { 0.0f, 0.0f, 0.0f };
};
