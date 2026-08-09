#pragma once

#include <JuceHeader.h>

class NewProjectAudioProcessor;

/**
    The plugin's original always-on-screen state display (per-oscillator SID
    registers plus per-channel interpreter state), now living on its own tab
    so it can sit alongside the Log tab. Content and layout are unchanged from
    before the tabs were introduced - only the repaint timer moved here from
    the editor, since only this tab needs continuous repainting.
*/
class StatePanel  : public juce::Component,
                     private juce::Timer
{
public:
    explicit StatePanel (NewProjectAudioProcessor& processorToDisplay);
    ~StatePanel() override;

    void paint (juce::Graphics&) override;

private:
    void timerCallback() override;

    void drawOscillatorPanel (juce::Graphics& g, juce::Rectangle<int> bounds, int channel);
    void drawInternalStatePanel (juce::Graphics& g, juce::Rectangle<int> bounds, int channel);

    NewProjectAudioProcessor& audioProcessor;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (StatePanel)
};
