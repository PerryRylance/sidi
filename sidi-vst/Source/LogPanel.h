#pragma once

#include <JuceHeader.h>
#include <deque>

class NewProjectAudioProcessor;

/**
    Displays PluginProcessor's MidiLog as scrollable, selectable text (a
    read-only multiline TextEditor gives us both for free). Polls MidiLog's
    lock-free FIFO on a timer and keeps its own message-thread-local history,
    capped at maxDisplayedEntries - MidiLog itself no longer knows about the
    500-entry display cap, only about not blocking the audio thread.
*/
class LogPanel  : public juce::Component,
                   private juce::Timer
{
public:
    explicit LogPanel (NewProjectAudioProcessor& processorToDisplay);
    ~LogPanel() override;

    void resized() override;

private:
    void timerCallback() override;

    static constexpr size_t maxDisplayedEntries = 500;

    NewProjectAudioProcessor& audioProcessor;
    juce::TextEditor textEditor;

    // NB: Length (including the trailing '\n') of each currently-displayed line, in
    // display order - lets trimming remove exactly the right number of leading
    // characters from the TextEditor without re-deriving anything from MidiLog.
    std::deque<int> displayedLineLengths;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (LogPanel)
};
