#include "SidRegisterInterpreter.h"

// NB: Left as no-ops so the ported test suite in ./Tests compiles, links,
// and runs red. Port the logic from sidi-web/src/Driver.ts's interpret*()
// methods here.

SidRegisterInterpreter::SidRegisterInterpreter (ISidChip& sidChip)
    : sid (sidChip)
{
}

void SidRegisterInterpreter::noteOn (int, int)
{
}

void SidRegisterInterpreter::noteOff (int, int)
{
}

void SidRegisterInterpreter::pitchWheel (int, float)
{
}

void SidRegisterInterpreter::controller (int, int, int)
{
}
