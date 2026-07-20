import { SID, ChipModel, CombinedWaveforms, SamplingMethod } from "../compiled/libresidfp";

/**
 * NB: Mirrors sidi-vst's SidChipAdapter.cpp - the SID class is an
 * Emscripten/embind binding whose constructor rejects being invoked via
 * `super()` from a subclass ("Use 'new' to construct SID"), so real
 * inheritance isn't possible here either. This wraps an existing SID
 * instance, forwarding every call, and writes the same sensible power-on
 * defaults the C++ adapter writes (the real chip's registers otherwise
 * start zeroed, which leaves the master volume nibble in $18 muted until
 * something explicitly sends a Main Volume CC).
 */
export default class SidChipAdapter implements SID
{
    constructor(private sid: SID)
    {
        // NB: Zero everything first
        for (let i = 0; i < 18; i++)
            this.write(i, 0);

        for (let i = 0; i < 3; i++)
        {
            this.write((0x7 * i) + 0x4, 0x20); // NB: Default saw waveform
            this.write((0x7 * i) + 0x6, 0xf0); // NB: Full sustain, no release
        }

        // NB: Full volume
        this.write(0x18, 0xf);
    }

    setChipModel(model: ChipModel): void
    {
        this.sid.setChipModel(model);
    }

    getChipModel(): ChipModel
    {
        return this.sid.getChipModel();
    }

    setCombinedWaveforms(cws: CombinedWaveforms): void
    {
        this.sid.setCombinedWaveforms(cws);
    }

    reset(): void
    {
        this.sid.reset();
    }

    input(value: number): void
    {
        this.sid.input(value);
    }

    read(offset: number): number
    {
        return this.sid.read(offset);
    }

    write(offset: number, value: number): void
    {
        this.sid.write(offset, value);
    }

    setSamplingParameters(clockFrequency: number, method: SamplingMethod, samplingFrequency: number): void
    {
        this.sid.setSamplingParameters(clockFrequency, method, samplingFrequency);
    }

    clock(cycles: number, buf: Int16Array | number): number;
    clock(buf: Int16Array | number, bufSize: number): number;
    clock(a: number | Int16Array, b: Int16Array | number): number
    {
        return this.sid.clock(a as any, b as any);
    }

    clockSilent(cycles: number): void
    {
        this.sid.clockSilent(cycles);
    }

    setFilter6581Curve(filterCurve: number): void
    {
        this.sid.setFilter6581Curve(filterCurve);
    }

    setFilter6581Range(adjustment: number): void
    {
        this.sid.setFilter6581Range(adjustment);
    }

    setFilter8580Curve(filterCurve: number): void
    {
        this.sid.setFilter8580Curve(filterCurve);
    }

    enableFilter(enable: boolean): void
    {
        this.sid.enableFilter(enable);
    }

    enableOld6581caps(enable: boolean): void
    {
        this.sid.enableOld6581caps(enable);
    }

    delete(): void
    {
        this.sid.delete();
    }
}
