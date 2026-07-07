#include "MidiInterpreter.h"

// NB: Left as no-ops so the ported test suite in ../Tests compiles, links,
// and runs red. Port the logic from sidi-web/src/Driver.ts's interpret*()
// methods here.

MidiInterpreter::MidiInterpreter (ISidChip& sidChip)
    : sid (sidChip)
{
}

void MidiInterpreter::noteOn (int, int)
{
}

void MidiInterpreter::noteOff (int, int)
{
}

void MidiInterpreter::pitchWheel (int, float)
{
}

void MidiInterpreter::controller (int, int, int)
{
}
