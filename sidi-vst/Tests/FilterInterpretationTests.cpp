#include "../Source/ContinuousController.h"
#include "Support/FakeSidChip.h"
#include "Support/PowerSetInterpretationTestHelper.h"
#include "../Source/MidiInterpreter.h"
#include <juce_core/juce_core.h>

// Port of the 'filter interpretation' describe block in
// sidi-web/tests/interpreter.test.ts.
class FilterInterpretationTests : public juce::UnitTest
{
public:
    FilterInterpretationTests() : juce::UnitTest ("Filter interpretation", "MidiInterpreter") {}

    void runTest() override
    {
        for (int channel = 0; channel < 3; ++channel)
        {
            testFilterCutoff (channel);
            testFilterResonance (channel);
            testFilterEnable (channel);
            testFilterRegisterPreservesOtherBits (channel);
            testFilterModeBitCombinations (channel);
            testOscillator3Mute (channel);
            testFilterModeRegisterPreservesOtherBits (channel);
        }
    }

private:
    void testFilterCutoff (int channel)
    {
        struct Case
        {
            int value;
            int lo, hi;
        };

        const Case cases[] = {
            { 0,   0x00, 0x00 },
            { 63,  0x07, 0x7E },
            { 127, 0x07, 0xFF },
        };

        beginTest ("for midi cc " + juce::String (ContinuousController::FilterCutoff)
                   + " writes expected bytes, channel " + juce::String (channel));

        for (auto& c : cases)
        {
            FakeSidChip sid;
            MidiInterpreter interpreter (sid);

            interpreter.controller (channel, ContinuousController::FilterCutoff, c.value);

            expectEquals ((int) sid.registers[0x15], c.lo, "value " + juce::String (c.value) + " lo byte");
            expectEquals ((int) sid.registers[0x16], c.hi, "value " + juce::String (c.value) + " hi byte");
        }
    }

    void testFilterResonance (int channel)
    {
        struct Case
        {
            int value;
            int expectedNibble;
        };

        const Case cases[] = {
            { 0,   0x0 },
            { 64,  0x8 },
            { 127, 0xF },
        };

        beginTest ("for midi cc " + juce::String (ContinuousController::FilterResonance)
                   + " writes expected 4-bit value, channel " + juce::String (channel));

        for (auto& c : cases)
        {
            FakeSidChip sid;
            MidiInterpreter interpreter (sid);

            interpreter.controller (channel, ContinuousController::FilterResonance, c.value);

            const int nibble = (sid.registers[0x17] >> 4) & 0x0F;
            expectEquals (nibble, c.expectedNibble, "value " + juce::String (c.value));
        }
    }

    void testFilterEnable (int channel)
    {
        beginTest ("FilterEnable cc 127 enables the filter for the channel, 0 disables it, channel "
                   + juce::String (channel));

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);

        const int expectedBit = 1 << channel;

        interpreter.controller (channel, ContinuousController::FilterEnable, 127);
        expectEquals (sid.registers[0x17] & expectedBit, expectedBit);

        interpreter.controller (channel, ContinuousController::FilterEnable, 0);
        expectEquals (sid.registers[0x17] & expectedBit, 0x00);
    }

    void testFilterRegisterPreservesOtherBits (int channel)
    {
        beginTest ("filter controls preserve other bits in register $17, channel " + juce::String (channel));

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);

        interpreter.controller (channel, ContinuousController::FilterResonance, 127);
        expectEquals ((int) sid.registers[0x17], 0xF0);

        interpreter.controller (channel, ContinuousController::FilterEnable, 127);
        const int expectedBit = 1 << channel;
        expectEquals ((int) sid.registers[0x17], 0xF0 | expectedBit);

        interpreter.controller (channel, ContinuousController::FilterEnable, 0);
        expectEquals ((int) sid.registers[0x17], 0xF0);
    }

    void testFilterModeBitCombinations (int channel)
    {
        beginTest ("filter mode bit combinations, channel " + juce::String (channel));

        const std::vector<ControlBit> bits = {
            { ContinuousController::FilterLowPass,  0x10, "lp" },
            { ContinuousController::FilterBandPass, 0x20, "bp" },
            { ContinuousController::FilterHighPass, 0x40, "hp" },
        };

        expectControlBitPowerSet (*this, channel, 0x18, bits);
    }

    void testOscillator3Mute (int channel)
    {
        beginTest ("Oscillator3Mute cc 127 sets the mute bit, 0 clears it, channel " + juce::String (channel));

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);

        interpreter.controller (channel, ContinuousController::Oscillator3Mute, 127);
        expectEquals (sid.registers[0x18] & 0x80, 0x80);

        interpreter.controller (channel, ContinuousController::Oscillator3Mute, 0);
        expectEquals (sid.registers[0x18] & 0x80, 0x00);
    }

    void testFilterModeRegisterPreservesOtherBits (int channel)
    {
        beginTest ("oscillator 3 mute and filter mode controls preserve other bits in register $18, channel "
                   + juce::String (channel));

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);

        interpreter.controller (channel, ContinuousController::FilterLowPass, 127);
        expectEquals ((int) sid.registers[0x18], 0x10);

        interpreter.controller (channel, ContinuousController::Oscillator3Mute, 127);
        expectEquals ((int) sid.registers[0x18], 0x10 | 0x80);

        interpreter.controller (channel, ContinuousController::FilterLowPass, 0);
        expectEquals ((int) sid.registers[0x18], 0x80);
    }
};

static FilterInterpretationTests filterInterpretationTests;
