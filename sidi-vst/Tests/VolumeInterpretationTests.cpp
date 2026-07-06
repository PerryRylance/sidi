#include "Support/ContinuousController.h"
#include "Support/FakeSidChip.h"
#include "Support/SidRegisterInterpreter.h"
#include <juce_core/juce_core.h>

// Port of the 'volume interpretation' describe block in
// sidi-web/tests/interpreter.test.ts.
class VolumeInterpretationTests : public juce::UnitTest
{
public:
    VolumeInterpretationTests() : juce::UnitTest ("Volume interpretation", "SidRegisterInterpreter") {}

    void runTest() override
    {
        for (int channel = 0; channel < 3; ++channel)
        {
            testVolumeNibble (channel);
            testVolumePreservesOtherBits (channel);
        }
    }

private:
    void testVolumeNibble (int channel)
    {
        struct Case
        {
            int value;
            int expectedVolume;
        };

        const Case cases[] = {
            { 0,   0x0 },
            { 64,  0x8 },
            { 127, 0xF },
        };

        beginTest ("for midi cc " + juce::String (ContinuousController::MainVolume)
                   + " writes expected 4-bit volume level, channel " + juce::String (channel));

        for (auto& c : cases)
        {
            FakeSidChip sid;
            SidRegisterInterpreter interpreter (sid);

            interpreter.controller (channel, ContinuousController::MainVolume, c.value);

            const int volumeBits = sid.registers[0x18] & 0x0F;
            expectEquals (volumeBits, c.expectedVolume, "value " + juce::String (c.value));
        }
    }

    void testVolumePreservesOtherBits (int channel)
    {
        beginTest ("volume controls preserve other bits in register $18, channel " + juce::String (channel));

        FakeSidChip sid;
        SidRegisterInterpreter interpreter (sid);

        interpreter.controller (channel, ContinuousController::FilterLowPass, 127);
        expectEquals ((int) sid.registers[0x18], 0x10);

        interpreter.controller (channel, ContinuousController::MainVolume, 127);
        expectEquals ((int) sid.registers[0x18], 0x10 | 0x0F);

        interpreter.controller (channel, ContinuousController::FilterLowPass, 0);
        expectEquals ((int) sid.registers[0x18], 0x0F);
    }
};

static VolumeInterpretationTests volumeInterpretationTests;
