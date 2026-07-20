import { SID, ChipModel, CombinedWaveforms, SamplingMethod } from "../compiled/libresidfp";

/**
 * NB: The SID class is an Emscripten/embind binding — its constructor rejects
 * being invoked via `super()` from a subclass ("Use 'new' to construct SID"),
 * so real inheritance isn't possible. This wraps an existing SID instance
 * instead, forwarding every call and logging address/value pairs passed to write().
 */
export default class LoggingSID implements SID
{
    constructor(private sid: SID)
    {
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
        console.log(`SID write: address=0x${offset.toString(16).padStart(2, "0")}, value=0x${value.toString(16).padStart(2, "0")}`);

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
