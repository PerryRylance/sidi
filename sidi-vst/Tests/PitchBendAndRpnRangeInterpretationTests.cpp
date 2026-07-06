#include "Support/ContinuousController.h"
#include "Support/FakeSidChip.h"
#include "Support/SidRegisterInterpreter.h"
#include <juce_core/juce_core.h>
#include <vector>

// Port of the 'pitch bend and RPN range interpretation' describe block in
// sidi-web/tests/interpreter.test.ts.
class PitchBendAndRpnRangeInterpretationTests : public juce::UnitTest
{
public:
    PitchBendAndRpnRangeInterpretationTests()
        : juce::UnitTest ("Pitch bend and RPN range interpretation", "SidRegisterInterpreter")
    {
    }

    void runTest() override
    {
        // [noteName, key, defaultUpLo, defaultUpHi, defaultDownLo, defaultDownHi, rpnUpLo, rpnUpHi, rpnDownLo, rpnDownHi]
        const std::vector<Case> cases = {
            { "C1", 24, 0x71, 0x02, 0xF0, 0x01, 0x5A, 0x04, 0x16, 0x01 },
            { "C2", 36, 0xE2, 0x04, 0xE0, 0x03, 0xB4, 0x08, 0x2D, 0x02 },
            { "C3", 48, 0xC4, 0x09, 0xC1, 0x07, 0x67, 0x11, 0x5A, 0x04 },
            { "C4", 60, 0x89, 0x13, 0x81, 0x0F, 0xCE, 0x22, 0xB4, 0x08 },
            { "C5", 72, 0x11, 0x27, 0x02, 0x1F, 0x9C, 0x45, 0x67, 0x11 },
            { "C6", 84, 0x23, 0x4E, 0x04, 0x3E, 0x39, 0x8B, 0xCF, 0x22 },
        };

        for (int channel = 0; channel < 3; ++channel)
        {
            testDefaultBendRange (channel, cases);
            testRpnConfiguredBendRange (channel, cases);
            testDataEntryWithoutRpnSelection (channel);
            testDataEntryUnderNonZeroRpn (channel);
            testPitchBendDoesNotAffectOtherChannel (channel);
        }
    }

private:
    struct Case
    {
        const char* noteName;
        int key;
        int defaultUpLo, defaultUpHi, defaultDownLo, defaultDownHi;
        int rpnUpLo, rpnUpHi, rpnDownLo, rpnDownHi;
    };

    void testDefaultBendRange (int channel, const std::vector<Case>& cases)
    {
        beginTest ("default +/- 2 semitone bends write correct bytes, channel " + juce::String (channel));

        const int address = channel * 7;

        for (auto& c : cases)
        {
            FakeSidChip sid;
            SidRegisterInterpreter interpreter (sid);

            interpreter.noteOn (channel, c.key);

            interpreter.pitchWheel (channel, 1.0f);
            expectEquals ((int) sid.registers[(size_t) address], c.defaultUpLo,
                          juce::String (c.noteName) + " up lo byte");
            expectEquals ((int) sid.registers[(size_t) address + 1], c.defaultUpHi,
                          juce::String (c.noteName) + " up hi byte");

            interpreter.pitchWheel (channel, -1.0f);
            expectEquals ((int) sid.registers[(size_t) address], c.defaultDownLo,
                          juce::String (c.noteName) + " down lo byte");
            expectEquals ((int) sid.registers[(size_t) address + 1], c.defaultDownHi,
                          juce::String (c.noteName) + " down hi byte");
        }
    }

