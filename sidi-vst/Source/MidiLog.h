#pragma once

#include <JuceHeader.h>
#include <deque>
#include <vector>

/**
    Fixed-capacity ring buffer of log lines, written from the audio thread
    (PluginProcessor::processBlock) and read from the message thread (LogPanel).

    NB: Guarded with a CriticalSection rather than a lock-free queue. That's
    normally the wrong call on the audio thread, but this is a diagnostic-only
    path (one add() per incoming MIDI message, not per sample) and the lock is
    only ever held for a deque push/pop or a short linear copy - an acceptable
    trade for the simplicity here.
*/
class MidiLog
{
public:
    struct Entry
    {
        uint64_t sequence;
        juce::String text;
    };

    static constexpr size_t maxEntries = 500;

    void add (const juce::String& text)
    {
        const juce::ScopedLock lock (criticalSection);

        entries.push_back ({ nextSequence++, text });

        if (entries.size() > maxEntries)
            entries.pop_front();
    }

    // NB: Everything currently retained with sequence > afterSequence, oldest first.
    // Pass 0 to get the full retained set (at most maxEntries, oldest already evicted).
    std::vector<Entry> getEntriesAfter (uint64_t afterSequence) const
    {
        const juce::ScopedLock lock (criticalSection);

        std::vector<Entry> result;

        for (const auto& entry : entries)
            if (entry.sequence > afterSequence)
                result.push_back (entry);

        return result;
    }

private:
    juce::CriticalSection criticalSection;
    std::deque<Entry> entries;
    uint64_t nextSequence = 1;
};
