import { Event, ControlEvent, MetaEvent, NoteOnEvent, NoteOffEvent, ControllerEvent, SysExEvent, PitchWheelEvent } from "@perry-rylance/midi";
import { SID } from "../compiled/libresidfp";
import { Pal } from "./ClockFrequencyHz";
import ContinuousController from "./ContinuousController";

const { Attack, Decay, PulseWidth, Release, Sustain, Tri, Saw, Pulse, Noise, Gate, Sync, Ring, Test, FilterCutoff, FilterResonance, FilterEnable, FilterLowPass, FilterBandPass, FilterHighPass, Oscillator3Mute, MainVolume } = ContinuousController;

export default class MidiInterpreter
{
    private pcmFrequencyHz: number = 44100;
    private attackDecay: Uint8Array = new Uint8Array(3);
    private sustainRelease: Uint8Array = new Uint8Array(3);
    private controlRegister: Uint8Array = new Uint8Array(3);
    private lastPressedKey: Array<number | null> = [null, null, null];
    private filterResonanceSelect: number = 0;
    private filterModeVolumeSelect: number = 0;

    private rpnMsb: Uint8Array = new Uint8Array([127, 127, 127]);
    private rpnLsb: Uint8Array = new Uint8Array([127, 127, 127]);
    private maxBendSemitones: Uint8Array = new Uint8Array([2, 2, 2]);
    private pitchBendAmount: Float32Array = new Float32Array(3);

    constructor(
        private sid: SID,
        private clockFrequencyHz: number = Pal,
        initialControlRegister: number = 0,
        initialSustainRelease: number = 0,
    )
    {
        this.sid.setSamplingParameters(this.clockFrequencyHz, 0, this.pcmFrequencyHz);

        // NB: Seed our shadow copies from explicit values rather than the chip itself - write-only
        // SID registers share a single external data bus, so reading one back after some other,
        // later register write (eg. SidChipAdapter's main volume write) returns that later write's
        // value, not what's actually at the address being read. Callers wrapping an adapter that
        // applies its own power-on defaults (eg. SidChipAdapter) should pass those values in here.
        for (let channel = 0; channel < 3; channel++)
        {
            this.controlRegister[channel] = initialControlRegister;
            this.sustainRelease[channel] = initialSustainRelease;
        }
    }

    private getExtrapolatedBitValue(value: number, inBits: number, outBits: number)
    {
        const maxIn = (1 << inBits) - 1;
        const maxOut = (1 << outBits) - 1;

        if (maxIn <= 0) return 0;

        return Math.round((value / maxIn) * maxOut);
    }

    private updateFrequency(channel: number): void
    {
        const key = this.lastPressedKey[channel];
        if (key === null) return;

        const bendAmount = this.pitchBendAmount[channel];
        const bendRange = this.maxBendSemitones[channel];
        const bentKey = key + (bendAmount * bendRange);

        const frequencyHz = 440 * Math.pow(2, (bentKey - 69) / 12);
        const regValue = Math.round((frequencyHz * 16777216) / this.clockFrequencyHz);
        const clamped = Math.max(0, Math.min(65535, regValue));

        const offset = channel * 7;
        const lo = clamped & 0xFF;
        const hi = (clamped >> 8) & 0xFF;

        this.sid.write(offset + 0, lo);
        this.sid.write(offset + 1, hi);
    }

    private processNoteOn(event: NoteOnEvent): void
    {
        this.lastPressedKey[event.channel] = event.key;
        this.updateFrequency(event.channel);

        const offset = event.channel * 7;

        // NB: The envelope generator only (re)starts on a 0->1 GATE transition (see
        // reSIDfp's EnvelopeGenerator::writeCONTROL_REG). When several percussive hits
        // share one voice - the classic C64 trick of keeping one oscillator free for
        // drums - a new hit can arrive before the previous one's note off, leaving GATE
        // already high; writing 1 again would be a no-op at the chip level and the hit
        // would silently fail to retrigger. Forcing GATE low first guarantees a real
        // edge every time, regardless of what the incoming note on/off pairing did.
        if (this.controlRegister[event.channel] & 0x01)
            this.sid.write(offset + 4, this.controlRegister[event.channel] & ~0x01);

        this.controlRegister[event.channel] |= 0x01;
        this.sid.write(offset + 4, this.controlRegister[event.channel]);
    }

    private processPitchWheel(event: PitchWheelEvent): void
    {
        this.pitchBendAmount[event.channel] = event.amount;
        this.updateFrequency(event.channel);
    }

    private processNoteOff(event: NoteOffEvent): void
    {
        if (this.lastPressedKey[event.channel] === event.key)
        {
            const offset = event.channel * 7;
            this.controlRegister[event.channel] &= ~0x01;
            this.sid.write(offset + 4, this.controlRegister[event.channel]);
            this.lastPressedKey[event.channel] = null;
        }
    }

    private processController(event: ControllerEvent): void
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

            case FilterLowPass:
            case FilterBandPass:
            case FilterHighPass:
            case Oscillator3Mute: {
                const on = event.value >= 64;
                const maskMap: Record<number, number> = {
                    [FilterLowPass]:  0x10,
                    [FilterBandPass]: 0x20,
                    [FilterHighPass]: 0x40,
                    [Oscillator3Mute]: 0x80,
                };
                const mask = maskMap[event.controller];
                this.filterModeVolumeSelect = on
                    ? (this.filterModeVolumeSelect | mask)
                    : (this.filterModeVolumeSelect & ~mask);
                this.sid.write(0x18, this.filterModeVolumeSelect);
                break;
            }

            case MainVolume: {
                const mapped = this.getExtrapolatedBitValue(event.value, 7, 4);
                this.filterModeVolumeSelect = (this.filterModeVolumeSelect & 0xF0) | mapped;
                this.sid.write(0x18, this.filterModeVolumeSelect);
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
            case 101: // RPN MSB Selection
                this.rpnMsb[event.channel] = event.value;
                break;

            case 100: // RPN LSB Selection
                this.rpnLsb[event.channel] = event.value;
                break;

            case 6: // Data Entry MSB (Sets the value of the selected RPN)
                if (this.rpnMsb[event.channel] === 0 && this.rpnLsb[event.channel] === 0) {
                    this.maxBendSemitones[event.channel] = event.value;
                }
                break;
        }
    }

    // NB: Public dispatcher mirrors sidi-vst's MidiInterpreter::process(const juce::MidiMessage&).
    process(event: Event): void
    {
        if(event instanceof ControllerEvent)
            return this.processController(event);

        if(event instanceof NoteOnEvent)
            return this.processNoteOn(event);

        if(event instanceof NoteOffEvent)
            return this.processNoteOff(event);

        if(event instanceof PitchWheelEvent)
            return this.processPitchWheel(event);
    }
}
