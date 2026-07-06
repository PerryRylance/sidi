import { Resolution, Track, Event, ControlEvent, SetTempoEvent, MetaEvent, NoteOnEvent, NoteOffEvent, ControllerEvent, SysExEvent } from "@perry-rylance/midi";
import { SID } from "../compiled/libresidfp";
import { Pal } from "./ClockFrequencyHz";
import { Attack, Decay, PulseWidth, Release, Sustain, Tri, Saw, Pulse, Noise, Gate, Sync, Ring, Test, FilterCutoff, FilterResonance, FilterEnable } from "./ContinuousController";

export default class Driver
{
    private bpm: number = 120;
    private pcmFrequencyHz: number = 44100;
    private attackDecay: Uint8Array = new Uint8Array(3);
    private sustainRelease: Uint8Array = new Uint8Array(3);
    private controlRegister: Uint8Array = new Uint8Array(3);
    private lastPressedKey: Array<number | null> = [null, null, null];
    private filterResonanceSelect: number = 0;

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

        this.lastPressedKey[event.channel] = event.key;
        this.controlRegister[event.channel] |= 0x01;
        this.sid.write(offset + 4, this.controlRegister[event.channel]);
    }

    private interpretNoteOff(event: NoteOffEvent): void
    {
        if (this.lastPressedKey[event.channel] === event.key)
        {
            const offset = event.channel * 7;
            this.controlRegister[event.channel] &= ~0x01;
            this.sid.write(offset + 4, this.controlRegister[event.channel]);
            this.lastPressedKey[event.channel] = null;
        }
    }

    private interpretController(event: ControllerEvent): void
    {
        switch(event.controller as number)
        {
            case FilterCutoff: {
                const mapped = this.getExtrapolatedBitValue(event.value, 7, 11);
                const lo = mapped & 0x07;
                const hi = (mapped >> 3) & 0xFF;

                this.sid.write(0x15, lo);
                this.sid.write(0x16, hi);
                break;
            }

            case FilterResonance: {
                const mapped = this.getExtrapolatedBitValue(event.value, 7, 4);
                this.filterResonanceSelect = (this.filterResonanceSelect & 0x0F) | (mapped << 4);
                this.sid.write(0x17, this.filterResonanceSelect);
                break;
            }

            case FilterEnable: {
                const on = event.value >= 64;
                const mask = 1 << event.channel;
                this.filterResonanceSelect = on 
                    ? (this.filterResonanceSelect | mask) 
                    : (this.filterResonanceSelect & ~mask);
                this.sid.write(0x17, this.filterResonanceSelect);
                break;
            }

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
                const config: Record<number, { array: Uint8Array, shift: number, mask: number, regOffset: number }> = {
                    [Attack]:  { array: this.attackDecay,       shift: 4, mask: 0x0F, regOffset: 5 },
                    [Decay]:   { array: this.attackDecay,       shift: 0, mask: 0xF0, regOffset: 5 },
                    [Sustain]: { array: this.sustainRelease,    shift: 4, mask: 0x0F, regOffset: 6 },
                    [Release]: { array: this.sustainRelease,    shift: 0, mask: 0xF0, regOffset: 6 },
                };

                const { array, shift, mask, regOffset } = config[event.controller];
                const address = event.channel * 7 + regOffset;
                const currentVal = array[event.channel];
                const newVal = (currentVal & mask) | (mapped << shift);
                
                array[event.channel] = newVal;
                this.sid.write(address, newVal);
                break;
            }
            case Tri:
            case Saw:
            case Pulse:
            case Noise:
            case Gate:
            case Sync:
            case Ring:
            case Test: {
                const on = event.value >= 64;
                const maskMap: Record<number, number> = {
                    [Gate]:  0x01,
                    [Sync]:  0x02,
                    [Ring]:  0x04,
                    [Test]:  0x08,
                    [Tri]:   0x10,
                    [Saw]:   0x20,
                    [Pulse]: 0x40,
                    [Noise]: 0x80,
                };
                const mask = maskMap[event.controller];
                const address = event.channel * 7 + 4;
                const currentVal = this.controlRegister[event.channel];
                const newVal = on ? (currentVal | mask) : (currentVal & ~mask);

                this.controlRegister[event.channel] = newVal;
                this.sid.write(address, newVal);
                break;
            }
        }
    }

    private interpret(event: Event): void
    {
        if(event instanceof ControllerEvent)
            return this.interpretController(event);
        
        if(event instanceof NoteOnEvent)
            return this.interpretNoteOn(event);
        
        if(event instanceof NoteOffEvent)
            return this.interpretNoteOff(event);

        if(event instanceof SetTempoEvent)
            return this.interpretSetTempo(event);
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
