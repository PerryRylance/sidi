import { beforeAll, describe, expect, test } from "vitest";
import createSIDModule from "../compiled/libresidfp";
import { NoteOnEvent, NoteOffEvent, ControllerEvent } from "@perry-rylance/midi";
import MidiInterpreter from "../src/MidiInterpreter";
import ContinuousController from "../src/ContinuousController";
import mockSID from "./support/mockSid";

const { Attack, Decay, Sustain, Release, AdsrWorkaroundGlobal, AdsrWorkaroundChannel } = ContinuousController;

// Covers the "ADSR bug" workaround (see MidiInterpreter.processNoteOn's comment, and
// sidi-vst's MidiInterpreter.cpp/AdsrWorkaroundInterpretationTests.cpp, which this mirrors):
// CC93/CC94 arm it, and a note on then zeroes the control register before raising GATE alone
// (no TEST - see https://csdb.dk/forums/?roomid=14&topicid=159900) and primes ATTACK_DECAY/
// SUSTAIN_RELEASE to attack=0/sustain=max, leaving a pending hold for releaseAdsrHold() to
// resolve later. The sample-accurate scheduling of *when* releaseAdsrHold() gets called is
// covered separately by adsrWorkaroundScheduling.test.ts.
let module: any;

beforeAll(async () => {
    module = await createSIDModule({});
});

// NB: Sets attack/decay/sustain/release CCs to 127 - each maps to nibble 0xF, giving a real
// attackDecay/sustainRelease of 0xFF/0xFF, unambiguously distinct from the priming values
// (0x00/0xF0) these tests check against, and from SidChipAdapter's own default (also 0xF0).
function setMaxAdsrValues(interpreter: MidiInterpreter, channel: number) {
    for (const controller of [Attack, Decay, Sustain, Release]) {
        const event = new ControllerEvent(0, channel);
        event.controller = controller;
        event.value = 127;
        interpreter.process(event);
    }
}

