#include "../Source/ContinuousController.h"
#include "Support/FakeSidChip.h"
#include "../Source/MidiInterpreter.h"
#include "../Source/SidChipAdapter.h"
#include <juce_core/juce_core.h>

// Port of the 'volume interpretation' describe block in
// sidi-web/tests/interpreter.test.ts.
class VolumeInterpretationTests : public juce::UnitTest
{
public:
    VolumeInterpretationTests() : juce::UnitTest ("Volume interpretation", "MidiInterpreter") {}

    void runTest() override
    {
        for (int channel = 0; channel < 3; ++channel)
        {
            testVolumeNibble (channel);
            testVolumePreservesOtherBits (channel);
            testPowerOnDefaultSeeding (channel);
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
            MidiInterpreter interpreter (sid);

            interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::MainVolume, c.value));

            const int volumeBits = sid.registers[0x18] & 0x0F;
            expectEquals (volumeBits, c.expectedVolume, "value " + juce::String (c.value));
        }
    }

    void testVolumePreservesOtherBits (int channel)
    {
        beginTest ("volume controls preserve other bits in register $18, channel " + juce::String (channel));

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);

        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::FilterLowPass, 127));
        expectEquals ((int) sid.registers[0x18], 0x10);

        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::MainVolume, 127));
        expectEquals ((int) sid.registers[0x18], 0x10 | 0x0F);

        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::FilterLowPass, 0));
        expectEquals ((int) sid.registers[0x18], 0x0F);
    }

    // NB: Regression coverage for a bug where MidiInterpreter's local $18 shadow
    // (filterModeVolumeSelect) started at 0 instead of SidChipAdapter's real power-on value
    // (DEFAULT_FILTER_MODE_VOLUME, 0x0F - full volume, no filter mode bits). $18 packs the filter
    // mode select bits and the main volume nibble together, so the very first FilterLowPass/
    // BandPass/HighPass/Oscillator3Mute CC - before any MainVolume CC ever arrived - did a
    // read-modify-write against the stale all-zero shadow and silently zeroed the volume nibble,
    // muting the chip outright regardless of any per-voice FilterEnable routing. See
    // MidiInterpreter's constructor and PluginProcessor::prepareToPlay's construction call.
    void testPowerOnDefaultSeeding (int channel)
    {
        beginTest ("without seeding, a filter mode CC arriving before any MainVolume CC zeroes the volume nibble, channel "
                   + juce::String (channel));

        {
            FakeSidChip sid;
            MidiInterpreter interpreter (sid);

            interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::FilterLowPass, 127));
            expectEquals ((int) sid.registers[0x18], 0x10);
        }

        beginTest ("seeding the constructor with SidChipAdapter::DEFAULT_FILTER_MODE_VOLUME preserves that volume when a filter mode CC arrives first, channel "
                   + juce::String (channel));

        {
            FakeSidChip sid;
            MidiInterpreter interpreter (sid, 0, 0, SidChipAdapter::DEFAULT_FILTER_MODE_VOLUME);

            interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::FilterLowPass, 127));
            expectEquals ((int) sid.registers[0x18], 0x10 | SidChipAdapter::DEFAULT_FILTER_MODE_VOLUME);
        }
    }
};

static VolumeInterpretationTests volumeInterpretationTests;
