#include "Support/FakeSidChip.h"
#include "../Source/MidiInterpreter.h"
#include "../Source/ContinuousController.h"
#include <juce_core/juce_core.h>

// Covers the "ADSR bug" workaround (see MidiInterpreter.cpp's processNoteOn
// comment): CC93/CC94 arm it, and a note on then raises GATE+TEST together
// instead of just GATE, leaving a pending hold for releaseAdsrHold() to
// resolve later. The block/latency scheduling that decides *when* to call
// releaseAdsrHold() is covered separately by AdsrWorkaroundEngineTests.
class AdsrWorkaroundInterpretationTests : public juce::UnitTest
{
public:
    AdsrWorkaroundInterpretationTests() : juce::UnitTest ("ADSR workaround interpretation", "MidiInterpreter") {}

    void runTest() override
    {
        for (int channel = 0; channel < 3; ++channel)
        {
            testGlobalCcSetsFlagWithoutRegisterWrite (channel);
            testChannelCcSetsFlagWithoutRegisterWrite (channel);
            testChannelCcOnlyAffectsItsOwnChannel (channel);
            testNoteOnRaisesGateAndTestWhenBothFlagsOn (channel);
            testNoteOnLeavesTestAloneWhenOnlyGlobalOn (channel);
            testNoteOnLeavesTestAloneWhenOnlyChannelOn (channel);
            testReleaseAdsrHoldClearsTestKeepsGate (channel);
            testReleaseAdsrHoldIsNoOpWithoutPendingHold (channel);
            testRetriggerWhileHoldPendingReRaisesGateAndTest (channel);
            testNoteOffDuringPendingHoldClearsGateTestAndPending (channel);
        }
    }

private:
    void testGlobalCcSetsFlagWithoutRegisterWrite (int channel)
    {
        beginTest ("AdsrWorkaroundGlobal CC sets the global flag without writing any register, channel "
                   + juce::String (channel));

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);

