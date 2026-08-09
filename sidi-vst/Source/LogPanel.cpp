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
    auto drained = audioProcessor.getMidiLog().drain();

    if (drained.empty())
        return;

    // NB: Append only - a full setText() rebuild on every poll tick was the "insanely
    // slow" bottleneck (was rebuilding up to 500 lines from scratch several times a
    // second under real MIDI volume). insertTextAtCaret() only costs what's actually new.
    juce::String toAppend;

    for (const auto& line : drained)
    {
        const juce::String withNewline = line + "\n";
        toAppend << withNewline;
        displayedLineLengths.push_back (withNewline.length());
    }

    textEditor.moveCaretToEnd();
    textEditor.insertTextAtCaret (toAppend);

    if (displayedLineLengths.size() > maxDisplayedEntries)
    {
        int charsToRemove = 0;

        while (displayedLineLengths.size() > maxDisplayedEntries)
        {
            charsToRemove += displayedLineLengths.front();
            displayedLineLengths.pop_front();
        }

        // NB: The only path that pays for a full rebuild - happens roughly once every
        // maxDisplayedEntries new lines, not on every poll tick.
        textEditor.setText (textEditor.getText().substring (charsToRemove), false);
        textEditor.moveCaretToEnd();
    }
}
