#pragma once

#include "ISidChip.h"
#include "MidiInterpreter.h"
#include <juce_audio_basics/juce_audio_basics.h>
#include <array>
#include <vector>

/**
    Owns the sample-accurate event-scheduling plumbing behind the "ADSR
    workaround" (see ContinuousController::AdsrWorkaroundGlobal/AdsrWorkaroundChannel
    and MidiInterpreter's ADSR priming/hold). Kept separate from the AudioProcessor
    so the transition/steady-state block logic can be driven by a FakeSidChip
    in tests instead of the real reSIDfp::SID.

    While MidiInterpreter's global flag is off, processBlock() behaves exactly
    like a plain clock-and-copy loop. The first block after the flag turns on
    pays a one-off, undeclared cost: silenceSamples() worth of silence is
    written up front (there's nothing to output yet - see prepare()'s comment
    on why that many samples), the chip is only clocked for the remainder of
    that block, and any MIDI message that landed in the silent lead-in is
    queued to be replayed - ahead of that next block's own messages - once the
    chip actually reaches that moment. This is a real, audible artifact of
    engaging the workaround, but it's a one-time transient, not an ongoing
    per-sample delay - every event after that lead-in lands at the exact same
    output position it arrived at (see runEventLoop), so there's nothing here
    for a host's plugin-delay-compensation to legitimately correct for, and
    this class deliberately does not report any latency to the host.

    Turning the global flag off again drops any pending hold-release schedule
    outright - deliberately glitchy/undefined per the documented "don't touch
    this during playback" contract, not something this class tries to smooth
    over.
*/
class AdsrWorkaroundEngine
{
public:
    // NB: holdDurationMs matches the MIDIbox SID manual's documented ADSR-bug
    // workaround duration; silenceLeadInMs adds a small margin on top so the
    // hold always has room to resolve within the one-off startup silence,
    // never right at its edge.
    static constexpr double holdDurationMs = 30.0;
    static constexpr double silenceLeadInMs = 33.0;

    void prepare (double sampleRate);

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
    int silenceLeadInSamples = 0;
    bool engaged = false;

    std::vector<juce::MidiMessage> pendingTail;
    std::array<juce::int64, 3> releaseAtChipSample { -1, -1, -1 };
    juce::int64 chipSampleCounter = 0;
};
