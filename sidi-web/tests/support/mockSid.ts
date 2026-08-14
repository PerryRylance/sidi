// NB: Wraps a real libresidfp SID instance (not a fake) so register-mapping tests exercise the
// actual chip emulation, while still letting assertions read back write-only registers and inspect
// intermediate writes a final-value-only read can't distinguish (eg. a forced GATE off/on pulse).
export default function mockSID(sid: any) {
    const writtenRegisters = new Map<number, number>();
    const originalWrite = sid.write.bind(sid);
    const originalRead = sid.read.bind(sid);

    // NB: In a real SID chip (and  libresidfp ), the frequency registers are write-only. Reading them returns the last value on the data bus ( busValue ), meaning a sequence of reads back-to-back will return the same last written value. In other words, only the last written value (0x11) would be present on the data bus when running this test.
    sid.write = (offset: number, value: number) => {
        writtenRegisters.set(offset, value);
        sid.writeLog.push({ offset, value });
        originalWrite(offset, value);
    };
    sid.read = (offset: number) => {
        if (writtenRegisters.has(offset)) {
            return writtenRegisters.get(offset)!;
        }
        return originalRead(offset);
    };

    // NB: Unlike writtenRegisters above, this isn't collapsed down to the latest value per
    // address - it's needed to assert on intermediate writes (eg. a forced GATE off/on pulse)
    // that a final-value-only read can't distinguish from a single write.
    sid.writeLog = [] as Array<{ offset: number, value: number }>;

    return sid;
}
