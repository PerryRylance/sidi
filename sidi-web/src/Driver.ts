import { Resolution, Track, Event, ControlEvent, SetTempoEvent, MetaEvent, NoteOnEvent } from "@perry-rylance/midi";
import { SID } from "../compiled/libresidfp";
import { Pal } from "./ClockFrequencyHz";

export default class Driver
{
    private bpm: number = 120;
    private pcmFrequencyHz: number = 44100;

    constructor(private sid: SID, private resolution: Resolution, private clockFrequencyHz: number = Pal)
    {
        this.sid.setSamplingParameters(this.clockFrequencyHz, 0, this.pcmFrequencyHz);
    }

    private getNumCyclesFromDelta(delta: number): number
    {
        return Math.round((delta * 60 * this.clockFrequencyHz) / (this.bpm * this.resolution.ticksPerQuarterNote));
    }

    private interpret(event: Event): void
    {
        if(event instanceof SetTempoEvent)
            this.bpm = event.bpm;
        else if(event instanceof NoteOnEvent)
        {
            const frequencyHz = 440 * Math.pow(2, (event.key - 69) / 12);
            const regValue = Math.round((frequencyHz * 16777216) / this.clockFrequencyHz);
            const clamped = Math.max(0, Math.min(65535, regValue));
            
            const offset = event.channel * 7;
            const lo = clamped & 0xFF;
            const hi = (clamped >> 8) & 0xFF;
            
            this.sid.write(offset + 0, lo);
            this.sid.write(offset + 1, hi);
        }
    }

    process(track: Track, buffer: Int16Array): number
    {
        let numSamplesWritten = 0;

        track.events.forEach((event) => {

            // TODO: Handle large deltas (eg that would overflow buffer)
            // TODO: Suggest not using cycles but instead passing in the buffer size when using worklets, this won't allow clock to include the fractional phase steps
            const cycles = this.getNumCyclesFromDelta(event.delta);
            const samples = this.sid.clock(cycles, buffer);
            numSamplesWritten += samples;

            this.interpret(event);

        });

        return numSamplesWritten;
    }
}
