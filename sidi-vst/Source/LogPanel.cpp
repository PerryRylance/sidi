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

    for (auto& line : drained)
    {
        displayedLines.push_back (std::move (line));

        if (displayedLines.size() > maxDisplayedEntries)
            displayedLines.pop_front();
    }

    juce::String text;
    for (const auto& line : displayedLines)
        text << line << "\n";

    textEditor.setText (text, false);
    textEditor.moveCaretToEnd();
}
