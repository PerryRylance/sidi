#include "Support/FakeSidChip.h"
#include "../Source/AdsrWorkaroundEngine.h"
#include "../Source/MidiInterpreter.h"
#include "../Source/ContinuousController.h"
#include <juce_audio_basics/juce_audio_basics.h>
#include <vector>

// Covers the sample-accurate event-scheduling plumbing in AdsrWorkaroundEngine:
// the one-off transition block (silence lead-in + catch-up clock + tail MIDI
// queue), steady-state per-block clocking, and ADSR-hold-release scheduling
// across block boundaries. See AdsrWorkaroundInterpretationTests.cpp for the
// register-write-sequence contract this schedules against.
//
// This engine deliberately reports no latency to the host: the silence
// lead-in below is a one-off startup transient, not an ongoing per-sample
// delay (every event after it lands at the exact output position it arrived
// at - see testMessageAfterLeadInAppliesAtCorrectChipTimeOffset and
// testReleaseScheduledWithinSameSteadyStateBlock), so there's nothing for a
// host's plugin-delay-compensation to legitimately correct for.
//
// Sample rate is fixed at 44100 throughout so the constants below (silence
// lead-in = round(0.033 * 44100) = 1455, hold = round(0.030 * 44100) = 1323)
// are exact.
class AdsrWorkaroundEngineTests : public juce::UnitTest
{
public:
    AdsrWorkaroundEngineTests() : juce::UnitTest ("ADSR workaround engine", "AdsrWorkaroundEngine") {}

    static constexpr double sampleRate = 44100.0;
    static constexpr int silenceLeadInSamples = 1455;
    static constexpr int holdSamples = 1323;

    void runTest() override
    {
        testPassthroughWhenGlobalFlagIsOff();
        testFirstBlockAfterEnableWritesSilenceLeadIn();
        testMessageInSilenceLeadInIsDeferredToNextBlock();
        testMessageAfterLeadInAppliesAtCorrectChipTimeOffset();
        testSteadyStateBlockClocksWholeBlockWhenNoEvents();
        testReleaseScheduledWithinSameSteadyStateBlock();
        testReleaseScheduledAcrossBlockBoundary();
        testDisengageFallsBackToPassthroughWithoutCrashing();
    }

private:
    std::vector<int16_t> sidOutputBuffer = std::vector<int16_t> (8192);

    void testPassthroughWhenGlobalFlagIsOff()
    {
        beginTest ("with the global flag off, a block clocks the whole buffer in one go with no added delay");

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);
        AdsrWorkaroundEngine engine;
        engine.prepare (sampleRate);

        juce::AudioBuffer<float> buffer (2, 512);
        juce::MidiBuffer midi;

        engine.processBlock (buffer, midi, sid, interpreter, sidOutputBuffer);

