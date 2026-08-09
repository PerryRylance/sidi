/*
  ==============================================================================

    This file contains the basic framework code for a JUCE plugin processor.

  ==============================================================================
*/

#pragma once

#include <JuceHeader.h>
#include "MidiInterpreter.h"
#include "SidChipAdapter.h"
#include "MidiLog.h"
#include <memory>
#include <vector>

namespace reSIDfp { class SID; }

//==============================================================================
/**
*/
class NewProjectAudioProcessor  : public juce::AudioProcessor
{
public:
    //==============================================================================
    NewProjectAudioProcessor();
    ~NewProjectAudioProcessor() override;

    //==============================================================================
    void prepareToPlay (double sampleRate, int samplesPerBlock) override;
    void releaseResources() override;

   #ifndef JucePlugin_PreferredChannelConfigurations
    bool isBusesLayoutSupported (const BusesLayout& layouts) const override;
   #endif

    void processBlock (juce::AudioBuffer<float>&, juce::MidiBuffer&) override;

    //==============================================================================
    juce::AudioProcessorEditor* createEditor() override;
    bool hasEditor() const override;

    //==============================================================================
    const juce::String getName() const override;

    bool acceptsMidi() const override;
    bool producesMidi() const override;
    bool isMidiEffect() const override;
    double getTailLengthSeconds() const override;

    //==============================================================================
    int getNumPrograms() override;
    int getCurrentProgram() override;
    void setCurrentProgram (int index) override;
    const juce::String getProgramName (int index) override;
    void changeProgramName (int index, const juce::String& newName) override;

    //==============================================================================
    void getStateInformation (juce::MemoryBlock& destData) override;
    void setStateInformation (const void* data, int sizeInBytes) override;

    //==============================================================================
    // NB: Null between construction/releaseResources and prepareToPlay; the
    // editor must guard against this when polling for register state.
    const SidChipAdapter* getSidChipAdapter() const noexcept { return sidChipAdapter.get(); }
    const MidiInterpreter* getMidiInterpreter() const noexcept { return midiInterpreter.get(); }

    // NB: Unlike the members above, the log outlives prepareToPlay/releaseResources
    // cycles - it's diagnostic history, not chip state, so a plugin reload shouldn't
    // wipe it out from under the Log tab.
    const MidiLog& getMidiLog() const noexcept { return midiLog; }

private:
    //==============================================================================
    void writeSidOutputToBuffer (juce::AudioBuffer<float>& buffer, int startSample, int numSamplesToWrite);

    std::unique_ptr<reSIDfp::SID> sid;
    std::unique_ptr<SidChipAdapter> sidChipAdapter;
    std::unique_ptr<MidiInterpreter> midiInterpreter;
    std::vector<int16_t> sidOutputBuffer;
    MidiLog midiLog;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (NewProjectAudioProcessor)
};
