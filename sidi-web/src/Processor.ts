import { File, SetTempoEvent, NoteOnEvent } from "@perry-rylance/midi";
import { Pal } from "./ClockFrequencyHz";
import MidiInterpreter from "./MidiInterpreter";
import SidChipAdapter from "./SidChipAdapter";

export default class Processor
{
    // NB: Matches sidi-vst's AdsrWorkaroundEngine::holdDurationMs and the MIDIbox SID manual's
    // documented ADSR-bug workaround duration. Unlike the VST, there's no host audio callback or
    // plugin-delay-compensation concept here to give the hold "room" to resolve ahead of time - see
    // clockRespectingPendingReleases, which just splits whatever clocking span it's given so the
    // release always lands on its exact sample, however far in advance or arrears it's discovered.
    private static readonly holdDurationMs = 30;

    private bpm: number = 120;
    private buffer: Int16Array = new Int16Array();
    private interpreter: MidiInterpreter;
    private nextEventIndex: number = 0;
    private accumulatedDeltaSamples: number = 0;

    // NB: Running ideal (unrounded) position, so independently Math.round()-ing every event's delta
    // can't accumulate bias into audible drift over a long file - see getNumSamplesFromDelta.
    private idealElapsedSeconds: number = 0;
    private roundedElapsedSamples: number = 0;
    private currentEventTotalSamples: number | null = null;

    // NB: ADSR-workaround hold scheduling - see clockRespectingPendingReleases. totalSamplesClocked
    // is a plain monotonic count of every sample ever handed to sid.clock(), independent of the
    // tempo-based bookkeeping above, since a hold's ~30ms is real wall-clock time, not musical time.
    private readonly holdSamples: number;
    private releaseAtSample: Array<number | null> = [null, null, null];
    private totalSamplesClocked: number = 0;

    constructor(
        // NB: Insists on SidChipAdapter, not the plain SID interface it also satisfies - so its
        // known power-on defaults (see SidChipAdapter.DEFAULT_*) can be passed to MidiInterpreter
        // explicitly, rather than guessed at via the chip's own unreliable read() (see SidChipAdapter).
        private sid: SidChipAdapter,
        private midi: File,
        private sampleRate: number = 44100,
        private clockFrequencyHz: number = Pal,
    )
    {
        if(midi.tracks.length !== 1)
            throw new Error("Expected only 1 track");

        this.interpreter = new MidiInterpreter(
            this.sid,
            this.clockFrequencyHz,
            SidChipAdapter.DEFAULT_CONTROL_REGISTER,
            SidChipAdapter.DEFAULT_SUSTAIN_RELEASE,
            SidChipAdapter.DEFAULT_FILTER_MODE_VOLUME,
            this.sampleRate,
        );

        this.holdSamples = Math.round(Processor.holdDurationMs / 1000 * this.sampleRate);
    }

    // NB: Lets callers (eg. tests, or UI wanting to display live ADSR-workaround state) inspect the
    // interpreter without Processor having to duplicate its getters.
    getInterpreter(): MidiInterpreter
    {
        return this.interpreter;
    }

    // NB: Called potentially many times for the same event (see the split-buffer branch in
    // process(), which revisits the current event across calls without advancing nextEventIndex) -
    // memoized per-event via currentEventTotalSamples so the cumulative correction below only
    // applies once per event, not once per call.
    private getNumSamplesFromDelta(delta: number): number
    {
        if (this.currentEventTotalSamples !== null)
            return this.currentEventTotalSamples;

        const totalBeats = delta / this.midi.resolution.ticksPerQuarterNote;
        const secondsPerBeat = 60 / this.bpm;
        const deltaInSeconds = totalBeats * secondsPerBeat;

        this.idealElapsedSeconds += deltaInSeconds;

        const newRoundedElapsedSamples = Math.round(this.idealElapsedSeconds * this.sampleRate);
        this.currentEventTotalSamples = newRoundedElapsedSamples - this.roundedElapsedSamples;
        this.roundedElapsedSamples = newRoundedElapsedSamples;

        return this.currentEventTotalSamples;
    }

    private clockAndWrite(buffer: Int16Array, outputStart: number, numSamples: number): void
    {
        this.interpreter.flush();
        this.sid.clock(this.buffer, numSamples);

        buffer.set(this.buffer.subarray(0, numSamples), outputStart);

        this.totalSamplesClocked += numSamples;
    }

