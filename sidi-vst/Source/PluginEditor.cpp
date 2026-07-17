/*
  ==============================================================================

    This file contains the basic framework code for a JUCE plugin editor.

  ==============================================================================
*/

#include "PluginProcessor.h"
#include "PluginEditor.h"
#include "MidiInterpreter.h"
#include "SidChipAdapter.h"

namespace
{
    constexpr int rowHeight = 18;
    constexpr int titleHeight = 22;
    constexpr int sectionGap = 6;
    constexpr int oscillatorPanelHeight = 300;
    constexpr int internalStatePanelHeight = 130;

    struct BitLabel { const char* name; uint8_t mask; };

    // NB: Order and bit assignments per https://www.oxyron.de/html/registers_sid.html
    constexpr BitLabel controlRegisterBits[] = {
        { "NOISE", 0x80 }, { "PULSE", 0x40 }, { "SAW", 0x20 }, { "TRI", 0x10 },
        { "TEST", 0x08 }, { "RING", 0x04 }, { "SYNC", 0x02 }, { "GATE", 0x01 }
    };

    juce::Rectangle<int> takeRow (juce::Rectangle<int>& bounds, int height = rowHeight)
    {
        return bounds.removeFromTop (height);
    }

    void drawLabelValue (juce::Graphics& g, juce::Rectangle<int> row, const juce::String& label, const juce::String& value)
    {
        g.setColour (juce::Colours::lightgrey);
        g.drawText (label, row.removeFromLeft (row.getWidth() / 2), juce::Justification::centredLeft);

        row.removeFromLeft (6); // NB: gap so the value doesn't butt up against the label

        g.setColour (juce::Colours::white);
        g.drawText (value, row, juce::Justification::centredRight);
    }

    void drawBitLabel (juce::Graphics& g, juce::Rectangle<int> row, const juce::String& label, bool isSet)
    {
        g.setColour (isSet ? juce::Colours::white : juce::Colours::grey);
        g.drawText (label, row, juce::Justification::centredLeft);
    }

    juce::String hex1 (int value) { return juce::String::formatted ("0x%01X", value); }
    juce::String hex2 (int value) { return juce::String::formatted ("0x%02X", value); }
    juce::String hex3 (int value) { return juce::String::formatted ("0x%03X", value); }
    juce::String hex4 (int value) { return juce::String::formatted ("0x%04X", value); }
}

//==============================================================================
NewProjectAudioProcessorEditor::NewProjectAudioProcessorEditor (NewProjectAudioProcessor& p)
    : AudioProcessorEditor (&p), audioProcessor (p)
{
    // Make sure that before the constructor has finished, you've set the
    // editor's size to whatever you need it to be.
    setSize (900, 480);

    startTimerHz (30);
}

NewProjectAudioProcessorEditor::~NewProjectAudioProcessorEditor()
{
    stopTimer();
}

//==============================================================================
void NewProjectAudioProcessorEditor::timerCallback()
{
    repaint();
}

