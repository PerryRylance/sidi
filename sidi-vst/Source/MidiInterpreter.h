#pragma once

#include "ISidChip.h"
#include <juce_audio_basics/juce_audio_basics.h>

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
    ISidChip& sid;
};
