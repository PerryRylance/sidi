#pragma once

#include "ISidChip.h"
#include "MidiInterpreter.h"
#include <juce_audio_basics/juce_audio_basics.h>
#include <array>
#include <vector>

/**
    Owns the sample-accurate delay-line plumbing behind the "ADSR workaround"
    (see ContinuousController::AdsrWorkaroundGlobal/AdsrWorkaroundChannel and
    MidiInterpreter's GATE+TEST hold). Kept separate from the AudioProcessor
    so the transition/steady-state block logic can be driven by a FakeSidChip
    in tests instead of the real reSIDfp::SID.

    While MidiInterpreter's global flag is off, processBlock() behaves exactly
    like a plain clock-and-copy loop with zero added latency. The first block
    after the flag turns on pays a one-off cost: latencySamples() worth of
    silence is written up front (there's nothing delayed yet to output), the
    chip is only clocked for the remainder of that block, and any MIDI message
    that landed in the silent lead-in is queued to be replayed - ahead of that
    next block's own messages - once the chip actually reaches that moment.
    Every block after that runs at a constant latencySamples() delay, which is
    what gives a held note's GATE+TEST resolution (~30ms, see MidiInterpreter)
    room to land before the audio reaches the output.

    Turning the global flag off again drops the delay-line and any pending
    hold-release schedule outright - deliberately glitchy/undefined per the
    documented "don't touch this during playback" contract, not something
    this class tries to smooth over.
*/
class AdsrWorkaroundEngine
{
public:
    // NB: holdDurationMs matches the MIDIbox SID manual's documented ADSR-bug
    // workaround duration; latencyMs adds a small margin on top so the hold
    // always has room to resolve inside the delay line, never right at its edge.
    static constexpr double holdDurationMs = 30.0;
    static constexpr double latencyMs = 33.0;

    void prepare (double sampleRate);

    // NB: 0 until the global flag has actually caused a transition block to
    // run (see the class comment) - not just whenever the flag is set, since
    // no delay exists until that first transition has actually happened.
    int getLatencySamples() const noexcept { return engaged ? latencySamples : 0; }

    void processBlock (juce::AudioBuffer<float>& buffer,
                        const juce::MidiBuffer& midiMessages,
                        ISidChip& sid,
                        MidiInterpreter& interpreter,
                        std::vector<int16_t>& sidOutputBuffer);

private:
    struct ScheduledEvent
    {
        int position; // sample offset from the start of this call's clocking range
        bool isTailMessage;
        juce::MidiMessage message; // unused when this is a release event
        int releaseChannel; // -1 unless this is a release event
    };

    void runTransitionBlock (juce::AudioBuffer<float>& buffer, const juce::MidiBuffer& midiMessages,
                              ISidChip& sid, MidiInterpreter& interpreter, std::vector<int16_t>& sidOutputBuffer,
                              int numSamples);

    void runSteadyStateBlock (juce::AudioBuffer<float>& buffer, const juce::MidiBuffer& midiMessages,
                               ISidChip& sid, MidiInterpreter& interpreter, std::vector<int16_t>& sidOutputBuffer,
                               int numSamples);

    void clockAndWrite (ISidChip& sid, std::vector<int16_t>& sidOutputBuffer,
                         juce::AudioBuffer<float>& buffer, int outputStart, int numSamplesToClock);

    // NB: Shared by both block kinds - clocks/processes a sorted event list across
    // [0, rangeLength) of chip-time (blockChipTimeStart-relative), writing chip
    // audio into buffer starting at outputOffset. A note on that arms a new hold
    // may need to insert its own release event mid-loop if that release falls
    // inside this same range - see the .cpp for why a single pre-sort isn't enough.
    void runEventLoop (juce::AudioBuffer<float>& buffer, ISidChip& sid, MidiInterpreter& interpreter,
                        std::vector<int16_t>& sidOutputBuffer, std::vector<ScheduledEvent> events,
                        juce::int64 blockChipTimeStart, int outputOffset, int rangeLength);

    int holdSamples = 0;
    int latencySamples = 0;
    bool engaged = false;

    std::vector<juce::MidiMessage> pendingTail;
    std::array<juce::int64, 3> releaseAtChipSample { -1, -1, -1 };
    juce::int64 chipSampleCounter = 0;
};
