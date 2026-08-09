/*
  ==============================================================================

    This file contains the basic framework code for a JUCE plugin processor.

  ==============================================================================
*/

#include "PluginProcessor.h"
#include "PluginEditor.h"
#include "SID.h"

namespace
{
    // NB: Dumps the message exactly as received, ahead of any interpretation (and
    // ahead of MidiInterpreter's own channel-range guard) - the point of this log is
    // to see what actually arrived from the host, not what the interpreter made of it.
    juce::String formatMidiMessageForLog (const juce::MidiMessage& message, int samplePosition)
    {
        juce::String raw;
        for (int i = 0; i < message.getRawDataSize(); ++i)
            raw << juce::String::formatted ("%02X ", (unsigned) message.getRawData()[i]);

        juce::String description;

        if (message.isNoteOn())
            description << "NoteOn ch=" << message.getChannel() << " note=" << message.getNoteNumber() << " vel=" << (int) message.getVelocity();
        else if (message.isNoteOff())
            description << "NoteOff ch=" << message.getChannel() << " note=" << message.getNoteNumber() << " vel=" << (int) message.getVelocity();
        else if (message.isController())
            description << "CC ch=" << message.getChannel() << " cc=" << message.getControllerNumber() << " val=" << message.getControllerValue();
        else if (message.isPitchWheel())
            description << "PitchWheel ch=" << message.getChannel() << " val=" << message.getPitchWheelValue();
        else
            description << message.getDescription();

        // NB: Deliberately not String::formatted("...%s...", someString.toRawUTF8()) here -
        // passing a raw narrow char* into a %s placeholder is a known Windows footgun (the
        // underlying formatting can disagree on narrow/wide encoding), and that's exactly what
        // was producing garbled log text. Plain String concatenation has no such ambiguity.
        return "sample=" + juce::String (samplePosition).paddedLeft (' ', 6)
             + "  raw=[" + raw.trim() + "]  " + description;
    }
}

//==============================================================================
NewProjectAudioProcessor::NewProjectAudioProcessor()
#ifndef JucePlugin_PreferredChannelConfigurations
     : AudioProcessor (BusesProperties()
                     #if ! JucePlugin_IsMidiEffect
                      #if ! JucePlugin_IsSynth
                       .withInput  ("Input",  juce::AudioChannelSet::stereo(), true)
                      #endif
                       .withOutput ("Output", juce::AudioChannelSet::stereo(), true)
                     #endif
                       )
#endif
{
}

NewProjectAudioProcessor::~NewProjectAudioProcessor()
{
}

//==============================================================================
const juce::String NewProjectAudioProcessor::getName() const
{
    return JucePlugin_Name;
}

bool NewProjectAudioProcessor::acceptsMidi() const
{
   #if JucePlugin_WantsMidiInput
    return true;
   #else
    return false;
   #endif
}

bool NewProjectAudioProcessor::producesMidi() const
{
   #if JucePlugin_ProducesMidiOutput
    return true;
   #else
    return false;
   #endif
}

bool NewProjectAudioProcessor::isMidiEffect() const
{
   #if JucePlugin_IsMidiEffect
    return true;
   #else
    return false;
   #endif
}

double NewProjectAudioProcessor::getTailLengthSeconds() const
{
    return 0.0;
}

int NewProjectAudioProcessor::getNumPrograms()
{
    return 1;   // NB: some hosts don't cope very well if you tell them there are 0 programs,
                // so this should be at least 1, even if you're not really implementing programs.
}

int NewProjectAudioProcessor::getCurrentProgram()
{
    return 0;
}

void NewProjectAudioProcessor::setCurrentProgram (int index)
{
}

const juce::String NewProjectAudioProcessor::getProgramName (int index)
{
    return {};
}

void NewProjectAudioProcessor::changeProgramName (int index, const juce::String& newName)
{
}

//==============================================================================
void NewProjectAudioProcessor::prepareToPlay (double sampleRate, int samplesPerBlock)
{
    sid = std::make_unique<reSIDfp::SID>();
    sid->setChipModel (reSIDfp::CSG8580);
    sid->setSamplingParameters (985248.0, reSIDfp::RESAMPLE, sampleRate); // NB: PAL clock, see sidi-web/src/ClockFrequencyHz.ts

    sidChipAdapter = std::make_unique<SidChipAdapter> (*sid);
    midiInterpreter = std::make_unique<MidiInterpreter> (*sidChipAdapter,
                                                           SidChipAdapter::DEFAULT_CONTROL_REGISTER,
                                                           SidChipAdapter::DEFAULT_SUSTAIN_RELEASE);

    sidOutputBuffer.resize ((size_t) samplesPerBlock);
}

