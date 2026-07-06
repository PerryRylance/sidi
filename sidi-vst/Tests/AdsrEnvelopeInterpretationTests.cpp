#include "Support/ContinuousController.h"
#include "Support/FakeSidChip.h"
#include "Support/SidRegisterInterpreter.h"
#include <juce_core/juce_core.h>

// Port of the 'adsr envelope interpretation' describe block in
// sidi-web/tests/interpreter.test.ts.
class AdsrEnvelopeInterpretationTests : public juce::UnitTest
{
public:
    AdsrEnvelopeInterpretationTests() : juce::UnitTest ("ADSR envelope interpretation", "SidRegisterInterpreter") {}

    void runTest() override
    {
        struct Parameter
        {
            int controller;
            const char* name;
            int offset;
            int shift;
        };

        const Parameter parameters[] = {
            { ContinuousController::Attack,  "attack",  5, 4 },
            { ContinuousController::Decay,   "decay",   5, 0 },
            { ContinuousController::Sustain, "sustain", 6, 4 },
            { ContinuousController::Release, "release", 6, 0 },
        };

        struct Case
        {
            int ccValue;
            int expectedNibble;
        };

        const Case cases[] = {
            { 0,   0x0 },
            { 64,  0x8 },
            { 127, 0xF },
        };

        for (int channel = 0; channel < 3; ++channel)
        {
            for (auto& parameter : parameters)
            {
                beginTest (juce::String (parameter.name) + " (cc " + juce::String (parameter.controller)
                           + ") writes expected 4-bit value, channel " + juce::String (channel));

                for (auto& c : cases)
                {
                    FakeSidChip sid;
                    SidRegisterInterpreter interpreter (sid);

                    interpreter.controller (channel, parameter.controller, c.ccValue);

                    const int address = channel * 7 + parameter.offset;
                    const int regValue = sid.registers[(size_t) address];
                    const int nibble = (regValue >> parameter.shift) & 0x0F;

                    expectEquals (nibble, c.expectedNibble, "cc value " + juce::String (c.ccValue));
                }
            }
        }
    }
};

static AdsrEnvelopeInterpretationTests adsrEnvelopeInterpretationTests;
