#include "Support/FakeSidChip.h"
#include "../Source/MidiInterpreter.h"
#include "../Source/ContinuousController.h"
#include <juce_core/juce_core.h>

// Covers the "ADSR bug" workaround (see MidiInterpreter.cpp's processNoteOn
// comment): CC93/CC94 arm it, and a note on then zeroes the control register
// before raising GATE alone (no TEST - see https://csdb.dk/forums/?roomid=14&topicid=159900)
// and primes ATTACK_DECAY/SUSTAIN_RELEASE to attack=0/sustain=max, leaving a
// pending hold for releaseAdsrHold() to resolve later. The block/latency
// scheduling that decides *when* to call releaseAdsrHold() is covered
// separately by AdsrWorkaroundEngineTests.
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
            testNoteOnZeroesControlRegisterBeforeRaisingGateWhenWorkaroundActive (channel);
            testNoteOnDoesNotEngageWorkaroundWhenOnlyGlobalOn (channel);
            testNoteOnDoesNotEngageWorkaroundWhenOnlyChannelOn (channel);
            testReleaseAdsrHoldDoesNotTouchControlRegister (channel);
            testReleaseAdsrHoldIsNoOpWithoutPendingHold (channel);
            testRetriggerWhileHoldPendingReZeroesAndRaisesGate (channel);
            testNoteOffDuringPendingHoldClearsGateAndPending (channel);
            testNoteOnPrimesAdsrRegistersWhenWorkaroundActive (channel);
            testNoteOnDoesNotPrimeAdsrWhenWorkaroundInactive (channel);
            testReleaseAdsrHoldRestoresRealAdsrValues (channel);
            testNoteOffDuringPendingHoldRestoresRealAdsrValues (channel);
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

    void testNoteOnZeroesControlRegisterBeforeRaisingGateWhenWorkaroundActive (int channel)
    {
        beginTest ("note on zeroes the control register then raises GATE alone (no TEST) when global and channel workaround are both on, channel "
                   + juce::String (channel));

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);

        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::AdsrWorkaroundGlobal, 127));
        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::AdsrWorkaroundChannel, 127));

        expect (! interpreter.hasPendingAdsrRelease (channel));

        interpreter.process (juce::MidiMessage::noteOn (channel + 1, 60, (juce::uint8) 127));

        const int address = channel * 7 + 4;
        std::vector<uint8_t> controlRegisterWrites;
        for (auto& write : sid.writeLog)
            if (write.offset == address)
                controlRegisterWrites.push_back (write.value);

        expectEquals ((int) controlRegisterWrites.size(), 2);
        if (controlRegisterWrites.size() == 2)
        {
            expectEquals ((int) controlRegisterWrites[0], 0x00); // control register zeroed first
            expectEquals ((int) controlRegisterWrites[1], 0x01); // GATE alone raised, no TEST
        }

        expect (interpreter.hasPendingAdsrRelease (channel));
    }

    void testNoteOnDoesNotEngageWorkaroundWhenOnlyGlobalOn (int channel)
    {
        beginTest ("note on does not zero the control register or prime ADSR when only the global flag is on, channel "
                   + juce::String (channel));

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);

        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::AdsrWorkaroundGlobal, 127));
        interpreter.process (juce::MidiMessage::noteOn (channel + 1, 60, (juce::uint8) 127));

        const int address = channel * 7 + 4;
        std::vector<uint8_t> controlRegisterWrites;
        for (auto& write : sid.writeLog)
            if (write.offset == address)
                controlRegisterWrites.push_back (write.value);

        expectEquals ((int) controlRegisterWrites.size(), 1);
        if (! controlRegisterWrites.empty())
            expectEquals ((int) controlRegisterWrites.back(), 0x01); // plain GATE, no priming write

        expect (! interpreter.hasPendingAdsrRelease (channel));
    }

    void testNoteOnDoesNotEngageWorkaroundWhenOnlyChannelOn (int channel)
    {
        beginTest ("note on does not zero the control register or prime ADSR when only the per-channel flag is on (global still off), channel "
                   + juce::String (channel));

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);

        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::AdsrWorkaroundChannel, 127));
        interpreter.process (juce::MidiMessage::noteOn (channel + 1, 60, (juce::uint8) 127));

        const int address = channel * 7 + 4;
        std::vector<uint8_t> controlRegisterWrites;
        for (auto& write : sid.writeLog)
            if (write.offset == address)
                controlRegisterWrites.push_back (write.value);

        expectEquals ((int) controlRegisterWrites.size(), 1);
        if (! controlRegisterWrites.empty())
            expectEquals ((int) controlRegisterWrites.back(), 0x01); // plain GATE, no priming write

        expect (! interpreter.hasPendingAdsrRelease (channel));
    }

    void testReleaseAdsrHoldDoesNotTouchControlRegister (int channel)
    {
        beginTest ("releaseAdsrHold leaves the control register untouched - there's no TEST bit to release, channel "
                   + juce::String (channel));

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);

        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::AdsrWorkaroundGlobal, 127));
        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::AdsrWorkaroundChannel, 127));
        interpreter.process (juce::MidiMessage::noteOn (channel + 1, 60, (juce::uint8) 127));

        const int address = channel * 7 + 4;
        const uint8_t controlRegisterAfterNoteOn = sid.registers[(size_t) address];
        sid.writeLog.clear();

        interpreter.releaseAdsrHold (channel);

        for (auto& write : sid.writeLog)
            expect (write.offset != address);

        expectEquals ((int) sid.registers[(size_t) address], (int) controlRegisterAfterNoteOn); // GATE still on, untouched
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

    void testRetriggerWhileHoldPendingReZeroesAndRaisesGate (int channel)
    {
        beginTest ("a second note on while a hold is still pending zeroes the control register and re-raises GATE, channel "
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
        std::vector<uint8_t> controlRegisterWrites;
        for (auto& write : sid.writeLog)
            if (write.offset == address)
                controlRegisterWrites.push_back (write.value);

        expectEquals ((int) controlRegisterWrites.size(), 2);
        if (controlRegisterWrites.size() == 2)
        {
            expectEquals ((int) controlRegisterWrites[0], 0x00); // zeroed again for a guaranteed edge
            expectEquals ((int) controlRegisterWrites[1], 0x01); // GATE back up, still no TEST
        }

        expect (interpreter.hasPendingAdsrRelease (channel));
    }

    void testNoteOffDuringPendingHoldClearsGateAndPending (int channel)
    {
        beginTest ("note off while a hold is still pending clears GATE and the pending flag, channel "
                   + juce::String (channel));

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);

        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::AdsrWorkaroundGlobal, 127));
        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::AdsrWorkaroundChannel, 127));
        interpreter.process (juce::MidiMessage::noteOn (channel + 1, 60, (juce::uint8) 127));

        interpreter.process (juce::MidiMessage::noteOff (channel + 1, 60));

        const int address = channel * 7 + 4;
        expectEquals (sid.registers[(size_t) address] & 0x01, 0x00);
        expect (! interpreter.hasPendingAdsrRelease (channel));

        // releaseAdsrHold arriving late (already scheduled before the note off
        // beat it) must not resurrect the hold or write anything further.
        sid.writeLog.clear();
        interpreter.releaseAdsrHold (channel);
        expect (sid.writeLog.empty());
    }

    // NB: Sets attack/decay/sustain/release CCs to 127 - each maps to nibble 0xF
    // (see AdsrEnvelopeInterpretationTests.cpp), giving a real attackDecay/
    // sustainRelease of 0xFF/0xFF, unambiguously distinct from the priming
    // values (0x00/0xF0) these tests check against.
    void setMaxAdsrValues (MidiInterpreter& interpreter, int channel)
    {
        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::Attack, 127));
        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::Decay, 127));
        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::Sustain, 127));
        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::Release, 127));
    }

    void testNoteOnPrimesAdsrRegistersWhenWorkaroundActive (int channel)
    {
        beginTest ("note on primes ATTACK_DECAY/SUSTAIN_RELEASE to attack=0/sustain=max when the workaround is active, channel "
                   + juce::String (channel));

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);

        setMaxAdsrValues (interpreter, channel);
        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::AdsrWorkaroundGlobal, 127));
        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::AdsrWorkaroundChannel, 127));

        interpreter.process (juce::MidiMessage::noteOn (channel + 1, 60, (juce::uint8) 127));

        const int adsrOffset = channel * 7 + 5;
        expectEquals ((int) sid.registers[(size_t) adsrOffset], 0x00);
        expectEquals ((int) sid.registers[(size_t) adsrOffset + 1], 0xF0);
    }

    void testNoteOnDoesNotPrimeAdsrWhenWorkaroundInactive (int channel)
    {
        beginTest ("note on leaves the real ATTACK_DECAY/SUSTAIN_RELEASE values untouched when the workaround is inactive, channel "
                   + juce::String (channel));

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);

        setMaxAdsrValues (interpreter, channel);
        interpreter.process (juce::MidiMessage::noteOn (channel + 1, 60, (juce::uint8) 127));

        const int adsrOffset = channel * 7 + 5;
        expectEquals ((int) sid.registers[(size_t) adsrOffset], 0xFF);
        expectEquals ((int) sid.registers[(size_t) adsrOffset + 1], 0xFF);
    }

    void testReleaseAdsrHoldRestoresRealAdsrValues (int channel)
    {
        beginTest ("releaseAdsrHold restores the patch's real ADSR values, channel " + juce::String (channel));

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);

        setMaxAdsrValues (interpreter, channel);
        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::AdsrWorkaroundGlobal, 127));
        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::AdsrWorkaroundChannel, 127));
        interpreter.process (juce::MidiMessage::noteOn (channel + 1, 60, (juce::uint8) 127));

        interpreter.releaseAdsrHold (channel);

        const int adsrOffset = channel * 7 + 5;
        expectEquals ((int) sid.registers[(size_t) adsrOffset], 0xFF);
        expectEquals ((int) sid.registers[(size_t) adsrOffset + 1], 0xFF);
    }

    void testNoteOffDuringPendingHoldRestoresRealAdsrValues (int channel)
    {
        beginTest ("note off while a hold is still pending restores the patch's real ADSR values, channel "
                   + juce::String (channel));

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);

        setMaxAdsrValues (interpreter, channel);
        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::AdsrWorkaroundGlobal, 127));
        interpreter.process (juce::MidiMessage::controllerEvent (channel + 1, ContinuousController::AdsrWorkaroundChannel, 127));
        interpreter.process (juce::MidiMessage::noteOn (channel + 1, 60, (juce::uint8) 127));

        interpreter.process (juce::MidiMessage::noteOff (channel + 1, 60));

        const int adsrOffset = channel * 7 + 5;
        expectEquals ((int) sid.registers[(size_t) adsrOffset], 0xFF);
        expectEquals ((int) sid.registers[(size_t) adsrOffset + 1], 0xFF);
    }
};

static AdsrWorkaroundInterpretationTests adsrWorkaroundInterpretationTests;
