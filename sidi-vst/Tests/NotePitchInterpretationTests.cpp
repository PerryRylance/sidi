#include "Support/FakeSidChip.h"
#include "../Source/MidiInterpreter.h"
#include <juce_core/juce_core.h>

// Port of the 'note pitch interpretation' describe block in
// sidi-web/tests/interpreter.test.ts.
class NotePitchInterpretationTests : public juce::UnitTest
{
public:
    NotePitchInterpretationTests() : juce::UnitTest ("Note pitch interpretation", "MidiInterpreter") {}

    void runTest() override
    {
        struct Case
        {
            int key;
            int lo, hi;
        };

        const Case cases[] = {
            { 21,  0xD4, 0x01 },
            { 60,  0x67, 0x11 },
            { 106, 0x10, 0xF8 },
        };

        for (int channel = 0; channel < 3; ++channel)
        {
            beginTest ("for midi pitch writes expected bytes, channel " + juce::String (channel));

            for (auto& c : cases)
            {
                FakeSidChip sid;
                MidiInterpreter interpreter (sid);

                interpreter.noteOn (channel, c.key);

                const int address = channel * 7;
                expectEquals ((int) sid.registers[(size_t) address], c.lo,
                              "pitch " + juce::String (c.key) + " lo byte");
                expectEquals ((int) sid.registers[(size_t) address + 1], c.hi,
                              "pitch " + juce::String (c.key) + " hi byte");
            }
        }
    }
};

static NotePitchInterpretationTests notePitchInterpretationTests;