        expectEquals ((int) sid.clockLog.size(), 1);
        expectEquals (sid.clockLog[0], 512);
        expectWithinAbsoluteError (buffer.getSample (0, 0), 0.0f, 1.0e-6f);
        expectWithinAbsoluteError (buffer.getSample (0, 1), 1.0f / 32768.0f, 1.0e-6f);
    }

    void testFirstBlockAfterEnableWritesSilenceLeadIn()
    {
        beginTest ("the first block after enabling the global flag writes a silence lead-in, then clocks the remainder");

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);
        interpreter.process (juce::MidiMessage::controllerEvent (1, ContinuousController::AdsrWorkaroundGlobal, 127));

        AdsrWorkaroundEngine engine;
        engine.prepare (sampleRate);

        juce::AudioBuffer<float> buffer (2, 4096);
        juce::MidiBuffer midi;

        engine.processBlock (buffer, midi, sid, interpreter, sidOutputBuffer);

        expectEquals ((int) sid.clockLog.size(), 1);
        expectEquals (sid.clockLog[0], 4096 - silenceLeadInSamples);

        for (int i = 0; i < silenceLeadInSamples; ++i)
            expectWithinAbsoluteError (buffer.getSample (0, i), 0.0f, 1.0e-6f);

        expectWithinAbsoluteError (buffer.getSample (0, silenceLeadInSamples), 0.0f, 1.0e-6f); // first fake chip sample is value 0
        expectWithinAbsoluteError (buffer.getSample (0, silenceLeadInSamples + 1), 1.0f / 32768.0f, 1.0e-6f);
    }

    void testMessageInSilenceLeadInIsDeferredToNextBlock()
    {
        beginTest ("a MIDI message landing inside the silence lead-in is deferred and replayed first in the next block");

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);
        interpreter.process (juce::MidiMessage::controllerEvent (1, ContinuousController::AdsrWorkaroundGlobal, 127));

        AdsrWorkaroundEngine engine;
        engine.prepare (sampleRate);

        juce::AudioBuffer<float> buffer (2, 4096);
        juce::MidiBuffer midi;
        midi.addEvent (juce::MidiMessage::noteOn (1, 60, (juce::uint8) 127), 100); // 100 < silenceLeadInSamples

        engine.processBlock (buffer, midi, sid, interpreter, sidOutputBuffer);

        expect (sid.writeLog.empty()); // not applied yet - chip hasn't reached that moment

        juce::AudioBuffer<float> buffer2 (2, 512);
        juce::MidiBuffer midi2; // this block's own MIDI is empty

        engine.processBlock (buffer2, midi2, sid, interpreter, sidOutputBuffer);

        expect (! sid.writeLog.empty());
        const int address = 0 * 7 + 4;
        bool foundGateOn = false;
        for (auto& write : sid.writeLog)
            if (write.offset == address && (write.value & 0x01) == 0x01)
                foundGateOn = true;
        expect (foundGateOn);
    }

    void testMessageAfterLeadInAppliesAtCorrectChipTimeOffset()
    {
        beginTest ("a MIDI message landing after the lead-in is applied at chip-time (position - silenceLeadInSamples)");

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);
        interpreter.process (juce::MidiMessage::controllerEvent (1, ContinuousController::AdsrWorkaroundGlobal, 127));

        AdsrWorkaroundEngine engine;
        engine.prepare (sampleRate);

        juce::AudioBuffer<float> buffer (2, 4096);
        juce::MidiBuffer midi;
        const int pos = 2000; // >= silenceLeadInSamples
        midi.addEvent (juce::MidiMessage::controllerEvent (1, ContinuousController::FilterCutoff, 100), pos);

        engine.processBlock (buffer, midi, sid, interpreter, sidOutputBuffer);

        const int expectedFirstSegment = pos - silenceLeadInSamples;
        const int expectedSecondSegment = (4096 - silenceLeadInSamples) - expectedFirstSegment;

        expectEquals ((int) sid.clockLog.size(), 2);
        expectEquals (sid.clockLog[0], expectedFirstSegment);
        expectEquals (sid.clockLog[1], expectedSecondSegment);
        expect (! sid.writeLog.empty());
    }

    void testSteadyStateBlockClocksWholeBlockWhenNoEvents()
    {
        beginTest ("a steady-state block with no MIDI events clocks the whole block in one segment");

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);
        interpreter.process (juce::MidiMessage::controllerEvent (1, ContinuousController::AdsrWorkaroundGlobal, 127));

        AdsrWorkaroundEngine engine;
        engine.prepare (sampleRate);

        juce::AudioBuffer<float> transitionBuffer (2, 4096);
        juce::MidiBuffer emptyMidi;
        engine.processBlock (transitionBuffer, emptyMidi, sid, interpreter, sidOutputBuffer); // engage
        sid.clockLog.clear();

        juce::AudioBuffer<float> buffer (2, 512);
        engine.processBlock (buffer, emptyMidi, sid, interpreter, sidOutputBuffer);

        expectEquals ((int) sid.clockLog.size(), 1);
        expectEquals (sid.clockLog[0], 512);
    }

    void testReleaseScheduledWithinSameSteadyStateBlock()
    {
        beginTest ("a note on that arms a hold schedules its release within the same steady-state block when it fits");

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);
        interpreter.process (juce::MidiMessage::controllerEvent (1, ContinuousController::AdsrWorkaroundGlobal, 127));
        interpreter.process (juce::MidiMessage::controllerEvent (1, ContinuousController::AdsrWorkaroundChannel, 127));

        AdsrWorkaroundEngine engine;
        engine.prepare (sampleRate);

        juce::AudioBuffer<float> transitionBuffer (2, 4096);
        juce::MidiBuffer emptyMidi;
        engine.processBlock (transitionBuffer, emptyMidi, sid, interpreter, sidOutputBuffer); // engage
        sid.writeLog.clear();
        sid.clockLog.clear();

        juce::AudioBuffer<float> buffer (2, 4096);
        juce::MidiBuffer midi;
        const int notePos = 500;
        midi.addEvent (juce::MidiMessage::noteOn (1, 60, (juce::uint8) 127), notePos);

        engine.processBlock (buffer, midi, sid, interpreter, sidOutputBuffer);

        expectEquals ((int) sid.clockLog.size(), 3);
        expectEquals (sid.clockLog[0], notePos);
        expectEquals (sid.clockLog[1], holdSamples);
        expectEquals (sid.clockLog[2], 4096 - notePos - holdSamples);

        const int address = 4;
        std::vector<int> controlRegisterWrites;
        for (auto& write : sid.writeLog)
            if (write.offset == address)
                controlRegisterWrites.push_back (write.value & 0x01);

        // NB: Only the note on touches the control register (see
        // MidiInterpreter::releaseAdsrHold - there's no TEST bit to release,
        // so it never writes offset 4) - one write to zero it, one to raise
        // GATE alone.
        expectEquals ((int) controlRegisterWrites.size(), 2);
        if (controlRegisterWrites.size() == 2)
        {
            expectEquals (controlRegisterWrites[0], 0x00); // control register zeroed
            expectEquals (controlRegisterWrites[1], 0x01); // GATE alone raised
        }

        expect (! interpreter.hasPendingAdsrRelease (0));
    }

    void testReleaseScheduledAcrossBlockBoundary()
    {
        beginTest ("a hold whose release falls past the current block's end fires at the correct offset in a later block");

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);
        interpreter.process (juce::MidiMessage::controllerEvent (1, ContinuousController::AdsrWorkaroundGlobal, 127));
        interpreter.process (juce::MidiMessage::controllerEvent (1, ContinuousController::AdsrWorkaroundChannel, 127));

        AdsrWorkaroundEngine engine;
        engine.prepare (sampleRate);

        juce::AudioBuffer<float> transitionBuffer (2, 4096);
        juce::MidiBuffer emptyMidi;
        engine.processBlock (transitionBuffer, emptyMidi, sid, interpreter, sidOutputBuffer); // engage
        sid.writeLog.clear();
        sid.clockLog.clear();

        const int blockSize = 1000;
        const int notePos = 500;

        juce::AudioBuffer<float> buffer2 (2, blockSize);
        juce::MidiBuffer midi2;
        midi2.addEvent (juce::MidiMessage::noteOn (1, 60, (juce::uint8) 127), notePos);
        engine.processBlock (buffer2, midi2, sid, interpreter, sidOutputBuffer);

        // releaseAt = notePos + holdSamples = 1823, which is beyond this 1000-sample block.
        expect (interpreter.hasPendingAdsrRelease (0));
        expectEquals ((int) sid.clockLog.size(), 2);
        expectEquals (sid.clockLog[0], notePos);
        expectEquals (sid.clockLog[1], blockSize - notePos);

        juce::AudioBuffer<float> buffer3 (2, blockSize);
        juce::MidiBuffer midi3; // empty - the release is a synthetic event, not a real MIDI message
        engine.processBlock (buffer3, midi3, sid, interpreter, sidOutputBuffer);

        expect (! interpreter.hasPendingAdsrRelease (0));

        // Release lands at chip-time 1823, ie. offset 823 into this second block.
        const int expectedOffset = 1823 - blockSize;
        expectEquals ((int) sid.clockLog.size(), 4);
        expectEquals (sid.clockLog[2], expectedOffset);
        expectEquals (sid.clockLog[3], blockSize - expectedOffset);

        // releaseAdsrHold restores the real ATTACK_DECAY/SUSTAIN_RELEASE values
        // and never touches the control register (see MidiInterpreter -
        // there's no TEST bit to release), so the last two writes land on
        // offsets 5 and 6, not 4.
        expect (sid.writeLog.size() >= 2);
        if (sid.writeLog.size() >= 2)
        {
            expectEquals (sid.writeLog[sid.writeLog.size() - 2].offset, 5);
            expectEquals (sid.writeLog[sid.writeLog.size() - 1].offset, 6);
        }
    }

    void testDisengageFallsBackToPassthroughWithoutCrashing()
    {
        beginTest ("turning the global flag back off falls back to plain passthrough clocking on the next block, without crashing");

        FakeSidChip sid;
        MidiInterpreter interpreter (sid);
        interpreter.process (juce::MidiMessage::controllerEvent (1, ContinuousController::AdsrWorkaroundGlobal, 127));

        AdsrWorkaroundEngine engine;
        engine.prepare (sampleRate);

        juce::AudioBuffer<float> buffer (2, 4096);
        juce::MidiBuffer emptyMidi;
        engine.processBlock (buffer, emptyMidi, sid, interpreter, sidOutputBuffer); // engage
        expectEquals ((int) sid.clockLog.size(), 1);
        expectEquals (sid.clockLog[0], 4096 - silenceLeadInSamples);

        interpreter.process (juce::MidiMessage::controllerEvent (1, ContinuousController::AdsrWorkaroundGlobal, 0));
        sid.clockLog.clear();

        juce::AudioBuffer<float> buffer2 (2, 512);
        engine.processBlock (buffer2, emptyMidi, sid, interpreter, sidOutputBuffer);

        // Passthrough again - the whole block clocked in one go, no silence lead-in.
        expectEquals ((int) sid.clockLog.size(), 1);
        expectEquals (sid.clockLog[0], 512);
    }
};

static AdsrWorkaroundEngineTests adsrWorkaroundEngineTests;
