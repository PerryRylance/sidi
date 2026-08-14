// NB: Pure in-memory test double for the ADSR-workaround scheduling tests - no libresidfp/WASM
// dependency, no DSP, so assertions can pin down exactly which sample offsets Processor clocked
// the chip across, and in what order, without a real chip's audio muddying the comparison. Mirrors
// sidi-vst's Tests/Support/FakeSidChip.h. Loosely typed (not `implements SID`) to match this
// codebase's existing chip test-double convention (see mockSid.ts's `sid: any`).
export default class FakeSid {
    registers = new Map<number, number>();
    writeLog: Array<{ offset: number, value: number }> = [];
    clockLog: number[] = [];

    // NB: Fills buf with a monotonically increasing counter (unique across the whole test, not
    // just this call) instead of silence/zero, so tests could tell exactly which clock() call
    // produced which sample purely by its value, without needing any DSP - mirrors FakeSidChip.h.
    private nextSampleValue = 0;

    write(offset: number, value: number): void {
        this.registers.set(offset, value);
        this.writeLog.push({ offset, value });
    }

    read(offset: number): number {
        return this.registers.get(offset) ?? 0;
    }

    setSamplingParameters(): void {}
    setChipModel(): void {}
    getChipModel(): number { return 0; }
    setCombinedWaveforms(): void {}
    reset(): void {}
    input(): void {}

    // NB: Only the (buf: Int16Array, bufSize: number) overload is ever used by SidChipAdapter/
    // Processor in this codebase - see Processor.ts's this.sid.clock(this.buffer, numSamples) calls.
    clock(buf: Int16Array | number, bufSize: number): number {
        const buffer = buf as Int16Array;

        this.clockLog.push(bufSize);

        for (let i = 0; i < bufSize; i++)
            buffer[i] = this.nextSampleValue++;

        return bufSize;
    }

    clockSilent(): void {}
    setFilter6581Curve(): void {}
    setFilter6581Range(): void {}
    setFilter8580Curve(): void {}
    enableFilter(): void {}
    enableOld6581caps(): void {}
    delete(): void {}
}
