import { beforeAll, describe, expect, test } from "vitest";
import createSIDModule from "../compiled/libresidfp";
import { NoteOnEvent, NoteOffEvent, Resolution, Event, ControllerEvent } from "@perry-rylance/midi";
import Driver from "../src/Driver";
import { Attack, Decay, Noise, Pulse, PulseWidth, Release, Saw, Sustain, Tri, Gate, Sync, Ring, Test, FilterCutoff, FilterResonance, FilterEnable } from "../src/ContinuousController";

type DriverExposingInterpret = Omit<Driver, 'interpret'> & {
    interpret: (event: Event) => void;
};

function mockSID(sid: any) {
    const writtenRegisters = new Map<number, number>();
    const originalWrite = sid.write.bind(sid);
    const originalRead = sid.read.bind(sid);
    
    // NB: In a real SID chip (and  libresidfp ), the frequency registers are write-only. Reading them returns the last value on the data bus ( busValue ), meaning a sequence of reads back-to-back will return the same last written value. In other words, only the last written value (0x11) would be present on the data bus when running this test.
    sid.write = (offset: number, value: number) => {
        writtenRegisters.set(offset, value);
        originalWrite(offset, value);
    };
    sid.read = (offset: number) => {
        if (writtenRegisters.has(offset)) {
            return writtenRegisters.get(offset)!;
        }
        return originalRead(offset);
    };

    return sid;
}

let module: any;

beforeAll(async () => {
    module = await createSIDModule({});
});

