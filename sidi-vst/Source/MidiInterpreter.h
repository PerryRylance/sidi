#pragma once

#include "ISidChip.h"
#include <juce_audio_basics/juce_audio_basics.h>
#include <array>
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
    std::array<int, 3> lastPressedKey { -1, -1, -1 };
    uint8_t filterResonanceSelect = 0;
    uint8_t filterModeVolumeSelect = 0;

    std::array<uint8_t, 3> rpnMsb { 127, 127, 127 };
    std::array<uint8_t, 3> rpnLsb { 127, 127, 127 };
    std::array<uint8_t, 3> maxBendSemitones { 2, 2, 2 };
    std::array<float, 3> pitchBendAmount {};
};
