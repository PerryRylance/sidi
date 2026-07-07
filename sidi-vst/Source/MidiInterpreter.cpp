#include "MidiInterpreter.h"

// NB: Left as a no-op so the ported test suite in ../Tests compiles, links,
// and runs red. Port the logic from sidi-web/src/Driver.ts's interpret*()
// methods here, dispatching on the incoming juce::MidiMessage.

MidiInterpreter::MidiInterpreter (ISidChip& sidChip)
    : sid (sidChip)
{
}

void MidiInterpreter::process (const juce::MidiMessage&)
{
}
