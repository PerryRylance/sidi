#include "LogPanel.h"
#include "PluginProcessor.h"

namespace
{
    constexpr int pollHz = 4;
}

//==============================================================================
LogPanel::LogPanel (NewProjectAudioProcessor& processorToDisplay)
    : audioProcessor (processorToDisplay)
{
    textEditor.setMultiLine (true);
    textEditor.setReturnKeyStartsNewLine (false);
    textEditor.setReadOnly (true); // NB: read-only blocks user edits, not selection/copy
    textEditor.setCaretVisible (false);
    textEditor.setScrollbarsShown (true);
    textEditor.setFont (juce::FontOptions (juce::Font::getDefaultMonospacedFontName(), 13.0f, juce::Font::plain));
    textEditor.setColour (juce::TextEditor::backgroundColourId, juce::Colours::black);
    textEditor.setColour (juce::TextEditor::textColourId, juce::Colours::lightgreen);
    textEditor.setColour (juce::TextEditor::outlineColourId, juce::Colours::transparentBlack);
    textEditor.setColour (juce::TextEditor::focusedOutlineColourId, juce::Colours::transparentBlack);

    addAndMakeVisible (textEditor);

    startTimerHz (pollHz);
}

LogPanel::~LogPanel()
{
    stopTimer();
}

void LogPanel::resized()
{
    textEditor.setBounds (getLocalBounds().reduced (6));
}

void LogPanel::timerCallback()
{
    const auto newEntries = audioProcessor.getMidiLog().getEntriesAfter (lastSeenSequence);

    if (newEntries.empty())
        return;

    // NB: Full resync rather than incremental append - MidiLog's 500-entry cap can
    // evict from the front between polls, and re-deriving the whole displayed text
    // from the current retained set is simpler (if less scroll-friendly) than
    // tracking and trimming leading lines out of the TextEditor by hand.
    const auto allEntries = audioProcessor.getMidiLog().getEntriesAfter (0);

    juce::String text;
    for (const auto& entry : allEntries)
        text << entry.text << "\n";

    textEditor.setText (text, false);
    textEditor.moveCaretToEnd();

    lastSeenSequence = newEntries.back().sequence;
}