    void testRpnConfiguredBendRange (int channel, const std::vector<Case>& cases)
    {
        beginTest ("RPN-configured +/- 12 semitone bends write correct bytes, channel " + juce::String (channel));

        const int address = channel * 7;

        for (auto& c : cases)
        {
            FakeSidChip sid;
            SidRegisterInterpreter interpreter (sid);

            // 1. Select RPN 00 00 (Pitch Bend Sensitivity)
            interpreter.controller (channel, ContinuousController::RpnMsb, 0);
            interpreter.controller (channel, ContinuousController::RpnLsb, 0);

            // 2. Set range to 12 semitones using Data Entry MSB (CC 6)
            interpreter.controller (channel, ContinuousController::DataEntryMsb, 12);

            // 3. Play note
            interpreter.noteOn (channel, c.key);

            // 4. Apply full pitch bend up
            interpreter.pitchWheel (channel, 1.0f);
            expectEquals ((int) sid.registers[(size_t) address], c.rpnUpLo,
                          juce::String (c.noteName) + " RPN up lo byte");
            expectEquals ((int) sid.registers[(size_t) address + 1], c.rpnUpHi,
                          juce::String (c.noteName) + " RPN up hi byte");

            // 5. Apply full pitch bend down
            interpreter.pitchWheel (channel, -1.0f);
            expectEquals ((int) sid.registers[(size_t) address], c.rpnDownLo,
                          juce::String (c.noteName) + " RPN down lo byte");
            expectEquals ((int) sid.registers[(size_t) address + 1], c.rpnDownHi,
                          juce::String (c.noteName) + " RPN down hi byte");
        }
    }

    void testDataEntryWithoutRpnSelection (int channel)
    {
        beginTest ("data entry MSB without RPN selection does not alter default bend range, channel "
                   + juce::String (channel));

        FakeSidChip sid;
        SidRegisterInterpreter interpreter (sid);

        // 1. Play C4
        interpreter.noteOn (channel, 60);

        // 2. Send Data Entry MSB (CC 6) with value 12 without selecting RPN
        interpreter.controller (channel, ContinuousController::DataEntryMsb, 12);

        // 3. Apply full up bend
        interpreter.pitchWheel (channel, 1.0f);

        // Should still only bend 2 semitones to D4 (0x1389)
        const int address = channel * 7;
        expectEquals ((int) sid.registers[(size_t) address], 0x89);
        expectEquals ((int) sid.registers[(size_t) address + 1], 0x13);
    }

    void testDataEntryUnderNonZeroRpn (int channel)
    {
        beginTest ("data entry MSB under non-zero RPN does not alter pitch bend range, channel "
                   + juce::String (channel));

        FakeSidChip sid;
        SidRegisterInterpreter interpreter (sid);

        // 1. Play C4
        interpreter.noteOn (channel, 60);

        // 2. Select a different RPN (e.g., RPN 00 01 - Fine Tuning)
        interpreter.controller (channel, ContinuousController::RpnMsb, 0);
        interpreter.controller (channel, ContinuousController::RpnLsb, 1); // Non-zero RPN

        // 3. Send Data Entry MSB (CC 6) with value 12
        interpreter.controller (channel, ContinuousController::DataEntryMsb, 12);

        // 4. Apply full up bend
        interpreter.pitchWheel (channel, 1.0f);

        // Should still only bend 2 semitones to D4 (0x1389)
        const int address = channel * 7;
        expectEquals ((int) sid.registers[(size_t) address], 0x89);
        expectEquals ((int) sid.registers[(size_t) address + 1], 0x13);
    }

    void testPitchBendDoesNotAffectOtherChannel (int channel)
    {
        beginTest ("pitch bend on a channel does not affect another channel, channel " + juce::String (channel));

        FakeSidChip sid;
        SidRegisterInterpreter interpreter (sid);

        const int otherChannel = (channel + 1) % 3;
        const int addressChannel = channel * 7;
        const int addressOther = otherChannel * 7;

        // Play C4 on both channels
        interpreter.noteOn (channel, 60);
        interpreter.noteOn (otherChannel, 60);

        // Apply full pitch bend to our channel
        interpreter.pitchWheel (channel, 1.0f);

        // Our channel should be bent up to D4 (0x1389)
        expectEquals ((int) sid.registers[(size_t) addressChannel], 0x89);
        expectEquals ((int) sid.registers[(size_t) addressChannel + 1], 0x13);

        // Other channel should remain unbent C4 (0x1167)
        expectEquals ((int) sid.registers[(size_t) addressOther], 0x67);
        expectEquals ((int) sid.registers[(size_t) addressOther + 1], 0x11);
    }
};

static PitchBendAndRpnRangeInterpretationTests pitchBendAndRpnRangeInterpretationTests;
