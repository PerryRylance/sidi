#pragma once

#include <JuceHeader.h>
#include <vector>

/**
    Lock-free single-producer/single-consumer transport for log lines: written
    from the audio thread (PluginProcessor::processBlock), drained from the
    message thread (LogPanel's poll timer).

    NB: This used to be a CriticalSection-guarded deque. That's the wrong call
    on the audio thread - on Windows, the audio callback thread runs boosted
    (MMCSS) priority, and a plain mutex shared with the normal-priority message
    thread has no priority inheritance, so if the message thread gets preempted
    mid-lock the audio thread's next add() can spin waiting on a lock the OS
    never lets its holder run long enough to release. That's a real,
    reproducible freeze the moment MIDI starts flowing (heard: audio keeps
    playing off the audio thread; seen: the whole plugin/DAW UI locks up, since
    it's the message thread - Timers, repaints, everything - that's starved).
    AbstractFifo's read/write indices are atomics with no locking at all, so
    there's nothing for the audio thread to ever block on here.
*/
class MidiLog
{
public:
    // NB: Headroom for a burst of MIDI arriving between LogPanel's polls (4Hz) - this is
    // "how many lines can be in flight before being drained", not "how many are displayed".
    // The displayed cap (500, per the Log tab's spec) is enforced by the consumer (LogPanel).
    static constexpr int fifoCapacity = 4096;

    MidiLog() : fifo (fifoCapacity), buffer ((size_t) fifoCapacity) {}

    // NB: Set by LogPanel::visibilityChanged() - lets the audio thread skip both the
    // string formatting and the FIFO write entirely while nobody's looking at the Log
    // tab, rather than just paying transport cost for a display nobody's rendering.
    void setActive (bool shouldBeActive) noexcept { active.store (shouldBeActive, std::memory_order_relaxed); }
    bool isActive() const noexcept { return active.load (std::memory_order_relaxed); }

    // NB: Audio thread. Drops the line rather than blocking or growing if the consumer
    // hasn't drained fast enough - acceptable for a diagnostic log, unacceptable would be
    // stalling the audio callback to guarantee delivery.
    void add (const juce::String& text)
    {
        int start1, size1, start2, size2;
        fifo.prepareToWrite (1, start1, size1, start2, size2);

        if (size1 + size2 == 0)
            return;

        buffer[(size_t) (size1 > 0 ? start1 : start2)] = text;
        fifo.finishedWrite (size1 + size2);
    }

    // NB: Message thread. Returns everything currently available, oldest first.
    std::vector<juce::String> drain()
    {
        std::vector<juce::String> result;

        int start1, size1, start2, size2;
        fifo.prepareToRead (fifo.getNumReady(), start1, size1, start2, size2);

        result.reserve ((size_t) (size1 + size2));

        for (int i = 0; i < size1; ++i)
            result.push_back (buffer[(size_t) (start1 + i)]);

        for (int i = 0; i < size2; ++i)
            result.push_back (buffer[(size_t) (start2 + i)]);

        fifo.finishedRead (size1 + size2);

        return result;
    }

private:
    std::atomic<bool> active { false };
    juce::AbstractFifo fifo;
    std::vector<juce::String> buffer;
};
