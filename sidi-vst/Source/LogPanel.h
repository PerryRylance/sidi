#pragma once

#include <JuceHeader.h>

class NewProjectAudioProcessor;

/**
    Displays PluginProcessor's MidiLog ring buffer as scrollable, selectable
    text (a read-only multiline TextEditor gives us both for free). Polls for
    new entries on a timer rather than being pushed to live - MidiLog is
    written from the audio thread (processBlock), this runs on the message
    thread.
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

    NewProjectAudioProcessor& audioProcessor;
    juce::TextEditor textEditor;
    uint64_t lastSeenSequence = 0;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (LogPanel)
};
