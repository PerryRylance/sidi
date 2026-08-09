/*
  ==============================================================================

    This file contains the basic framework code for a JUCE plugin editor.

  ==============================================================================
*/

#include "PluginProcessor.h"
#include "PluginEditor.h"
#include "StatePanel.h"
#include "LogPanel.h"

//==============================================================================
NewProjectAudioProcessorEditor::NewProjectAudioProcessorEditor (NewProjectAudioProcessor& p)
    : AudioProcessorEditor (&p), audioProcessor (p)
{
    // Make sure that before the constructor has finished, you've set the
    // editor's size to whatever you need it to be.
    setSize (900, 520);

    // NB: TabbedComponent takes ownership of tab content components (deleteComponentWhenNotNeeded=true).
    tabbedComponent.addTab ("State", juce::Colours::darkgrey, new StatePanel (audioProcessor), true);
    tabbedComponent.addTab ("Log", juce::Colours::darkgrey, new LogPanel (audioProcessor), true);

    addAndMakeVisible (tabbedComponent);
}

NewProjectAudioProcessorEditor::~NewProjectAudioProcessorEditor()
{
}

//==============================================================================
void NewProjectAudioProcessorEditor::paint (juce::Graphics& g)
{
    // (Our component is opaque, so we must completely fill the background with a solid colour)
    g.fillAll (getLookAndFeel().findColour (juce::ResizableWindow::backgroundColourId));
}

void NewProjectAudioProcessorEditor::resized()
{
    tabbedComponent.setBounds (getLocalBounds());
}