    // NB: Clocks exactly numSamples into buffer starting at outputStart, but never crosses a
    // pending ADSR-workaround hold-release's scheduled sample (see releaseAtSample, armed by
    // process() below) in a single clockAndWrite() call - splits into as many sub-chunks as needed
    // so each release fires at the exact sample it was armed for, then keeps clocking until the
    // full numSamples requested has been produced. Mirrors sidi-vst's AdsrWorkaroundEngine
    // runEventLoop's mid-range release splicing, but simpler: since events here are already
    // processed one at a time (not pre-sorted into a batch), a release armed moments ago is picked
    // up on the very next chunk without needing to retroactively splice anything.
    private clockRespectingPendingReleases(buffer: Int16Array, outputStart: number, numSamples: number): void
    {
        let clocked = 0;

        while (clocked < numSamples)
        {
            let chunk = numSamples - clocked;

            for (let channel = 0; channel < 3; channel++)
            {
                const releaseAt = this.releaseAtSample[channel];
                if (releaseAt === null)
                    continue;

                const samplesUntilRelease = releaseAt - this.totalSamplesClocked;
                if (samplesUntilRelease < chunk)
                    chunk = Math.max(0, samplesUntilRelease);
            }

            if (chunk > 0)
                this.clockAndWrite(buffer, outputStart + clocked, chunk);

            clocked += chunk;

            for (let channel = 0; channel < 3; channel++)
            {
                if (this.releaseAtSample[channel] === this.totalSamplesClocked)
                {
                    this.interpreter.releaseAdsrHold(channel);
                    this.releaseAtSample[channel] = null;
                }
            }
        }
    }

    process(buffer: Int16Array, size?: number, loop: boolean = false): number
    {
        if(!size)
            size = buffer.length;

        if(size > this.buffer.length)
            this.buffer = new Int16Array(size);

        const track = this.midi.tracks[0];

        if(this.nextEventIndex >= track.events.length)
            return 0;

        let numSamplesWritten = 0;

        while(this.nextEventIndex < track.events.length)
        {
            // NB: Once the buffer is exactly full, stop - don't fall through to processing (and
            // timing-skipping) further events. With loop=false this was masked by nextEventIndex
            // eventually exceeding track.events.length; with loop=true nextEventIndex only ever
            // wraps via modulo, so without this check the loop never terminates.
            if(numSamplesWritten >= size)
                break;

            const event = track.events[this.nextEventIndex];
            const remainingDeltaSamples = this.getNumSamplesFromDelta(event.delta) - this.accumulatedDeltaSamples;
            const remainingBufferSamples = size - numSamplesWritten;

            if(remainingDeltaSamples > 0 && remainingBufferSamples > 0)
            {
                if(remainingDeltaSamples > remainingBufferSamples)
                {
                    this.accumulatedDeltaSamples += remainingBufferSamples;

                    // NB: Write remainingBufferSamples samples to internal buffer, copy remainingBufferSamples samples into external buffer starting from numSamplesWritten
                    this.clockRespectingPendingReleases(buffer, numSamplesWritten, remainingBufferSamples);

                    numSamplesWritten += remainingBufferSamples;

                    // NB: Don't advance to the next event
                    break;
                }
                else
                {
                    this.accumulatedDeltaSamples = 0;

                    this.clockRespectingPendingReleases(buffer, numSamplesWritten, remainingDeltaSamples);

                    numSamplesWritten += remainingDeltaSamples;
                }
            }

            if (event instanceof SetTempoEvent)
                this.bpm = event.bpm;
            else
            {
                this.interpreter.process(event);

                // NB: This note on may have just armed a hold (see MidiInterpreter's ADSR priming
                // logic) - schedule its release exactly holdSamples of real sample-time from now.
                // Always overwrites any previous schedule for this channel, which is correct for a
                // retrigger while a hold is still pending (see MidiInterpreter.processNoteOn) - the
                // old schedule is superseded, not additive.
                if (event instanceof NoteOnEvent && event.channel <= 2 && this.interpreter.hasPendingAdsrRelease(event.channel))
                    this.releaseAtSample[event.channel] = this.totalSamplesClocked + this.holdSamples;
            }

            this.currentEventTotalSamples = null;

            if(loop)
                this.nextEventIndex = (this.nextEventIndex + 1) % track.events.length;
            else
                this.nextEventIndex++;
        }

        return numSamplesWritten;
    }
}
