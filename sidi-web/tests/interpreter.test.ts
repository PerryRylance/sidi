import { beforeAll, describe, expect, test } from "vitest";
import createSIDModule from "../compiled/libresidfp";
import { NoteOnEvent, Resolution, Event, ControllerEvent } from "@perry-rylance/midi";
import Driver from "../src/Driver";
import { PulseWidth } from "../src/ContinuousController";

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

describe.each([
    { channel: 0 },
    { channel: 1 },
    { channel: 2 },
])('with midi channel $channel', ({ channel }) => {

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
        ])('for midi cc 70 value %i writes expected bytes', (width, [ lo, hi ]) => {

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

    // describe('adsr envelope interpretation', () => {

    // });

    // describe('filter interpretation', () => {

    // });

    // describe('volume interpretation', () => {

    // });

});
