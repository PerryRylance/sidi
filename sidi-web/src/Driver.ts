import { Resolution, Track, Event, ControlEvent, SetTempoEvent, MetaEvent } from "@perry-rylance/midi";
import { SID, SIDModule } from "../compiled/libresidfp";
import { Pal } from "./ClockFrequencyHz";

export default class Driver
{
    private sid: SID;
    private bpm: number = 120;
    private pcmFrequencyHz: number = 44100;

    constructor(private module: SIDModule, private resolution: Resolution, private clockFrequencyHz: number = Pal)
    {
        this.sid = new module.SID;
        this.sid.setSamplingParameters(this.clockFrequencyHz, module.SamplingMethod.DECIMATE, this.pcmFrequencyHz);
    }

    private getNumCyclesFromDelta(delta: number): number
    {
        return Math.round((delta * 60 * this.clockFrequencyHz) / (this.bpm * this.resolution.ticksPerQuarterNote));
    }

    interpret(event: Event): void
    {
        if(event instanceof SetTempoEvent)
            this.bpm = event.bpm;
    }

    process(track: Track, buffer: Int16Array): number
    {
        let numSamplesWritten = 0;

        track.events.forEach((event) => {

            // TODO: Handle large deltas (eg that would overflow buffer)
            const cycles = this.getNumCyclesFromDelta(event.delta);
            const samples = this.sid.clock(cycles, buffer);
            numSamplesWritten += samples;

            this.interpret(event);

        });

        return numSamplesWritten;
    }
}
