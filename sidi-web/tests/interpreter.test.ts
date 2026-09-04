import { beforeAll, describe, expect, test } from "vitest";
import createSIDModule from "../compiled/libresidfp";
import { NoteOnEvent, NoteOffEvent, ControllerEvent, PitchWheelEvent } from "@perry-rylance/midi";
import MidiInterpreter from "../src/MidiInterpreter";
import ContinuousController from "../src/ContinuousController";
import SidChipAdapter from "../src/SidChipAdapter";
import { Pal } from "../src/ClockFrequencyHz";
import mockSID from "./support/mockSid";

const { Attack, Decay, Noise, Pulse, PulseWidth, Release, Saw, Sustain, Tri, Gate, Sync, Ring, Test, FilterCutoff, FilterResonance, FilterEnable, FilterLowPass, FilterBandPass, FilterHighPass, Oscillator3Mute, MainVolume } = ContinuousController;

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
            const interpreter = new MidiInterpreter(sid);

            interpreter.process(event);

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
            const interpreter = new MidiInterpreter(sid);

            interpreter.process(event);

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
                    const interpreter = new MidiInterpreter(sid);

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
                        interpreter.process(event);
                    }

                    // NB: These bits are written lazily - see MidiInterpreter.flush().
                    interpreter.flush();

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
                const interpreter = new MidiInterpreter(sid);

                interpreter.process(event);

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
            const interpreter = new MidiInterpreter(sid);

            const noteOn = new NoteOnEvent(0, channel);
            noteOn.key = 60;

            interpreter.process(noteOn);

            const address = channel * 7 + 4;
            expect(sid.read(address) & 0x01).toBe(0x01);
        });

        test('interpreting a note on followed by a note off on the same pitch turns the GATE bit OFF', () => {
            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);

            const noteOn = new NoteOnEvent(0, channel);
            noteOn.key = 60;
            interpreter.process(noteOn);

            const noteOff = new NoteOffEvent(0, channel);
            noteOff.key = 60;
            interpreter.process(noteOff);

            const address = channel * 7 + 4;
            expect(sid.read(address) & 0x01).toBe(0x00);
        });

        test('interpreting a note on, followed by a note on on a different key, followed by a note off on the original key, keeps the GATE bit ON', () => {
            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);

            // Press Note A
            const noteOnA = new NoteOnEvent(0, channel);
            noteOnA.key = 60;
            interpreter.process(noteOnA);

            // Press Note B (making B the last pressed note)
            const noteOnB = new NoteOnEvent(0, channel);
            noteOnB.key = 64;
            interpreter.process(noteOnB);

            // Release Note A (not the last pressed note)
            const noteOffA = new NoteOffEvent(0, channel);
            noteOffA.key = 60;
            interpreter.process(noteOffA);

            const address = channel * 7 + 4;
            expect(sid.read(address) & 0x01).toBe(0x01); // Gate should still be ON
        });

        test('interpreting a note on, followed by a note on on a different key, followed by a note off on the original key, and then a note off on the last note on key, sets the GATE bit OFF', () => {
            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);

            // Press Note A
            const noteOnA = new NoteOnEvent(0, channel);
            noteOnA.key = 60;
            interpreter.process(noteOnA);

            // Press Note B (making B the last pressed note)
            const noteOnB = new NoteOnEvent(0, channel);
            noteOnB.key = 64;
            interpreter.process(noteOnB);

            // Release Note A (not the last pressed note)
            const noteOffA = new NoteOffEvent(0, channel);
            noteOffA.key = 60;
            interpreter.process(noteOffA);

            const address = channel * 7 + 4;
            expect(sid.read(address) & 0x01).toBe(0x01); // Gate should still be ON

            // Release Note B (the last pressed note)
            const noteOffB = new NoteOffEvent(0, channel);
            noteOffB.key = 64;
            interpreter.process(noteOffB);

            expect(sid.read(address) & 0x01).toBe(0x00); // Gate should now be OFF
        });

        test('interpreting a note on while the GATE bit is already ON forces a retrigger (OFF then ON), not a no-op write', () => {
            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);
            const address = channel * 7 + 4;

            const noteOnA = new NoteOnEvent(0, channel);
            noteOnA.key = 60;
            interpreter.process(noteOnA); // GATE 0 -> 1

            sid.writeLog.length = 0; // isolate the writes made by the second note on

            // A second hit on the same voice with no note off in between - eg. two
            // drum hits sharing one oscillator, as is standard chiptune practice.
            const noteOnB = new NoteOnEvent(0, channel);
            noteOnB.key = 64;
            interpreter.process(noteOnB);

            const gateBits = sid.writeLog
                .filter((w: { offset: number, value: number }) => w.offset === address)
                .map((w: { offset: number, value: number }) => w.value & 0x01);

            // Must observe a genuine 1 -> 0 -> 1 edge, not just settle on 1
            expect(gateBits).toEqual([0, 1]);
        });

        test('interpreting a note on while the GATE bit is already OFF writes it just once', () => {
            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);
            const address = channel * 7 + 4;

            const noteOn = new NoteOnEvent(0, channel);
            noteOn.key = 60;
            interpreter.process(noteOn);

            const gateWrites = sid.writeLog.filter((w: { offset: number, value: number }) => w.offset === address);

            expect(gateWrites.length).toBe(1);
            expect(gateWrites[0].value & 0x01).toBe(1);
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
            const interpreter = new MidiInterpreter(sid);

            interpreter.process(event);

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
            const interpreter = new MidiInterpreter(sid);

            interpreter.process(event);

            const regVal = sid.read(0x17);
            const nibble = (regVal >> 4) & 0x0F;

            expect(nibble).toBe(expectedNibble);

        });

        test('interpreting a FilterEnable cc with value 127 enables the filter for the current channel, and value 0 disables it', () => {

            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);
            const address = 0x17;

            // Turn ON
            const enableEvent = new ControllerEvent(0, channel);
            enableEvent.controller = FilterEnable;
            enableEvent.value = 127;

            interpreter.process(enableEvent);

            const expectedBit = 1 << channel;
            expect(sid.read(address) & expectedBit).toBe(expectedBit);

            // Turn OFF
            const disableEvent = new ControllerEvent(0, channel);
            disableEvent.controller = FilterEnable;
            disableEvent.value = 0;

            interpreter.process(disableEvent);

            expect(sid.read(address) & expectedBit).toBe(0x00);

        });

        test('filter controls preserve other bits in register $17', () => {

            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);
            const address = 0x17;

            // 1. Send resonance event (set to max, value 127 which scales to 0xF)
            const resEvent = new ControllerEvent(0, channel);
            resEvent.controller = FilterResonance;
            resEvent.value = 127;
            interpreter.process(resEvent);

            // Verify resonance is 0xF0, and routing bits are still 0
            expect(sid.read(address)).toBe(0xF0);

            // 2. Enable filter routing for current channel
            const enableEvent = new ControllerEvent(0, channel);
            enableEvent.controller = FilterEnable;
            enableEvent.value = 127;
            interpreter.process(enableEvent);

            // Verify resonance bits are preserved, and routing bit is added
            const expectedBit = 1 << channel;
            expect(sid.read(address)).toBe(0xF0 | expectedBit);

            // 3. Disable filter routing
            const disableEvent = new ControllerEvent(0, channel);
            disableEvent.controller = FilterEnable;
            disableEvent.value = 0;
            interpreter.process(disableEvent);

            // Verify resonance is still preserved, routing bit is removed
            expect(sid.read(address)).toBe(0xF0);

        });

        function testFilterModeBits(
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
                        const address = 0x18;
                        const sid = mockSID(new module.SID());
                        const interpreter = new MidiInterpreter(sid);

                        let expectedMask = 0;
                        for (const b of selected) {
                            expectedMask |= b.mask;
                        }

                        for (const b of bits) {
                            const isSelected = selected.some(s => s.controller === b.controller);
                            const event = new ControllerEvent(0, channel);
                            event.controller = b.controller;
                            event.value = isSelected ? 127 : 0;
                            interpreter.process(event);
                        }

                        expect(sid.read(address)).toBe(expectedMask);
                    }
                );
            });
        }

        testFilterModeBits('filter mode interpretation', [
            { controller: FilterLowPass, mask: 0x10, name: 'lp' },
            { controller: FilterBandPass, mask: 0x20, name: 'bp' },
            { controller: FilterHighPass, mask: 0x40, name: 'hp' }
        ]);

        test('interpreting a Oscillator3Mute cc with value 127 sets the mute bit for oscillator 3, and value 0 clears it', () => {

            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);
            const address = 0x18;

            // Turn ON (Mute active)
            const muteEvent = new ControllerEvent(0, channel);
            muteEvent.controller = Oscillator3Mute;
            muteEvent.value = 127;

            interpreter.process(muteEvent);

            expect(sid.read(address) & 0x80).toBe(0x80);

            // Turn OFF (Mute inactive)
            const unmuteEvent = new ControllerEvent(0, channel);
            unmuteEvent.controller = Oscillator3Mute;
            unmuteEvent.value = 0;

            interpreter.process(unmuteEvent);

            expect(sid.read(address) & 0x80).toBe(0x00);

        });

        test('oscillator 3 mute and filter mode controls preserve other bits in register $18', () => {

            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);
            const address = 0x18;

            // 1. Send FilterLowPass (set to 127, enables LP, bit 0x10)
            const lpEvent = new ControllerEvent(0, channel);
            // @ts-ignore NB: See https://github.com/PerryRylance/midi/issues/10
            lpEvent.controller = FilterLowPass;
            lpEvent.value = 127;
            interpreter.process(lpEvent);

            // Verify LP bit is set (0x10)
            expect(sid.read(address)).toBe(0x10);

            // 2. Send Oscillator3Mute (set to 127, enables Mute, bit 0x80)
            const muteEvent = new ControllerEvent(0, channel);
            muteEvent.controller = Oscillator3Mute;
            muteEvent.value = 127;
            interpreter.process(muteEvent);

            // Verify LP bit is preserved, and Mute bit is added (0x10 | 0x80 = 0x90)
            expect(sid.read(address)).toBe(0x10 | 0x80);

            // 3. Disable FilterLowPass
            const disableLpEvent = new ControllerEvent(0, channel);
            // @ts-ignore NB: See https://github.com/PerryRylance/midi/issues/10
            disableLpEvent.controller = FilterLowPass;
            disableLpEvent.value = 0;
            interpreter.process(disableLpEvent);

            // Verify Mute bit is preserved, and LP bit is removed (0x80)
            expect(sid.read(address)).toBe(0x80);

        });

    });

    describe('volume interpretation', () => {

        test.each([
            [0, 0x0],
            [64, 0x8],
            [127, 0xF]
        ])(`for midi cc ${MainVolume} value %i writes expected 4-bit volume level to register`, (value, expectedVolume) => {

            const event = new ControllerEvent(0, channel);
            event.controller = MainVolume;
            event.value = value;

            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);

            interpreter.process(event);

            const regVal = sid.read(0x18);
            const volumeBits = regVal & 0x0F;

            expect(volumeBits).toBe(expectedVolume);

        });

        test('volume controls preserve other bits in register $18', () => {

            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);
            const address = 0x18;

            // 1. Send FilterLowPass (set to 127, enables LP, bit 0x10)
            const lpEvent = new ControllerEvent(0, channel);
            // @ts-ignore NB: See https://github.com/PerryRylance/midi/issues/10
            lpEvent.controller = FilterLowPass;
            lpEvent.value = 127;
            interpreter.process(lpEvent);

            // Verify LP bit is set (0x10)
            expect(sid.read(address)).toBe(0x10);

            // 2. Send MainVolume (set to 127, value 0xF)
            const volEvent = new ControllerEvent(0, channel);
            volEvent.controller = MainVolume;
            volEvent.value = 127;
            interpreter.process(volEvent);

            // Verify LP is preserved, and Volume is set (0x10 | 0x0F = 0x1F)
            expect(sid.read(address)).toBe(0x10 | 0x0F);

            // 3. Clear FilterLowPass
            const disableLpEvent = new ControllerEvent(0, channel);
            // @ts-ignore NB: See https://github.com/PerryRylance/midi/issues/10
            disableLpEvent.controller = FilterLowPass;
            disableLpEvent.value = 0;
            interpreter.process(disableLpEvent);

            // Verify Volume is preserved, and LP is cleared (0x0F)
            expect(sid.read(address)).toBe(0x0F);

        });

    });

    describe('power-on default seeding for register $18', () => {

        // NB: Regression coverage for a bug where MidiInterpreter's local $18 shadow
        // (filterModeVolumeSelect) started at 0 instead of SidChipAdapter's real power-on value
        // (0x0F - full volume, no filter mode bits). $18 packs the filter mode select bits and the
        // main volume nibble together, so the very first FilterLowPass/BandPass/HighPass/
        // Oscillator3Mute CC - before any MainVolume CC ever arrived - did a read-modify-write
        // against the stale all-zero shadow and silently zeroed the volume nibble, muting the chip
        // outright regardless of any per-voice FilterEnable routing. See Processor's
        // `new MidiInterpreter(...)` call and SidChipAdapter.DEFAULT_FILTER_MODE_VOLUME.

        test('without seeding, a filter mode CC arriving before any MainVolume CC zeroes the volume nibble', () => {

            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);
            const address = 0x18;

            const lpEvent = new ControllerEvent(0, channel);
            // @ts-ignore NB: See https://github.com/PerryRylance/midi/issues/10
            lpEvent.controller = FilterLowPass;
            lpEvent.value = 127;
            interpreter.process(lpEvent);

            expect(sid.read(address)).toBe(0x10);

        });

        test('seeding the constructor with SidChipAdapter.DEFAULT_FILTER_MODE_VOLUME preserves that volume when a filter mode CC arrives first', () => {

            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid, Pal, 0, 0, SidChipAdapter.DEFAULT_FILTER_MODE_VOLUME);
            const address = 0x18;

            const lpEvent = new ControllerEvent(0, channel);
            // @ts-ignore NB: See https://github.com/PerryRylance/midi/issues/10
            lpEvent.controller = FilterLowPass;
            lpEvent.value = 127;
            interpreter.process(lpEvent);

            expect(sid.read(address)).toBe(0x10 | SidChipAdapter.DEFAULT_FILTER_MODE_VOLUME);

        });

    });

    describe('pitch bend and RPN range interpretation', () => {

        const testCases = [
            // [noteName, key, defaultUpLo, defaultUpHi, defaultDownLo, defaultDownHi, rpnUpLo, rpnUpHi, rpnDownLo, rpnDownHi]
            ["C1", 24, 0x71, 0x02, 0xF0, 0x01, 0x5A, 0x04, 0x16, 0x01],
            ["C2", 36, 0xE2, 0x04, 0xE0, 0x03, 0xB4, 0x08, 0x2D, 0x02],
            ["C3", 48, 0xC4, 0x09, 0xC1, 0x07, 0x67, 0x11, 0x5A, 0x04],
            ["C4", 60, 0x89, 0x13, 0x81, 0x0F, 0xCE, 0x22, 0xB4, 0x08],
            ["C5", 72, 0x11, 0x27, 0x02, 0x1F, 0x9C, 0x45, 0x67, 0x11],
            ["C6", 84, 0x23, 0x4E, 0x04, 0x3E, 0x39, 0x8B, 0xCF, 0x22]
        ] as const;

        test.each(testCases)('with base note %s: default +/- 2 semitone bends write correct bytes', (noteName, key, upLo, upHi, downLo, downHi) => {
            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);
            const address = channel * 7;

            // 1. Play note
            const noteEvent = new NoteOnEvent(0, channel);
            noteEvent.key = key;
            interpreter.process(noteEvent);

            // 2. Apply full pitch bend up (amount = 1.0)
            const upEvent = new PitchWheelEvent(0, channel);
            upEvent.amount = 1.0;
            interpreter.process(upEvent);

            expect(sid.read(address)).toBe(upLo);
            expect(sid.read(address + 1)).toBe(upHi);

            // 3. Apply full pitch bend down (amount = -1.0)
            const downEvent = new PitchWheelEvent(0, channel);
            downEvent.amount = -1.0;
            interpreter.process(downEvent);

            expect(sid.read(address)).toBe(downLo);
            expect(sid.read(address + 1)).toBe(downHi);
        });

        test.each(testCases)('with base note %s: RPN-configured +/- 12 semitone bends write correct bytes', (noteName, key, _upLo, _upHi, _downLo, _downHi, rpnUpLo, rpnUpHi, rpnDownLo, rpnDownHi) => {
            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);
            const address = channel * 7;

            // 1. Select RPN 00 00 (Pitch Bend Sensitivity)
            const msbEvent = new ControllerEvent(0, channel);
            msbEvent.controller = 101;
            msbEvent.value = 0;
            interpreter.process(msbEvent);

            const lsbEvent = new ControllerEvent(0, channel);
            lsbEvent.controller = 100;
            lsbEvent.value = 0;
            interpreter.process(lsbEvent);

            // 2. Set range to 12 semitones using Data Entry MSB (CC 6)
            const dataEvent = new ControllerEvent(0, channel);
            dataEvent.controller = 6;
            dataEvent.value = 12;
            interpreter.process(dataEvent);

            // 3. Play note
            const noteEvent = new NoteOnEvent(0, channel);
            noteEvent.key = key;
            interpreter.process(noteEvent);

            // 4. Apply full pitch bend up (amount = 1.0)
            const upEvent = new PitchWheelEvent(0, channel);
            upEvent.amount = 1.0;
            interpreter.process(upEvent);

            expect(sid.read(address)).toBe(rpnUpLo);
            expect(sid.read(address + 1)).toBe(rpnUpHi);

            // 5. Apply full pitch bend down (amount = -1.0)
            const downEvent = new PitchWheelEvent(0, channel);
            downEvent.amount = -1.0;
            interpreter.process(downEvent);

            expect(sid.read(address)).toBe(rpnDownLo);
            expect(sid.read(address + 1)).toBe(rpnDownHi);
        });

        test('data entry MSB without RPN selection does not alter default bend range', () => {
            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);
            const address = channel * 7;

            // 1. Play C4
            const noteEvent = new NoteOnEvent(0, channel);
            noteEvent.key = 60;
            interpreter.process(noteEvent);

            // 2. Send Data Entry MSB (CC 6) with value 12 without selecting RPN
            const dataEvent = new ControllerEvent(0, channel);
            dataEvent.controller = 6;
            dataEvent.value = 12;
            interpreter.process(dataEvent);

            // 3. Apply full up bend
            const bendEvent = new PitchWheelEvent(0, channel);
            bendEvent.amount = 1.0;
            interpreter.process(bendEvent);

            // Should still only bend 2 semitones to D4 (0x1389)
            expect(sid.read(address)).toBe(0x89);
            expect(sid.read(address + 1)).toBe(0x13);
        });

        test('data entry MSB under non-zero RPN does not alter pitch bend range', () => {
            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);
            const address = channel * 7;

            // 1. Play C4
            const noteEvent = new NoteOnEvent(0, channel);
            noteEvent.key = 60;
            interpreter.process(noteEvent);

            // 2. Select a different RPN (e.g., RPN 00 01 - Fine Tuning)
            const msbEvent = new ControllerEvent(0, channel);
            msbEvent.controller = 101;
            msbEvent.value = 0;
            interpreter.process(msbEvent);

            const lsbEvent = new ControllerEvent(0, channel);
            lsbEvent.controller = 100;
            lsbEvent.value = 1; // Non-zero RPN
            interpreter.process(lsbEvent);

            // 3. Send Data Entry MSB (CC 6) with value 12
            const dataEvent = new ControllerEvent(0, channel);
            dataEvent.controller = 6;
            dataEvent.value = 12;
            interpreter.process(dataEvent);

            // 4. Apply full up bend
            const bendEvent = new PitchWheelEvent(0, channel);
            bendEvent.amount = 1.0;
            interpreter.process(bendEvent);

            // Should still only bend 2 semitones to D4 (0x1389)
            expect(sid.read(address)).toBe(0x89);
            expect(sid.read(address + 1)).toBe(0x13);
        });

        test('pitch bend on a channel does not affect another channel', () => {
            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);
            
            const otherChannel = (channel + 1) % 3;
            const addressChan = channel * 7;
            const addressOther = otherChannel * 7;

            // Play C4 on both channels
            const note1 = new NoteOnEvent(0, channel);
            note1.key = 60;
            interpreter.process(note1);

            const note2 = new NoteOnEvent(0, otherChannel);
            note2.key = 60;
            interpreter.process(note2);

            // Apply full pitch bend to our channel
            const bendEvent = new PitchWheelEvent(0, channel);
            bendEvent.amount = 1.0;
            interpreter.process(bendEvent);

            // Our channel should be bent up to D4 (0x1389)
            expect(sid.read(addressChan)).toBe(0x89);
            expect(sid.read(addressChan + 1)).toBe(0x13);

            // Other channel should remain unbent C4 (0x1167)
            expect(sid.read(addressOther)).toBe(0x67);
            expect(sid.read(addressOther + 1)).toBe(0x11);
        });

    });

});