void NewProjectAudioProcessorEditor::drawOscillatorPanel (juce::Graphics& g, juce::Rectangle<int> bounds, int channel)
{
    auto area = bounds.reduced (6);

    g.setFont (juce::FontOptions (16.0f, juce::Font::bold));
    g.setColour (juce::Colours::white);
    g.drawText ("OSC " + juce::String (channel + 1), takeRow (area, titleHeight), juce::Justification::centredLeft);

    g.setFont (juce::FontOptions (14.0f));

    const auto* sidChipAdapter = audioProcessor.getSidChipAdapter();

    if (sidChipAdapter == nullptr)
    {
        g.setColour (juce::Colours::grey);
        g.drawText ("N/A", area, juce::Justification::centred);
        return;
    }

    const int base = channel * 7;
    const int freqLo = sidChipAdapter->getRegisterValue (base + 0);
    const int freqHi = sidChipAdapter->getRegisterValue (base + 1);
    const int pwLo   = sidChipAdapter->getRegisterValue (base + 2);
    const int pwHi   = sidChipAdapter->getRegisterValue (base + 3);
    const int cr     = sidChipAdapter->getRegisterValue (base + 4);
    const int ad     = sidChipAdapter->getRegisterValue (base + 5);
    const int sr     = sidChipAdapter->getRegisterValue (base + 6);

    const int freq = (freqHi << 8) | freqLo;
    const int pw = ((pwHi & 0x0F) << 8) | pwLo;

    drawLabelValue (g, takeRow (area), "FREQ", hex4 (freq));
    drawLabelValue (g, takeRow (area), "PW", hex3 (pw));

    area.removeFromTop (sectionGap);
    g.setColour (juce::Colours::lightgrey);
    g.drawText ("CR", takeRow (area), juce::Justification::centredLeft);

    for (const auto& bit : controlRegisterBits)
        drawBitLabel (g, takeRow (area), bit.name, (cr & bit.mask) != 0);

    area.removeFromTop (sectionGap);
    g.setColour (juce::Colours::lightgrey);
    g.drawText ("ADSR", takeRow (area), juce::Justification::centredLeft);

    const int attack  = (ad >> 4) & 0x0F;
    const int decay   = ad & 0x0F;
    const int sustain = (sr >> 4) & 0x0F;
    const int release = sr & 0x0F;

    auto adsrRow1 = takeRow (area);
    drawLabelValue (g, adsrRow1.removeFromLeft (adsrRow1.getWidth() / 2), "A", hex1 (attack));
    adsrRow1.removeFromLeft (12); // NB: gap so A's value doesn't butt up against D's label
    drawLabelValue (g, adsrRow1, "D", hex1 (decay));

    auto adsrRow2 = takeRow (area);
    drawLabelValue (g, adsrRow2.removeFromLeft (adsrRow2.getWidth() / 2), "S", hex1 (sustain));
    adsrRow2.removeFromLeft (12); // NB: gap so S's value doesn't butt up against R's label
    drawLabelValue (g, adsrRow2, "R", hex1 (release));
}

void NewProjectAudioProcessorEditor::drawInternalStatePanel (juce::Graphics& g, juce::Rectangle<int> bounds, int channel)
{
    auto area = bounds.reduced (6);

    g.setFont (juce::FontOptions (16.0f, juce::Font::bold));
    g.setColour (juce::Colours::white);
    g.drawText ("CH " + juce::String (channel + 1), takeRow (area, titleHeight), juce::Justification::centredLeft);

    g.setFont (juce::FontOptions (14.0f));

    const auto* midiInterpreter = audioProcessor.getMidiInterpreter();

    if (midiInterpreter == nullptr)
    {
        g.setColour (juce::Colours::grey);
        g.drawText ("N/A", area, juce::Justification::centred);
        return;
    }

    const int lastPressedKey = midiInterpreter->getLastPressedKey (channel);
    const int rpnMsb = midiInterpreter->getRpnMsb (channel);
    const int rpnLsb = midiInterpreter->getRpnLsb (channel);
    const int maxBendSemitones = midiInterpreter->getMaxBendSemitones (channel);
    const float pitchBendAmount = midiInterpreter->getPitchBendAmount (channel);

    drawLabelValue (g, takeRow (area), "LAST KEY", lastPressedKey >= 0 ? juce::String (lastPressedKey) : "-1");
    drawLabelValue (g, takeRow (area), "RPN MSB", hex2 (rpnMsb));
    drawLabelValue (g, takeRow (area), "RPN LSB", hex2 (rpnLsb));
    drawLabelValue (g, takeRow (area), "MAX BEND", juce::String (maxBendSemitones) + " st");
    drawLabelValue (g, takeRow (area), "PITCH BEND", juce::String (pitchBendAmount, 3));
}

void NewProjectAudioProcessorEditor::paint (juce::Graphics& g)
{
    // (Our component is opaque, so we must completely fill the background with a solid colour)
    g.fillAll (getLookAndFeel().findColour (juce::ResizableWindow::backgroundColourId));

    auto bounds = getLocalBounds().reduced (10);

    auto oscillatorArea = bounds.removeFromTop (oscillatorPanelHeight);
    const int oscillatorColumnWidth = oscillatorArea.getWidth() / 3;

    for (int channel = 0; channel < 3; ++channel)
        drawOscillatorPanel (g, oscillatorArea.removeFromLeft (oscillatorColumnWidth), channel);

    bounds.removeFromTop (12);

    auto stateArea = bounds.removeFromTop (internalStatePanelHeight);
    const int stateColumnWidth = stateArea.getWidth() / 3;

    for (int channel = 0; channel < 3; ++channel)
        drawInternalStatePanel (g, stateArea.removeFromLeft (stateColumnWidth), channel);
}

void NewProjectAudioProcessorEditor::resized()
{
    // This is generally where you'll want to lay out the positions of any
    // subcomponents in your editor..
}
