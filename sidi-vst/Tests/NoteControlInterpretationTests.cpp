#include "Support/FakeSidChip.h"
#include "../Source/MidiInterpreter.h"
#include <juce_core/juce_core.h>

// Port of the 'note control interpretation' describe block (GATE bit
// behaviour across overlapping note on/off sequences) in
// sidi-web/tests/interpreter.test.ts.
class NoteControlInterpretationTests : public juce::UnitTest
{
public:
    NoteControlInterpretationTests() : juce::UnitTest ("Note control interpretation", "MidiInterpreter") {}

    void runTest() override
    {
        for (int channel = 0; channel < 3; ++channel)
        {
            testNoteOnTurnsGateOn (channel);
            testNoteOnThenOffTurnsGateOff (channel);
            testOverlappingNotesKeepGateOnUntilLastKeyReleased (channel);
            testReleasingLastPressedKeyTurnsGateOff (channel);
            testNoteOnWhileGateAlreadyOnForcesRetrigger (channel);
            testNoteOnWhileGateAlreadyOffWritesOnce (channel);
        }
    }

private:
    void testNoteOnTurnsGateOn (int channel)
    {
        beginTest ("interpreting a note on turns the GATE bit ON, channel " + juce::String (channel));

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);

        interpreter.process (juce::MidiMessage::noteOn (channel + 1, 60, (juce::uint8) 127));

        const int address = channel * 7 + 4;
        expectEquals (sid.registers[(size_t) address] & 0x01, 0x01);
    }

    void testNoteOnThenOffTurnsGateOff (int channel)
    {
        beginTest ("note on followed by note off on the same pitch turns the GATE bit OFF, channel "
                   + juce::String (channel));

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);

        interpreter.process (juce::MidiMessage::noteOn (channel + 1, 60, (juce::uint8) 127));
        interpreter.process (juce::MidiMessage::noteOff (channel + 1, 60));

        const int address = channel * 7 + 4;
        expectEquals (sid.registers[(size_t) address] & 0x01, 0x00);
    }

    void testOverlappingNotesKeepGateOnUntilLastKeyReleased (int channel)
    {
        beginTest ("note on, then a different note on, then note off on the original key keeps the GATE bit ON, channel "
                   + juce::String (channel));

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);

        interpreter.process (juce::MidiMessage::noteOn (channel + 1, 60, (juce::uint8) 127));  // Press Note A
        interpreter.process (juce::MidiMessage::noteOn (channel + 1, 64, (juce::uint8) 127));  // Press Note B (last pressed)
        interpreter.process (juce::MidiMessage::noteOff (channel + 1, 60)); // Release Note A (not the last pressed note)

        const int address = channel * 7 + 4;
        expectEquals (sid.registers[(size_t) address] & 0x01, 0x01);
    }

    void testReleasingLastPressedKeyTurnsGateOff (int channel)
    {
        beginTest ("note on, then a different note on, then note off on the original key, "
                   "then note off on the last note on key, sets the GATE bit OFF, channel "
                   + juce::String (channel));

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);

        interpreter.process (juce::MidiMessage::noteOn (channel + 1, 60, (juce::uint8) 127));  // Press Note A
        interpreter.process (juce::MidiMessage::noteOn (channel + 1, 64, (juce::uint8) 127));  // Press Note B (last pressed)
        interpreter.process (juce::MidiMessage::noteOff (channel + 1, 60)); // Release Note A (not the last pressed note)

        const int address = channel * 7 + 4;
        expectEquals (sid.registers[(size_t) address] & 0x01, 0x01); // Gate should still be ON

        interpreter.process (juce::MidiMessage::noteOff (channel + 1, 64)); // Release Note B (the last pressed note)

        expectEquals (sid.registers[(size_t) address] & 0x01, 0x00); // Gate should now be OFF
    }

    void testNoteOnWhileGateAlreadyOnForcesRetrigger (int channel)
    {
        beginTest ("note on while the GATE bit is already ON forces a retrigger (OFF then ON), channel "
                   + juce::String (channel));

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);

        const int address = channel * 7 + 4;

        interpreter.process (juce::MidiMessage::noteOn (channel + 1, 60, (juce::uint8) 127)); // GATE 0 -> 1

        sid.writeLog.clear(); // isolate the writes made by the second note on

        // A second hit on the same voice with no note off in between - eg. two drum
        // hits sharing one oscillator, as is standard chiptune practice.
        interpreter.process (juce::MidiMessage::noteOn (channel + 1, 64, (juce::uint8) 127));

        std::vector<uint8_t> gateBits;
        for (auto& write : sid.writeLog)
            if (write.offset == address)
                gateBits.push_back ((uint8_t) (write.value & 0x01));

        expectEquals ((int) gateBits.size(), 2);
        if (gateBits.size() == 2)
        {
            expectEquals ((int) gateBits[0], 0);
            expectEquals ((int) gateBits[1], 1);
        }
    }

    void testNoteOnWhileGateAlreadyOffWritesOnce (int channel)
    {
        beginTest ("note on while the GATE bit is already OFF writes it just once, channel "
                   + juce::String (channel));

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);

        const int address = channel * 7 + 4;

        interpreter.process (juce::MidiMessage::noteOn (channel + 1, 60, (juce::uint8) 127));

        int gateWriteCount = 0;
        for (auto& write : sid.writeLog)
            if (write.offset == address)
                ++gateWriteCount;

        expectEquals (gateWriteCount, 1);
        expectEquals (sid.registers[(size_t) address] & 0x01, 0x01);
    }
};

static NoteControlInterpretationTests noteControlInterpretationTests;
