#include "Support/FakeSidChip.h"
#include "Support/SidRegisterInterpreter.h"
#include <juce_core/juce_core.h>

// Port of the 'note control interpretation' describe block (GATE bit
// behaviour across overlapping note on/off sequences) in
// sidi-web/tests/interpreter.test.ts.
class NoteControlInterpretationTests : public juce::UnitTest
{
public:
    NoteControlInterpretationTests() : juce::UnitTest ("Note control interpretation", "SidRegisterInterpreter") {}

    void runTest() override
    {
        for (int channel = 0; channel < 3; ++channel)
        {
            testNoteOnTurnsGateOn (channel);
            testNoteOnThenOffTurnsGateOff (channel);
            testOverlappingNotesKeepGateOnUntilLastKeyReleased (channel);
            testReleasingLastPressedKeyTurnsGateOff (channel);
        }
    }

private:
    void testNoteOnTurnsGateOn (int channel)
    {
        beginTest ("interpreting a note on turns the GATE bit ON, channel " + juce::String (channel));

        FakeSidChip sid;
        SidRegisterInterpreter interpreter (sid);

        interpreter.noteOn (channel, 60);

        const int address = channel * 7 + 4;
        expectEquals (sid.registers[(size_t) address] & 0x01, 0x01);
    }

    void testNoteOnThenOffTurnsGateOff (int channel)
    {
        beginTest ("note on followed by note off on the same pitch turns the GATE bit OFF, channel "
                   + juce::String (channel));

        FakeSidChip sid;
        SidRegisterInterpreter interpreter (sid);

        interpreter.noteOn (channel, 60);
        interpreter.noteOff (channel, 60);

        const int address = channel * 7 + 4;
        expectEquals (sid.registers[(size_t) address] & 0x01, 0x00);
    }

    void testOverlappingNotesKeepGateOnUntilLastKeyReleased (int channel)
    {
        beginTest ("note on, then a different note on, then note off on the original key keeps the GATE bit ON, channel "
                   + juce::String (channel));

        FakeSidChip sid;
        SidRegisterInterpreter interpreter (sid);

        interpreter.noteOn (channel, 60);  // Press Note A
        interpreter.noteOn (channel, 64);  // Press Note B (last pressed)
        interpreter.noteOff (channel, 60); // Release Note A (not the last pressed note)

        const int address = channel * 7 + 4;
        expectEquals (sid.registers[(size_t) address] & 0x01, 0x01);
    }

    void testReleasingLastPressedKeyTurnsGateOff (int channel)
    {
        beginTest ("note on, then a different note on, then note off on the original key, "
                   "then note off on the last note on key, sets the GATE bit OFF, channel "
                   + juce::String (channel));

        FakeSidChip sid;
        SidRegisterInterpreter interpreter (sid);

        interpreter.noteOn (channel, 60);  // Press Note A
        interpreter.noteOn (channel, 64);  // Press Note B (last pressed)
        interpreter.noteOff (channel, 60); // Release Note A (not the last pressed note)

        const int address = channel * 7 + 4;
        expectEquals (sid.registers[(size_t) address] & 0x01, 0x01); // Gate should still be ON

        interpreter.noteOff (channel, 64); // Release Note B (the last pressed note)

        expectEquals (sid.registers[(size_t) address] & 0x01, 0x00); // Gate should now be OFF
    }
};

static NoteControlInterpretationTests noteControlInterpretationTests;
