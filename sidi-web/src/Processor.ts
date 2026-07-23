import { File, SetTempoEvent } from "@perry-rylance/midi";
import { Pal } from "./ClockFrequencyHz";
import MidiInterpreter from "./MidiInterpreter";
import SidChipAdapter from "./SidChipAdapter";
import assertSingleTrack from "./assertions/assertSingleTrack";

export default class Processor
{
    private bpm: number = 120;
    private buffer: Int16Array = new Int16Array();
    private interpreter: MidiInterpreter;
    private nextEventIndex: number = 0;
    private accumulatedDeltaSamples: number = 0;

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
        assertSingleTrack(midi);

        this.interpreter = new MidiInterpreter(
            this.sid,
            this.clockFrequencyHz,
            SidChipAdapter.DEFAULT_CONTROL_REGISTER,
            SidChipAdapter.DEFAULT_SUSTAIN_RELEASE,
        );
    }

    private getNumSamplesFromDelta(delta: number): number
    {
        const totalBeats = delta / this.midi.resolution.ticksPerQuarterNote;
        const secondsPerBeat = 60 / this.bpm;
        const deltaInSeconds = totalBeats * secondsPerBeat;

        return Math.round(deltaInSeconds * this.sampleRate);
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
                    this.sid.clock(this.buffer, remainingBufferSamples);

                    buffer.set(this.buffer.subarray(0, remainingBufferSamples), numSamplesWritten);

                    numSamplesWritten += remainingBufferSamples;

                    // NB: Don't advance to the next event
                    break;
                }
                else
                {
                    this.accumulatedDeltaSamples = 0;

                    this.sid.clock(this.buffer, remainingDeltaSamples);

                    buffer.set(this.buffer.subarray(0, remainingDeltaSamples), numSamplesWritten);

                    numSamplesWritten += remainingDeltaSamples;
                }
            }

            if (event instanceof SetTempoEvent)
                this.bpm = event.bpm;
            else
                this.interpreter.process(event);

            if(loop)
                this.nextEventIndex = (this.nextEventIndex + 1) % track.events.length;
            else
                this.nextEventIndex++;
        }

        return numSamplesWritten;
    }
}
