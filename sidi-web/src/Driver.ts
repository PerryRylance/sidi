import { Resolution, Track, Event, ControlEvent, SetTempoEvent, MetaEvent, NoteOnEvent, ControllerEvent } from "@perry-rylance/midi";
import { SID } from "../compiled/libresidfp";
import { Pal } from "./ClockFrequencyHz";
import { Attack, Decay, PulseWidth, Release, Sustain } from "./ContinuousController";

export default class Driver
{
    private bpm: number = 120;
    private pcmFrequencyHz: number = 44100;
    private attackDecay: Uint8Array = new Uint8Array(16);
    private sustainRelease: Uint8Array = new Uint8Array(16);

    constructor(private sid: SID, private resolution: Resolution, private clockFrequencyHz: number = Pal)
    {
        this.sid.setSamplingParameters(this.clockFrequencyHz, 0, this.pcmFrequencyHz);
    }

    private getNumCyclesFromDelta(delta: number): number
    {
        return Math.round((delta * 60 * this.clockFrequencyHz) / (this.bpm * this.resolution.ticksPerQuarterNote));
    }

    private getExtrapolatedBitValue(value: number, inBits: number, outBits: number)
    {
        const maxIn = (1 << inBits) - 1;
        const maxOut = (1 << outBits) - 1;
        
        if (maxIn <= 0) return 0;
        
        return Math.round((value / maxIn) * maxOut);
    }

    private interpretSetTempo(event: SetTempoEvent): void
    {
        this.bpm = event.bpm;
    }

    private interpretNoteOn(event: NoteOnEvent): void
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

    private interpretController(event: ControllerEvent): void
    {
        switch(event.controller)
        {
            case PulseWidth:
                // NB: Pulse width modulation
                const mapped = this.getExtrapolatedBitValue(event.value, 7, 12);
                const offset = event.channel * 7 + 2;
                const lo = mapped & 0xFF;
                const hi = (mapped >> 8) & 0xFF;

                this.sid.write(offset + 0, lo);
                this.sid.write(offset + 1, hi);

                break;
            
            case Attack:
            case Decay:
            case Sustain:
            case Release: {
                const mapped = this.getExtrapolatedBitValue(event.value, 7, 4);
                const regOffset = (event.controller === Attack || event.controller === Decay) ? 5 : 6;
                const address = event.channel * 7 + regOffset;
                
                if (regOffset === 5) {
                    const currentVal = this.attackDecay[event.channel];
                    const newVal = (event.controller === Attack)
                        ? (currentVal & 0x0F) | (mapped << 4)
                        : (currentVal & 0xF0) | (mapped & 0x0F);
                    
                    this.attackDecay[event.channel] = newVal;
                    this.sid.write(address, newVal);
                } else {
                    const currentVal = this.sustainRelease[event.channel];
                    const newVal = (event.controller === Sustain)
                        ? (currentVal & 0x0F) | (mapped << 4)
                        : (currentVal & 0xF0) | (mapped & 0x0F);
                    
                    this.sustainRelease[event.channel] = newVal;
                    this.sid.write(address, newVal);
                }
                break;
            }
        }
    }

    private interpret(event: Event): void
    {
        if(event instanceof SetTempoEvent)
            return this.interpretSetTempo(event)
        
        if(event instanceof NoteOnEvent)
            return this.interpretNoteOn(event);
        
        if(event instanceof ControllerEvent)
            return this.interpretController(event);
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
