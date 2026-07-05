import { beforeAll, describe, expect, test } from "vitest";
import createSIDModule from "../compiled/libresidfp";
import { NoteOnEvent, Resolution, Event, ControllerEvent } from "@perry-rylance/midi";
import Driver from "../src/Driver";
import { Attack, Decay, Noise, Pulse, PulseWidth, Release, Saw, Sustain, Tri } from "../src/ContinuousController";

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

    describe('waveform interpretation', () => {

        const waveforms = [
            { controller: Tri, mask: 0x10, name: 'tri' },
            { controller: Saw, mask: 0x20, name: 'saw' },
            { controller: Pulse, mask: 0x40, name: 'pulse' },
            { controller: Noise, mask: 0x80, name: 'noise' }
        ];

        // Generate the power set (all 16 combinations) of active waveforms dynamically
        const powerSet: Array<{ name: string; selected: typeof waveforms }> = [];
        const totalCombinations = 1 << waveforms.length;

        for (let i = 0; i < totalCombinations; i++) {
            const selected: typeof waveforms = [];
            const names: string[] = [];
            for (let j = 0; j < waveforms.length; j++) {
                if ((i & (1 << j)) !== 0) {
                    selected.push(waveforms[j]);
                    names.push(waveforms[j].name);
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
                for (const w of selected) {
                    expectedMask |= w.mask;
                }

                // Send control change events for all 4 waveforms to simulate transition to this state
                for (const w of waveforms) {
                    const isSelected = selected.some(s => s.controller === w.controller);
                    const event = new ControllerEvent(0, channel);
                    event.controller = w.controller;
                    event.value = isSelected ? 127 : 0;
                    (driver as unknown as DriverExposingInterpret).interpret(event);
                }

                expect(sid.read(address)).toBe(expectedMask);
            }
        );

    });

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

    // describe('filter interpretation', () => {

    // });

    // describe('volume interpretation', () => {

    // });

});
