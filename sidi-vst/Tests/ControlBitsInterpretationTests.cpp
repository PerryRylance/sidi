#include "../Source/ContinuousController.h"
#include "Support/PowerSetInterpretationTestHelper.h"

// Port of the 'control interpretation' describe block (testControlRegisterBits
// call, GATE/SYNC/RING/TEST bits) in sidi-web/tests/interpreter.test.ts.
class ControlBitsInterpretationTests : public juce::UnitTest
{
public:
    ControlBitsInterpretationTests() : juce::UnitTest ("Control bits interpretation", "MidiInterpreter") {}

    void runTest() override
    {
        const std::vector<ControlBit> bits = {
            { ContinuousController::Gate, 0x01, "gate" },
            { ContinuousController::Sync, 0x02, "sync" },
            { ContinuousController::Ring, 0x04, "ring" },
            { ContinuousController::Test, 0x08, "test" },
        };

        for (int channel = 0; channel < 3; ++channel)
        {
            beginTest ("gate/sync/ring/test bit combinations, channel " + juce::String (channel));
            expectControlBitPowerSet (*this, channel, channel * 7 + 4, bits);
        }
    }
};

static ControlBitsInterpretationTests controlBitsInterpretationTests;