describe.each([0, 1, 2])('with midi channel %i', (channel) => {

    describe('note pitch interpretation', () => {

        test.each([
            [21, [0xD4, 0x01]],
            [60, [0x67, 0x11]],
            [106, [0x10, 0xF8]]
        ])('for midi pitch %i writes expected bytes', (pitch, [ lo, hi ]) => {

            const event = new NoteOnEvent(0, channel);
            event.key = pitch;

            const sid = mockSID(new module.SID());
            const driver = new Driver(sid, new Resolution());

            (driver as unknown as DriverExposingInterpret).interpret(event);

            // TODO: Presently only PAL, test for NTSC too
            const address = channel * 7;

            expect(sid.read(address)).toBe(lo);
            expect(sid.read(address + 1)).toBe(hi);

        });

    });

    describe('pulse width interpretation', () => {

        test.each([
            [0, [0x00, 0x00]],
            [0x3F, [0xEF, 0x07]],
            [0x7F, [0xFF, 0x0F]]
        ])(`for midi cc ${PulseWidth} value %i writes expected bytes`, (width, [ lo, hi ]) => {

            const event = new ControllerEvent(0, channel);
            event.controller = PulseWidth;
            event.value = width;

            const sid = mockSID(new module.SID());
            const driver = new Driver(sid, new Resolution());

            (driver as unknown as DriverExposingInterpret).interpret(event);

            const address = channel * 7 + 2;

            expect(sid.read(address)).toBe(lo);
            expect(sid.read(address + 1)).toBe(hi);

        });

    });

    function testControlRegisterBits(
        suiteName: string,
        bits: Array<{ controller: number; mask: number; name: string }>
    ) {
        describe(suiteName, () => {
            const powerSet: Array<{ name: string; selected: typeof bits }> = [];
            const totalCombinations = 1 << bits.length;

            for (let i = 0; i < totalCombinations; i++) {
                const selected: typeof bits = [];
                const names: string[] = [];
                for (let j = 0; j < bits.length; j++) {
                    if ((i & (1 << j)) !== 0) {
                        selected.push(bits[j]);
                        names.push(bits[j].name);
                    }
                }
                powerSet.push({
                    name: names.length > 0 ? names.join(' + ') : 'none',
                    selected
                });
            }

            test.each(powerSet)(
                'writes expected bits for combination: $name',
                ({ selected }) => {
                    const address = channel * 7 + 4;
                    const sid = mockSID(new module.SID());
                    const driver = new Driver(sid, new Resolution());

                    // Calculate expected bitmask for this combination
                    let expectedMask = 0;
                    for (const b of selected) {
                        expectedMask |= b.mask;
                    }

                    // Send control change events for all controls to simulate transition to this state
                    for (const b of bits) {
                        const isSelected = selected.some(s => s.controller === b.controller);
                        const event = new ControllerEvent(0, channel);
                        event.controller = b.controller;
                        event.value = isSelected ? 127 : 0;
                        (driver as unknown as DriverExposingInterpret).interpret(event);
                    }

                    expect(sid.read(address)).toBe(expectedMask);
                }
            );
        });
    }

    testControlRegisterBits('waveform interpretation', [
        { controller: Tri, mask: 0x10, name: 'tri' },
        { controller: Saw, mask: 0x20, name: 'saw' },
        { controller: Pulse, mask: 0x40, name: 'pulse' },
        { controller: Noise, mask: 0x80, name: 'noise' }
    ]);

    testControlRegisterBits('control interpretation', [
        { controller: Gate, mask: 0x01, name: 'gate' },
        { controller: Sync, mask: 0x02, name: 'sync' },
        { controller: Ring, mask: 0x04, name: 'ring' },
        { controller: Test, mask: 0x08, name: 'test' }
    ]);

    describe('adsr envelope interpretation', () => {

        test.each([
            { controller: Attack, name: 'attack', offset: 5, shift: 4 },
            { controller: Decay, name: 'decay', offset: 5, shift: 0 },
            { controller: Sustain, name: 'sustain', offset: 6, shift: 4 },
            { controller: Release, name: 'release', offset: 6, shift: 0 }
        ])('$name (cc $controller) writes expected 4-bit value to register', ({ controller, offset, shift }) => {

            const testValues = [
                { ccValue: 0, expectedNibble: 0x0 },
                { ccValue: 64, expectedNibble: 0x8 },
                { ccValue: 127, expectedNibble: 0xF }
            ];

            for (const { ccValue, expectedNibble } of testValues) {
                const event = new ControllerEvent(0, channel);
                event.controller = controller;
                event.value = ccValue;

                const sid = mockSID(new module.SID());
                const driver = new Driver(sid, new Resolution());

                (driver as unknown as DriverExposingInterpret).interpret(event);

                const address = channel * 7 + offset;
                const regVal = sid.read(address);
                const nibble = (regVal >> shift) & 0x0F;

                expect(nibble).toBe(expectedNibble);
            }

        });

    });

    describe('note control interpretation', () => {

        test('interpreting a note on turns the GATE bit ON', () => {
            const sid = mockSID(new module.SID());
            const driver = new Driver(sid, new Resolution());

            const noteOn = new NoteOnEvent(0, channel);
            noteOn.key = 60;

            (driver as unknown as DriverExposingInterpret).interpret(noteOn);

            const address = channel * 7 + 4;
            expect(sid.read(address) & 0x01).toBe(0x01);
        });

        test('interpreting a note on followed by a note off on the same pitch turns the GATE bit OFF', () => {
            const sid = mockSID(new module.SID());
            const driver = new Driver(sid, new Resolution());

            const noteOn = new NoteOnEvent(0, channel);
            noteOn.key = 60;
            (driver as unknown as DriverExposingInterpret).interpret(noteOn);

            const noteOff = new NoteOffEvent(0, channel);
            noteOff.key = 60;
            (driver as unknown as DriverExposingInterpret).interpret(noteOff);

            const address = channel * 7 + 4;
            expect(sid.read(address) & 0x01).toBe(0x00);
        });

        test('interpreting a note on, followed by a note on on a different key, followed by a note off on the original key, keeps the GATE bit ON', () => {
            const sid = mockSID(new module.SID());
            const driver = new Driver(sid, new Resolution());

            // Press Note A
            const noteOnA = new NoteOnEvent(0, channel);
            noteOnA.key = 60;
            (driver as unknown as DriverExposingInterpret).interpret(noteOnA);

            // Press Note B (making B the last pressed note)
            const noteOnB = new NoteOnEvent(0, channel);
            noteOnB.key = 64;
            (driver as unknown as DriverExposingInterpret).interpret(noteOnB);

            // Release Note A (not the last pressed note)
            const noteOffA = new NoteOffEvent(0, channel);
            noteOffA.key = 60;
            (driver as unknown as DriverExposingInterpret).interpret(noteOffA);

            const address = channel * 7 + 4;
            expect(sid.read(address) & 0x01).toBe(0x01); // Gate should still be ON
        });

        test('interpreting a note on, followed by a note on on a different key, followed by a note off on the original key, and then a note off on the last note on key, sets the GATE bit OFF', () => {
            const sid = mockSID(new module.SID());
            const driver = new Driver(sid, new Resolution());

            // Press Note A
            const noteOnA = new NoteOnEvent(0, channel);
            noteOnA.key = 60;
            (driver as unknown as DriverExposingInterpret).interpret(noteOnA);

            // Press Note B (making B the last pressed note)
            const noteOnB = new NoteOnEvent(0, channel);
            noteOnB.key = 64;
            (driver as unknown as DriverExposingInterpret).interpret(noteOnB);

            // Release Note A (not the last pressed note)
            const noteOffA = new NoteOffEvent(0, channel);
            noteOffA.key = 60;
            (driver as unknown as DriverExposingInterpret).interpret(noteOffA);

            const address = channel * 7 + 4;
            expect(sid.read(address) & 0x01).toBe(0x01); // Gate should still be ON

            // Release Note B (the last pressed note)
            const noteOffB = new NoteOffEvent(0, channel);
            noteOffB.key = 64;
            (driver as unknown as DriverExposingInterpret).interpret(noteOffB);

            expect(sid.read(address) & 0x01).toBe(0x00); // Gate should now be OFF
        });

    });

    describe('filter interpretation', () => {

        test.each([
            [0, [0x00, 0x00]],
            [63, [0x07, 0x7E]],
            [127, [0x07, 0xFF]]
        ])(`for midi cc ${FilterCutoff} value %i writes expected bytes`, (value, [ lo, hi ]) => {

            const event = new ControllerEvent(0, channel);
            event.controller = FilterCutoff;
            event.value = value;

            const sid = mockSID(new module.SID());
            const driver = new Driver(sid, new Resolution());

            (driver as unknown as DriverExposingInterpret).interpret(event);

            expect(sid.read(0x15)).toBe(lo);
            expect(sid.read(0x16)).toBe(hi);

        });

        test.each([
            [0, 0x0],
            [64, 0x8],
            [127, 0xF]
        ])(`for midi cc ${FilterResonance} value %i writes expected 4-bit value`, (value, expectedNibble) => {

            const event = new ControllerEvent(0, channel);
            event.controller = FilterResonance;
            event.value = value;

            const sid = mockSID(new module.SID());
            const driver = new Driver(sid, new Resolution());

            (driver as unknown as DriverExposingInterpret).interpret(event);

            const regVal = sid.read(0x17);
            const nibble = (regVal >> 4) & 0x0F;

            expect(nibble).toBe(expectedNibble);

        });

        test('interpreting a FilterEnable cc with value 127 enables the filter for the current channel, and value 0 disables it', () => {

            const sid = mockSID(new module.SID());
            const driver = new Driver(sid, new Resolution());
            const address = 0x17;

            // Turn ON
            const enableEvent = new ControllerEvent(0, channel);
            enableEvent.controller = FilterEnable;
            enableEvent.value = 127;

            (driver as unknown as DriverExposingInterpret).interpret(enableEvent);

            const expectedBit = 1 << channel;
            expect(sid.read(address) & expectedBit).toBe(expectedBit);

            // Turn OFF
            const disableEvent = new ControllerEvent(0, channel);
            disableEvent.controller = FilterEnable;
            disableEvent.value = 0;

            (driver as unknown as DriverExposingInterpret).interpret(disableEvent);

            expect(sid.read(address) & expectedBit).toBe(0x00);

        });

        test('filter controls preserve other bits in register $17', () => {

            const sid = mockSID(new module.SID());
            const driver = new Driver(sid, new Resolution());
            const address = 0x17;

            // 1. Send resonance event (set to max, value 127 which scales to 0xF)
            const resEvent = new ControllerEvent(0, channel);
            resEvent.controller = FilterResonance;
            resEvent.value = 127;
            (driver as unknown as DriverExposingInterpret).interpret(resEvent);

            // Verify resonance is 0xF0, and routing bits are still 0
            expect(sid.read(address)).toBe(0xF0);

            // 2. Enable filter routing for current channel
            const enableEvent = new ControllerEvent(0, channel);
            enableEvent.controller = FilterEnable;
            enableEvent.value = 127;
            (driver as unknown as DriverExposingInterpret).interpret(enableEvent);

            // Verify resonance bits are preserved, and routing bit is added
            const expectedBit = 1 << channel;
            expect(sid.read(address)).toBe(0xF0 | expectedBit);

            // 3. Disable filter routing
            const disableEvent = new ControllerEvent(0, channel);
            disableEvent.controller = FilterEnable;
            disableEvent.value = 0;
            (driver as unknown as DriverExposingInterpret).interpret(disableEvent);

            // Verify resonance is still preserved, routing bit is removed
            expect(sid.read(address)).toBe(0xF0);

        });

    });

    // describe('volume interpretation', () => {

    // });

});
