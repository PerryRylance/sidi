import { Track, Resolution, SetTempoEvent } from "@perry-rylance/midi";
import { SID } from "../compiled/libresidfp";
import { Pal } from "./ClockFrequencyHz";
import MidiInterpreter from "./MidiInterpreter";

export default class Processor
{
    private bpm: number = 120;

    constructor(
        private midiInterpreter: MidiInterpreter,
        private sid: SID,
        private resolution: Resolution,
        private clockFrequencyHz: number = Pal
    )
    {
    }

    private getNumCyclesFromDelta(delta: number): number
    {
        return Math.round((delta * 60 * this.clockFrequencyHz) / (this.bpm * this.resolution.ticksPerQuarterNote));
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

            if (event instanceof SetTempoEvent)
                this.bpm = event.bpm;
            else
                this.midiInterpreter.process(event);

        });

        return numSamplesWritten;
    }
}
