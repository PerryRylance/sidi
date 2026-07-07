#include "../Source/ContinuousController.h"
#include "Support/PowerSetInterpretationTestHelper.h"

// Port of the 'waveform interpretation' describe block (testControlRegisterBits
// call) in sidi-web/tests/interpreter.test.ts.
class WaveformInterpretationTests : public juce::UnitTest
{
public:
    WaveformInterpretationTests() : juce::UnitTest ("Waveform interpretation", "MidiInterpreter") {}

    void runTest() override
    {
        const std::vector<ControlBit> bits = {
            { ContinuousController::Tri,   0x10, "tri" },
            { ContinuousController::Saw,   0x20, "saw" },
            { ContinuousController::Pulse, 0x40, "pulse" },
            { ContinuousController::Noise, 0x80, "noise" },
        };

        for (int channel = 0; channel < 3; ++channel)
        {
            beginTest ("waveform bit combinations, channel " + juce::String (channel));
            expectControlBitPowerSet (*this, channel, channel * 7 + 4, bits);
        }
    }
};

static WaveformInterpretationTests waveformInterpretationTests;
