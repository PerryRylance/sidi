#pragma once

#include "ISidChip.h"

/**
    Translates MIDI events into SID register writes on the ISidChip it's
    given. This is the C++ port target for the interpret*() methods in
    sidi-web/src/Driver.ts, pulled out into its own class (rather than
    living as private methods on a Driver equivalent) so it can be driven
    directly from tests without needing a TypeScript-style private-method
    cast trick.
*/
class MidiInterpreter
{
public:
    explicit MidiInterpreter (ISidChip& sidChip);

    void noteOn (int channel, int key);
    void noteOff (int channel, int key);
    void pitchWheel (int channel, float amount);
    void controller (int channel, int number, int value);

private:
    ISidChip& sid;
};