        expect (! interpreter.isAdsrWorkaroundGlobalEnabled());

        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::AdsrWorkaroundGlobal, 127));
        expect (interpreter.isAdsrWorkaroundGlobalEnabled());
        expect (sid.writeLog.empty());

        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::AdsrWorkaroundGlobal, 0));
        expect (! interpreter.isAdsrWorkaroundGlobalEnabled());
        expect (sid.writeLog.empty());
    }

    void testChannelCcSetsFlagWithoutRegisterWrite (int channel)
    {
        beginTest ("AdsrWorkaroundChannel CC sets the per-channel flag without writing any register, channel "
                   + juce::String (channel));

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);

        expect (! interpreter.isAdsrWorkaroundEnabledForChannel (channel));

        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::AdsrWorkaroundChannel, 127));
        expect (interpreter.isAdsrWorkaroundEnabledForChannel (channel));
        expect (sid.writeLog.empty());

        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::AdsrWorkaroundChannel, 0));
        expect (! interpreter.isAdsrWorkaroundEnabledForChannel (channel));
        expect (sid.writeLog.empty());
    }

    void testChannelCcOnlyAffectsItsOwnChannel (int channel)
    {
        beginTest ("AdsrWorkaroundChannel CC leaves the other channels' flags untouched, channel "
                   + juce::String (channel));

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);

        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::AdsrWorkaroundChannel, 127));

        for (int other = 0; other < 3; ++other)
            expect (interpreter.isAdsrWorkaroundEnabledForChannel (other) == (other == channel));
    }

    void testNoteOnRaisesGateAndTestWhenBothFlagsOn (int channel)
    {
        beginTest ("note on raises GATE and TEST together when global and channel workaround are both on, channel "
                   + juce::String (channel));

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);

        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::AdsrWorkaroundGlobal, 127));
        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::AdsrWorkaroundChannel, 127));

        expect (! interpreter.hasPendingAdsrRelease (channel));

        interpreter.process (juce::MidiMessage::noteOn (channel + 1, 60, (juce::uint8) 127));

        const int address = channel * 7 + 4;
        expectEquals (sid.registers[(size_t) address] & 0x09, 0x09); // GATE and TEST both set
        expect (interpreter.hasPendingAdsrRelease (channel));
    }

    void testNoteOnLeavesTestAloneWhenOnlyGlobalOn (int channel)
    {
        beginTest ("note on does not raise TEST when only the global flag is on, channel "
                   + juce::String (channel));

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);

        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::AdsrWorkaroundGlobal, 127));
        interpreter.process (juce::MidiMessage::noteOn (channel + 1, 60, (juce::uint8) 127));

        const int address = channel * 7 + 4;
        expectEquals (sid.registers[(size_t) address] & 0x01, 0x01);
        expectEquals (sid.registers[(size_t) address] & 0x08, 0x00);
        expect (! interpreter.hasPendingAdsrRelease (channel));
    }

    void testNoteOnLeavesTestAloneWhenOnlyChannelOn (int channel)
    {
        beginTest ("note on does not raise TEST when only the per-channel flag is on (global still off), channel "
                   + juce::String (channel));

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);

        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::AdsrWorkaroundChannel, 127));
        interpreter.process (juce::MidiMessage::noteOn (channel + 1, 60, (juce::uint8) 127));

        const int address = channel * 7 + 4;
        expectEquals (sid.registers[(size_t) address] & 0x01, 0x01);
        expectEquals (sid.registers[(size_t) address] & 0x08, 0x00);
        expect (! interpreter.hasPendingAdsrRelease (channel));
    }

    void testReleaseAdsrHoldClearsTestKeepsGate (int channel)
    {
        beginTest ("releaseAdsrHold clears TEST but keeps GATE high, channel " + juce::String (channel));

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);

        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::AdsrWorkaroundGlobal, 127));
        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::AdsrWorkaroundChannel, 127));
        interpreter.process (juce::MidiMessage::noteOn (channel + 1, 60, (juce::uint8) 127));

        interpreter.releaseAdsrHold (channel);

        const int address = channel * 7 + 4;
        expectEquals (sid.registers[(size_t) address] & 0x01, 0x01); // GATE still on
        expectEquals (sid.registers[(size_t) address] & 0x08, 0x00); // TEST cleared
        expect (! interpreter.hasPendingAdsrRelease (channel));
    }

    void testReleaseAdsrHoldIsNoOpWithoutPendingHold (int channel)
    {
        beginTest ("releaseAdsrHold is a no-op when there's no pending hold, channel " + juce::String (channel));

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);

        interpreter.process (juce::MidiMessage::noteOn (channel + 1, 60, (juce::uint8) 127));
        sid.writeLog.clear();

        interpreter.releaseAdsrHold (channel);

        expect (sid.writeLog.empty());
    }

    void testRetriggerWhileHoldPendingReRaisesGateAndTest (int channel)
    {
        beginTest ("a second note on while a hold is still pending re-raises GATE and TEST, channel "
                   + juce::String (channel));

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);

        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::AdsrWorkaroundGlobal, 127));
        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::AdsrWorkaroundChannel, 127));
        interpreter.process (juce::MidiMessage::noteOn (channel + 1, 60, (juce::uint8) 127));

        sid.writeLog.clear();

        // Second drum hit on the same voice before the first hold resolved.
        interpreter.process (juce::MidiMessage::noteOn (channel + 1, 64, (juce::uint8) 127));

        const int address = channel * 7 + 4;
        std::vector<uint8_t> gateAndTestBits;
        for (auto& write : sid.writeLog)
            if (write.offset == address)
                gateAndTestBits.push_back ((uint8_t) (write.value & 0x09));

        expectEquals ((int) gateAndTestBits.size(), 2);
        if (gateAndTestBits.size() == 2)
        {
            // TEST was already high from the still-pending first hold, and stays
            // high throughout - only GATE needs a real edge to retrigger the
            // envelope; TEST dropping too would undo the reset already in progress.
            expectEquals ((int) gateAndTestBits[0], 0x08); // GATE forced low, TEST still held
            expectEquals ((int) gateAndTestBits[1], 0x09); // GATE back up, TEST still held
        }

        expect (interpreter.hasPendingAdsrRelease (channel));
    }

    void testNoteOffDuringPendingHoldClearsGateTestAndPending (int channel)
    {
        beginTest ("note off while a hold is still pending clears GATE, TEST, and the pending flag, channel "
                   + juce::String (channel));

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);

        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::AdsrWorkaroundGlobal, 127));
        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::AdsrWorkaroundChannel, 127));
        interpreter.process (juce::MidiMessage::noteOn (channel + 1, 60, (juce::uint8) 127));

        interpreter.process (juce::MidiMessage::noteOff (channel + 1, 60));

        const int address = channel * 7 + 4;
        expectEquals (sid.registers[(size_t) address] & 0x09, 0x00);
        expect (! interpreter.hasPendingAdsrRelease (channel));

        // releaseAdsrHold arriving late (already scheduled before the note off
        // beat it) must not resurrect the hold or write anything further.
        sid.writeLog.clear();
        interpreter.releaseAdsrHold (channel);
        expect (sid.writeLog.empty());
    }
};

static AdsrWorkaroundInterpretationTests adsrWorkaroundInterpretationTests;
