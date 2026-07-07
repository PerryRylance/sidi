#include "../Source/ContinuousController.h"
#include "Support/FakeSidChip.h"
#include "../Source/MidiInterpreter.h"
#include <juce_core/juce_core.h>

// Port of the 'pulse width interpretation' describe block in
// sidi-web/tests/interpreter.test.ts.
class PulseWidthInterpretationTests : public juce::UnitTest
{
public:
    PulseWidthInterpretationTests() : juce::UnitTest ("Pulse width interpretation", "MidiInterpreter") {}

    void runTest() override
    {
        struct Case
        {
            int width;
            int lo, hi;
        };

        const Case cases[] = {
            { 0x00, 0x00, 0x00 },
            { 0x3F, 0xEF, 0x07 },
            { 0x7F, 0xFF, 0x0F },
        };

        for (int channel = 0; channel < 3; ++channel)
        {
            beginTest ("for midi cc " + juce::String (ContinuousController::PulseWidth)
                       + " writes expected bytes, channel " + juce::String (channel));

            for (auto& c : cases)
            {
                FakeSidChip sid;
                MidiInterpreter interpreter (sid);

                interpreter.controller (channel, ContinuousController::PulseWidth, c.width);

                const int address = channel * 7 + 2;
                expectEquals ((int) sid.registers[(size_t) address], c.lo,
                              "width " + juce::String (c.width) + " lo byte");
                expectEquals ((int) sid.registers[(size_t) address + 1], c.hi,
                              "width " + juce::String (c.width) + " hi byte");
            }
        }
    }
};

static PulseWidthInterpretationTests pulseWidthInterpretationTests;
