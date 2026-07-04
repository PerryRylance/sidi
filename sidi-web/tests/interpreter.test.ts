import { beforeAll, describe, expect, test } from "vitest";
import createSIDModule from "../compiled/libresidfp";
import { NoteOnEvent, Resolution, Event, ControllerEvent } from "@perry-rylance/midi";
import Driver from "../src/Driver";
import { Attack, Decay, PulseWidth, Release, Sustain } from "../src/ContinuousController";

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