void NewProjectAudioProcessor::releaseResources()
{
    // The emulator carries internal state (filter/envelope history, bus
    // value decay, etc.) that shouldn't leak between DAW playbacks, so we
    // discard it here rather than just resetting registers.
    midiInterpreter.reset();
    sidChipAdapter.reset();
    sid.reset();
}

#ifndef JucePlugin_PreferredChannelConfigurations
bool NewProjectAudioProcessor::isBusesLayoutSupported (const BusesLayout& layouts) const
{
  #if JucePlugin_IsMidiEffect
    juce::ignoreUnused (layouts);
    return true;
  #else
    // This is the place where you check if the layout is supported.
    // In this template code we only support mono or stereo.
    // Some plugin hosts, such as certain GarageBand versions, will only
    // load plugins that support stereo bus layouts.
    if (layouts.getMainOutputChannelSet() != juce::AudioChannelSet::mono()
     && layouts.getMainOutputChannelSet() != juce::AudioChannelSet::stereo())
        return false;

    // This checks if the input layout matches the output layout
   #if ! JucePlugin_IsSynth
    if (layouts.getMainOutputChannelSet() != layouts.getMainInputChannelSet())
        return false;
   #endif

    return true;
  #endif
}
#endif

void NewProjectAudioProcessor::processBlock (juce::AudioBuffer<float>& buffer, juce::MidiBuffer& midiMessages)
{
    juce::ScopedNoDenormals noDenormals;

    const int numSamples = buffer.getNumSamples();
    int currentSample = 0;

    for (const auto metadata : midiMessages)
    {
        const int delta = metadata.samplePosition - currentSample;

        if (delta > 0)
        {
            sid->clock (sidOutputBuffer.data(), delta);
            writeSidOutputToBuffer (buffer, currentSample, delta);
            currentSample += delta;
        }

        // NB: Skip formatting entirely while the Log tab isn't visible (see MidiLog::setActive,
        // driven by LogPanel::visibilityChanged) - the string building is the expensive part,
        // not just the FIFO write, so gating only the write would leave most of the cost behind.
        if (midiLog.isActive())
            midiLog.add (formatMidiMessageForLog (metadata.getMessage(), metadata.samplePosition));

        midiInterpreter->process (metadata.getMessage());
    }

    if (currentSample < numSamples)
    {
        const int remaining = numSamples - currentSample;
        sid->clock (sidOutputBuffer.data(), remaining);
        writeSidOutputToBuffer (buffer, currentSample, remaining);
    }
}

void NewProjectAudioProcessor::writeSidOutputToBuffer (juce::AudioBuffer<float>& buffer, int startSample, int numSamplesToWrite)
{
    for (int channel = 0; channel < buffer.getNumChannels(); ++channel)
    {
        auto* channelData = buffer.getWritePointer (channel, startSample);

        for (int i = 0; i < numSamplesToWrite; ++i)
            channelData[i] = (float) sidOutputBuffer[(size_t) i] / 32768.0f;

    }
}

//==============================================================================
bool NewProjectAudioProcessor::hasEditor() const
{
    return true; // (change this to false if you choose to not supply an editor)
}

juce::AudioProcessorEditor* NewProjectAudioProcessor::createEditor()
{
    return new NewProjectAudioProcessorEditor (*this);
}

//==============================================================================
void NewProjectAudioProcessor::getStateInformation (juce::MemoryBlock& destData)
{
    // You should use this method to store your parameters in the memory block.
    // You could do that either as raw data, or use the XML or ValueTree classes
    // as intermediaries to make it easy to save and load complex data.
}

void NewProjectAudioProcessor::setStateInformation (const void* data, int sizeInBytes)
{
    // You should use this method to restore your parameters from this memory block,
    // whose contents will have been created by the getStateInformation() call.
}

//==============================================================================
// This creates new instances of the plugin..
juce::AudioProcessor* JUCE_CALLTYPE createPluginFilter()
{
    return new NewProjectAudioProcessor();
}
