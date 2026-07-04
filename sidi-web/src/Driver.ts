import { Resolution, Track } from "@perry-rylance/midi";
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
    }

    /*private getNumSamplesFromDelta(delta: number, bpm: number)
    {

    }*/

    private getNumCyclesFromDelta(delta: number): number
    {
        return Math.round((delta * 60 * this.clockFrequencyHz) / (this.bpm * this.resolution.ticksPerQuarterNote));
    }

    process(track: Track, buffer: Int16Array): number
    {
        let numSamplesWritten = 0;

        track.events.forEach((event) => {

            // TODO: Handle large deltas (eg that would overflow buffer)
            const cycles = this.getNumCyclesFromDelta(event.delta);

            numSamplesWritten += this.sid.clock(cycles, buffer);

        });

        return numSamplesWritten;
    }
}
