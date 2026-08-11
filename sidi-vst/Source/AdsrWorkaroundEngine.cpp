#include "AdsrWorkaroundEngine.h"
#include <algorithm>
#include <cmath>

void AdsrWorkaroundEngine::prepare (double sampleRate)
{
    holdSamples = (int) std::round (holdDurationMs / 1000.0 * sampleRate);
    latencySamples = (int) std::round (latencyMs / 1000.0 * sampleRate);
    engaged = false;
    chipSampleCounter = 0;
    pendingTail.clear();
    releaseAtChipSample.fill (-1);
}

void AdsrWorkaroundEngine::clockAndWrite (ISidChip& sid, std::vector<int16_t>& sidOutputBuffer,
                                           juce::AudioBuffer<float>& buffer, int outputStart, int numSamplesToClock)
{
    if (numSamplesToClock <= 0)
        return;

    sid.clock (sidOutputBuffer.data(), numSamplesToClock);

    for (int channel = 0; channel < buffer.getNumChannels(); ++channel)
    {
        auto* channelData = buffer.getWritePointer (channel, outputStart);
        for (int i = 0; i < numSamplesToClock; ++i)
            channelData[i] = (float) sidOutputBuffer[(size_t) i] / 32768.0f;
    }
}

void AdsrWorkaroundEngine::runEventLoop (juce::AudioBuffer<float>& buffer, ISidChip& sid, MidiInterpreter& interpreter,
                                          std::vector<int16_t>& sidOutputBuffer, std::vector<ScheduledEvent> events,
                                          juce::int64 blockChipTimeStart, int outputOffset, int rangeLength)
{
    std::stable_sort (events.begin(), events.end(), [] (const ScheduledEvent& a, const ScheduledEvent& b)
    {
        return a.position < b.position;
    });

    int currentSample = 0;
    size_t index = 0;

    while (index < events.size())
    {
        // NB: Copy, not reference - the insert() below can reallocate the vector.
        const ScheduledEvent event = events[index];

        const int delta = event.position - currentSample;
        if (delta > 0)
        {
            clockAndWrite (sid, sidOutputBuffer, buffer, outputOffset + currentSample, delta);
            currentSample += delta;
        }

        if (event.releaseChannel >= 0)
        {
            interpreter.releaseAdsrHold (event.releaseChannel);
            releaseAtChipSample[(size_t) event.releaseChannel] = -1;
        }
        else
        {
            interpreter.process (event.message);

            // NB: This note on may have just armed a hold (see MidiInterpreter's
            // GATE+TEST logic). It was armed *during* this same loop, so the
            // pre-sort at the top couldn't have known about it - if its release
            // falls within the range still left to process this call, splice a
            // release event in now instead of waiting for the next block's
            // pre-scan of releaseAtChipSample to (too late) pick it up.
            if (event.message.isNoteOn())
            {
                const int channel = event.message.getChannel() - 1;

                if (channel >= 0 && channel < 3 && interpreter.hasPendingAdsrRelease (channel))
                {
                    const juce::int64 releaseAt = blockChipTimeStart + event.position + holdSamples;
                    releaseAtChipSample[(size_t) channel] = releaseAt;

                    const juce::int64 releasePosition = releaseAt - blockChipTimeStart;
                    if (releasePosition >= currentSample && releasePosition < rangeLength)
                    {
                        const auto insertBefore = std::upper_bound (
                            events.begin() + (long) index + 1, events.end(), (int) releasePosition,
                            [] (int pos, const ScheduledEvent& e) { return pos < e.position; });

                        events.insert (insertBefore, { (int) releasePosition, false, {}, channel });
                    }
                }
            }
        }

        ++index;
    }

    if (currentSample < rangeLength)
        clockAndWrite (sid, sidOutputBuffer, buffer, outputOffset + currentSample, rangeLength - currentSample);
}

void AdsrWorkaroundEngine::processBlock (juce::AudioBuffer<float>& buffer, const juce::MidiBuffer& midiMessages,
                                          ISidChip& sid, MidiInterpreter& interpreter, std::vector<int16_t>& sidOutputBuffer)
{
    const int numSamples = buffer.getNumSamples();
    const bool globalEnabled = interpreter.isAdsrWorkaroundGlobalEnabled();

    if (globalEnabled && ! engaged)
    {
        runTransitionBlock (buffer, midiMessages, sid, interpreter, sidOutputBuffer, numSamples);
        return;
    }

    if (! globalEnabled && engaged)
    {
        // NB: Disengaging mid-stream is documented as undefined/glitchy (see the
        // class comment) - any note whose hold hasn't resolved yet just never
        // will. Dropping the schedule here is deliberate, not an oversight.
        engaged = false;
        pendingTail.clear();
        releaseAtChipSample.fill (-1);
    }

    runSteadyStateBlock (buffer, midiMessages, sid, interpreter, sidOutputBuffer, numSamples);
}

void AdsrWorkaroundEngine::runTransitionBlock (juce::AudioBuffer<float>& buffer, const juce::MidiBuffer& midiMessages,
                                                ISidChip& sid, MidiInterpreter& interpreter, std::vector<int16_t>& sidOutputBuffer,
                                                int numSamples)
{
    const int silenceSamples = juce::jmin (latencySamples, numSamples);
    const int clockedSamples = numSamples - silenceSamples;

    buffer.clear (0, silenceSamples);

    std::vector<ScheduledEvent> events;

    for (const auto metadata : midiMessages)
    {
        const int position = metadata.samplePosition;

        if (position < silenceSamples)
        {
            // NB: Chip-time for this message would be negative - it belongs
            // to a moment the chip hasn't reached yet (and never will, since
            // that moment is "before time zero"). Replay it first thing next block.
            pendingTail.push_back (metadata.getMessage());
        }
        else
        {
            events.push_back ({ position - silenceSamples, false, metadata.getMessage(), -1 });
        }
    }

    const juce::int64 blockChipTimeStart = chipSampleCounter;
    runEventLoop (buffer, sid, interpreter, sidOutputBuffer, std::move (events), blockChipTimeStart, silenceSamples, clockedSamples);

    chipSampleCounter += clockedSamples;
    engaged = true;
}

void AdsrWorkaroundEngine::runSteadyStateBlock (juce::AudioBuffer<float>& buffer, const juce::MidiBuffer& midiMessages,
                                                 ISidChip& sid, MidiInterpreter& interpreter, std::vector<int16_t>& sidOutputBuffer,
                                                 int numSamples)
{
    std::vector<ScheduledEvent> events;

    for (auto& tailMessage : pendingTail)
        events.push_back ({ 0, true, tailMessage, -1 });
    pendingTail.clear();

    for (const auto metadata : midiMessages)
        events.push_back ({ metadata.samplePosition, false, metadata.getMessage(), -1 });

    const juce::int64 blockChipTimeStart = chipSampleCounter;

    for (int channel = 0; channel < 3; ++channel)
    {
        if (releaseAtChipSample[(size_t) channel] < 0)
            continue;

        const juce::int64 position = releaseAtChipSample[(size_t) channel] - blockChipTimeStart;
        if (position >= 0 && position < numSamples)
            events.push_back ({ (int) position, false, {}, channel });
    }

    runEventLoop (buffer, sid, interpreter, sidOutputBuffer, std::move (events), blockChipTimeStart, 0, numSamples);

    chipSampleCounter += numSamples;
}