describe.each([0, 1, 2])('with midi channel %i', (channel) => {

    describe('ADSR workaround interpretation', () => {

        test('AdsrWorkaroundGlobal CC sets the global flag without writing any register', () => {
            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);

            expect(interpreter.isAdsrWorkaroundGlobalEnabled()).toBe(false);

            const on = new ControllerEvent(0, channel);
            on.controller = AdsrWorkaroundGlobal;
            on.value = 127;
            interpreter.process(on);

            expect(interpreter.isAdsrWorkaroundGlobalEnabled()).toBe(true);
            expect(sid.writeLog).toEqual([]);

            const off = new ControllerEvent(0, channel);
            off.controller = AdsrWorkaroundGlobal;
            off.value = 0;
            interpreter.process(off);

            expect(interpreter.isAdsrWorkaroundGlobalEnabled()).toBe(false);
            expect(sid.writeLog).toEqual([]);
        });

        test('AdsrWorkaroundChannel CC sets the per-channel flag without writing any register', () => {
            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);

            expect(interpreter.isAdsrWorkaroundEnabledForChannel(channel)).toBe(false);

            const on = new ControllerEvent(0, channel);
            on.controller = AdsrWorkaroundChannel;
            on.value = 127;
            interpreter.process(on);

            expect(interpreter.isAdsrWorkaroundEnabledForChannel(channel)).toBe(true);
            expect(sid.writeLog).toEqual([]);

            const off = new ControllerEvent(0, channel);
            off.controller = AdsrWorkaroundChannel;
            off.value = 0;
            interpreter.process(off);

            expect(interpreter.isAdsrWorkaroundEnabledForChannel(channel)).toBe(false);
            expect(sid.writeLog).toEqual([]);
        });

        test("AdsrWorkaroundChannel CC leaves the other channels' flags untouched", () => {
            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);

            const on = new ControllerEvent(0, channel);
            on.controller = AdsrWorkaroundChannel;
            on.value = 127;
            interpreter.process(on);

            for (let other = 0; other < 3; other++)
                expect(interpreter.isAdsrWorkaroundEnabledForChannel(other)).toBe(other === channel);
        });

        test('note on zeroes the control register then raises GATE alone (no TEST) when global and channel workaround are both on', () => {
            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);

            const global = new ControllerEvent(0, channel);
            global.controller = AdsrWorkaroundGlobal;
            global.value = 127;
            interpreter.process(global);

            const local = new ControllerEvent(0, channel);
            local.controller = AdsrWorkaroundChannel;
            local.value = 127;
            interpreter.process(local);

            expect(interpreter.hasPendingAdsrRelease(channel)).toBe(false);

            const noteOn = new NoteOnEvent(0, channel);
            noteOn.key = 60;
            interpreter.process(noteOn);

            const address = channel * 7 + 4;
            const controlRegisterWrites = sid.writeLog
                .filter((w: { offset: number, value: number }) => w.offset === address)
                .map((w: { offset: number, value: number }) => w.value);

            expect(controlRegisterWrites).toEqual([0x00, 0x01]); // zeroed, then GATE alone raised
            expect(interpreter.hasPendingAdsrRelease(channel)).toBe(true);
        });

        test('note on does not zero the control register or prime ADSR when only the global flag is on', () => {
            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);

            const global = new ControllerEvent(0, channel);
            global.controller = AdsrWorkaroundGlobal;
            global.value = 127;
            interpreter.process(global);

            const noteOn = new NoteOnEvent(0, channel);
            noteOn.key = 60;
            interpreter.process(noteOn);

            const address = channel * 7 + 4;
            const controlRegisterWrites = sid.writeLog
                .filter((w: { offset: number, value: number }) => w.offset === address)
                .map((w: { offset: number, value: number }) => w.value);

            expect(controlRegisterWrites).toEqual([0x01]); // plain GATE, no priming write
            expect(interpreter.hasPendingAdsrRelease(channel)).toBe(false);
        });

        test('note on does not zero the control register or prime ADSR when only the per-channel flag is on (global still off)', () => {
            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);

            const local = new ControllerEvent(0, channel);
            local.controller = AdsrWorkaroundChannel;
            local.value = 127;
            interpreter.process(local);

            const noteOn = new NoteOnEvent(0, channel);
            noteOn.key = 60;
            interpreter.process(noteOn);

            const address = channel * 7 + 4;
            const controlRegisterWrites = sid.writeLog
                .filter((w: { offset: number, value: number }) => w.offset === address)
                .map((w: { offset: number, value: number }) => w.value);

            expect(controlRegisterWrites).toEqual([0x01]); // plain GATE, no priming write
            expect(interpreter.hasPendingAdsrRelease(channel)).toBe(false);
        });

        test("releaseAdsrHold leaves the control register untouched - there's no TEST bit to release", () => {
            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);

            const global = new ControllerEvent(0, channel);
            global.controller = AdsrWorkaroundGlobal;
            global.value = 127;
            interpreter.process(global);

            const local = new ControllerEvent(0, channel);
            local.controller = AdsrWorkaroundChannel;
            local.value = 127;
            interpreter.process(local);

            const noteOn = new NoteOnEvent(0, channel);
            noteOn.key = 60;
            interpreter.process(noteOn);

            const address = channel * 7 + 4;
            const controlRegisterAfterNoteOn = sid.read(address);
            sid.writeLog.length = 0;

            interpreter.releaseAdsrHold(channel);

            expect(sid.writeLog.some((w: { offset: number }) => w.offset === address)).toBe(false);
            expect(sid.read(address)).toBe(controlRegisterAfterNoteOn); // GATE still on, untouched
            expect(interpreter.hasPendingAdsrRelease(channel)).toBe(false);
        });

        test('releaseAdsrHold is a no-op when there is no pending hold', () => {
            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);

            const noteOn = new NoteOnEvent(0, channel);
            noteOn.key = 60;
            interpreter.process(noteOn);
            sid.writeLog.length = 0;

            interpreter.releaseAdsrHold(channel);

            expect(sid.writeLog).toEqual([]);
        });

        test('a second note on while a hold is still pending zeroes the control register and re-raises GATE', () => {
            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);

            const global = new ControllerEvent(0, channel);
            global.controller = AdsrWorkaroundGlobal;
            global.value = 127;
            interpreter.process(global);

            const local = new ControllerEvent(0, channel);
            local.controller = AdsrWorkaroundChannel;
            local.value = 127;
            interpreter.process(local);

            const firstNoteOn = new NoteOnEvent(0, channel);
            firstNoteOn.key = 60;
            interpreter.process(firstNoteOn);

            sid.writeLog.length = 0;

            // Second drum hit on the same voice before the first hold resolved.
            const secondNoteOn = new NoteOnEvent(0, channel);
            secondNoteOn.key = 64;
            interpreter.process(secondNoteOn);

            const address = channel * 7 + 4;
            const controlRegisterWrites = sid.writeLog
                .filter((w: { offset: number, value: number }) => w.offset === address)
                .map((w: { offset: number, value: number }) => w.value);

            expect(controlRegisterWrites).toEqual([0x00, 0x01]); // zeroed again, GATE back up, still no TEST
            expect(interpreter.hasPendingAdsrRelease(channel)).toBe(true);
        });

        test('note off while a hold is still pending clears GATE and the pending flag', () => {
            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);

            const global = new ControllerEvent(0, channel);
            global.controller = AdsrWorkaroundGlobal;
            global.value = 127;
            interpreter.process(global);

            const local = new ControllerEvent(0, channel);
            local.controller = AdsrWorkaroundChannel;
            local.value = 127;
            interpreter.process(local);

            const noteOn = new NoteOnEvent(0, channel);
            noteOn.key = 60;
            interpreter.process(noteOn);

            const noteOff = new NoteOffEvent(0, channel);
            noteOff.key = 60;
            interpreter.process(noteOff);

            const address = channel * 7 + 4;
            expect(sid.read(address) & 0x01).toBe(0x00);
            expect(interpreter.hasPendingAdsrRelease(channel)).toBe(false);

            // releaseAdsrHold arriving late (already scheduled before the note off beat
            // it) must not resurrect the hold or write anything further.
            sid.writeLog.length = 0;
            interpreter.releaseAdsrHold(channel);
            expect(sid.writeLog).toEqual([]);
        });

        test('note on primes ATTACK_DECAY/SUSTAIN_RELEASE to attack=0/sustain=max when the workaround is active', () => {
            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);

            setMaxAdsrValues(interpreter, channel);

            const global = new ControllerEvent(0, channel);
            global.controller = AdsrWorkaroundGlobal;
            global.value = 127;
            interpreter.process(global);

            const local = new ControllerEvent(0, channel);
            local.controller = AdsrWorkaroundChannel;
            local.value = 127;
            interpreter.process(local);

            const noteOn = new NoteOnEvent(0, channel);
            noteOn.key = 60;
            interpreter.process(noteOn);

            const adsrOffset = channel * 7 + 5;
            expect(sid.read(adsrOffset)).toBe(0x00);
            expect(sid.read(adsrOffset + 1)).toBe(0xF0);
        });

        test('note on leaves the real ATTACK_DECAY/SUSTAIN_RELEASE values untouched when the workaround is inactive', () => {
            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);

            setMaxAdsrValues(interpreter, channel);

            const noteOn = new NoteOnEvent(0, channel);
            noteOn.key = 60;
            interpreter.process(noteOn);

            const adsrOffset = channel * 7 + 5;
            expect(sid.read(adsrOffset)).toBe(0xFF);
            expect(sid.read(adsrOffset + 1)).toBe(0xFF);
        });

        test("releaseAdsrHold restores the patch's real ADSR values", () => {
            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);

            setMaxAdsrValues(interpreter, channel);

            const global = new ControllerEvent(0, channel);
            global.controller = AdsrWorkaroundGlobal;
            global.value = 127;
            interpreter.process(global);

            const local = new ControllerEvent(0, channel);
            local.controller = AdsrWorkaroundChannel;
            local.value = 127;
            interpreter.process(local);

            const noteOn = new NoteOnEvent(0, channel);
            noteOn.key = 60;
            interpreter.process(noteOn);

            interpreter.releaseAdsrHold(channel);

            const adsrOffset = channel * 7 + 5;
            expect(sid.read(adsrOffset)).toBe(0xFF);
            expect(sid.read(adsrOffset + 1)).toBe(0xFF);
        });

        test("note off while a hold is still pending restores the patch's real ADSR values", () => {
            const sid = mockSID(new module.SID());
            const interpreter = new MidiInterpreter(sid);

            setMaxAdsrValues(interpreter, channel);

            const global = new ControllerEvent(0, channel);
            global.controller = AdsrWorkaroundGlobal;
            global.value = 127;
            interpreter.process(global);

            const local = new ControllerEvent(0, channel);
            local.controller = AdsrWorkaroundChannel;
            local.value = 127;
            interpreter.process(local);

            const noteOn = new NoteOnEvent(0, channel);
            noteOn.key = 60;
            interpreter.process(noteOn);

            const noteOff = new NoteOffEvent(0, channel);
            noteOff.key = 60;
            interpreter.process(noteOff);

            const adsrOffset = channel * 7 + 5;
            expect(sid.read(adsrOffset)).toBe(0xFF);
            expect(sid.read(adsrOffset + 1)).toBe(0xFF);
        });

    });

});
