import { describe, expect, test } from "vitest";
import { File, Track, SetTempoEvent, EndOfTrackEvent, NoteOnEvent, NoteOffEvent, ControllerEvent } from "@perry-rylance/midi";
import Processor from "../src/Processor";
import SidChipAdapter from "../src/SidChipAdapter";
import ContinuousController from "../src/ContinuousController";
import FakeSid from "./support/FakeSid";

const { Attack, Decay, Sustain, Release, AdsrWorkaroundGlobal, AdsrWorkaroundChannel } = ContinuousController;

// Covers the sample-accurate scheduling of MidiInterpreter.releaseAdsrHold() calls in Processor -
// mirrors sidi-vst's AdsrWorkaroundEngineTests.cpp, adapted to this codebase's pull-based, one-
// event-at-a-time architecture instead of JUCE's fixed-size audio blocks. See
// adsrWorkaroundInterpreter.test.ts for the register-write-sequence contract this schedules against.
//
// Sample rate is fixed at 44100 throughout, with ticksPerQuarterNote/bpm chosen so that
// (1/ticksPerQuarterNote) * (60/bpm) * sampleRate == 1 - ie. 1 MIDI tick equals exactly 1 sample,
// so event deltas can be written directly as sample counts. ticksPerQuarterNote is capped at 32768
// by the MIDI format, hence 441 (paired with a fast 6000bpm) rather than sampleRate itself.
// holdSamples = round(0.030 * 44100) = 1323, matching sidi-vst's holdDurationMs.
const sampleRate = 44100;
const ticksPerQuarterNote = 441;
const bpm = 6000;
const holdSamples = 1323;

function createFile(): { file: File, track: Track } {
    const file = new File();
    file.resolution.ticksPerQuarterNote = ticksPerQuarterNote;

    const track = new Track();
    file.tracks.push(track);

    const tempo = new SetTempoEvent();
    tempo.bpm = bpm;
    track.events.push(tempo);

    return { file, track };
}

function controllerEvent(delta: number, channel: number, controller: number, value: number): ControllerEvent {
    const event = new ControllerEvent(delta, channel);
    event.controller = controller;
    event.value = value;
    return event;
}

// NB: Sets attack/decay/sustain/release CCs to 127 - each maps to nibble 0xF, giving a real
// attackDecay/sustainRelease of 0xFF/0xFF, unambiguously distinct from both the priming values
// (0x00/0xF0) and SidChipAdapter's own default (also 0xF0) - see adsrWorkaroundInterpreter.test.ts.
function pushMaxAdsrValues(track: Track, channel: number): void {
    for (const controller of [Attack, Decay, Sustain, Release])
        track.events.push(controllerEvent(0, channel, controller, 127));
}

function createProcessor(file: File): { processor: Processor, sid: FakeSid } {
    const sid = new FakeSid();
    const adapter = new SidChipAdapter(sid as any);
    sid.writeLog.length = 0; // NB: Discard SidChipAdapter's constructor-time power-on default writes.

    const processor = new Processor(adapter, file, sampleRate);
    return { processor, sid };
}

describe('ADSR workaround scheduling', () => {

    test('with the workaround never engaged, a long gap is clocked in a single call, no splitting', () => {
        const { file, track } = createFile();

        const noteOn = new NoteOnEvent(0, 0);
        noteOn.key = 60;
        track.events.push(noteOn);

        track.events.push(new EndOfTrackEvent(5000));

        const { processor, sid } = createProcessor(file);
        processor.process(new Int16Array(5000), 5000);

        expect(sid.clockLog).toEqual([5000]);
    });

    test('a note on that arms a hold splits clocking so the release fires at exactly holdSamples later', () => {
        const { file, track } = createFile();

        pushMaxAdsrValues(track, 0);
        track.events.push(controllerEvent(0, 0, AdsrWorkaroundGlobal, 127));
        track.events.push(controllerEvent(0, 0, AdsrWorkaroundChannel, 127));

        const noteOn = new NoteOnEvent(0, 0);
        noteOn.key = 60;
        track.events.push(noteOn);

        track.events.push(new EndOfTrackEvent(5000));

        const { processor, sid } = createProcessor(file);
        processor.process(new Int16Array(5000), 5000);

        expect(sid.clockLog).toEqual([holdSamples, 5000 - holdSamples]);

        const controlRegisterWrites = sid.writeLog
            .filter(w => w.offset === 4)
            .map(w => w.value);
        // NB: 0x21 = SidChipAdapter.DEFAULT_CONTROL_REGISTER (0x20, saw waveform) | GATE (0x01) -
        // Processor seeds MidiInterpreter with the adapter's real power-on defaults, not zero.
        expect(controlRegisterWrites).toEqual([0x00, 0x21]); // zeroed, then GATE alone raised - no TEST

        // NB: .slice(-2) - the Attack/Decay/Sustain/Release CCs pushed by pushMaxAdsrValues() also
        // write these offsets immediately (setting up the real values), ahead of the note on; only
        // the last two writes to each are the priming/restore pair this test actually cares about.
        const attackDecayWrites = sid.writeLog.filter(w => w.offset === 5).map(w => w.value).slice(-2);
        const sustainReleaseWrites = sid.writeLog.filter(w => w.offset === 6).map(w => w.value).slice(-2);
        expect(attackDecayWrites).toEqual([0x00, 0xFF]); // primed, then restored to the real value
        expect(sustainReleaseWrites).toEqual([0xF0, 0xFF]); // primed, then restored to the real value

        expect(sid.read(5)).toBe(0xFF);
        expect(sid.read(6)).toBe(0xFF);
    });

    test("a hold whose release falls past the current process() call's buffer boundary fires at the correct offset in a later call", () => {
        const { file, track } = createFile();

        track.events.push(controllerEvent(0, 0, AdsrWorkaroundGlobal, 127));
        track.events.push(controllerEvent(0, 0, AdsrWorkaroundChannel, 127));

        const noteOn = new NoteOnEvent(0, 0);
        noteOn.key = 60;
        track.events.push(noteOn);

        track.events.push(new EndOfTrackEvent(100000));

        const { processor, sid } = createProcessor(file);

        // releaseAt = notePos(0) + holdSamples = 1323, which is beyond this 1000-sample call.
        processor.process(new Int16Array(1000), 1000);

        expect(sid.clockLog).toEqual([1000]);
        expect(processor.getInterpreter().hasPendingAdsrRelease(0)).toBe(true);

        processor.process(new Int16Array(1000), 1000);

        // Release lands at chip-time 1323, ie. 323 samples into this second call.
        expect(sid.clockLog).toEqual([1000, 323, 677]);
        expect(processor.getInterpreter().hasPendingAdsrRelease(0)).toBe(false);
    });

    test('note off before the hold resolves clears the pending release, and the chip clocks straight through the originally-scheduled release sample without incident', () => {
        const { file, track } = createFile();

        track.events.push(controllerEvent(0, 0, AdsrWorkaroundGlobal, 127));
        track.events.push(controllerEvent(0, 0, AdsrWorkaroundChannel, 127));

        const noteOn = new NoteOnEvent(0, 0);
        noteOn.key = 60;
        track.events.push(noteOn);

        // Note off well before holdSamples (1323) have elapsed.
        const noteOff = new NoteOffEvent(500, 0);
        noteOff.key = 60;
        track.events.push(noteOff);

        track.events.push(new EndOfTrackEvent(5000));

        const { processor, sid } = createProcessor(file);
        processor.process(new Int16Array(5500), 5500);

        // The clock still splits at the originally-scheduled release sample (500 + holdSamples =
        // 1823) - Processor doesn't bother cancelling a stale schedule on note off, since firing it
        // late is a guaranteed no-op once MidiInterpreter's own pending flag is already clear (see
        // adsrWorkaroundInterpreter.test.ts's "releaseAdsrHold is a no-op..." case). What matters is
        // no further register writes happen at that split - just the harmless extra clock() call.
        expect(sid.clockLog).toEqual([500, holdSamples - 500, 5500 - (500 + (holdSamples - 500))]);
        expect(processor.getInterpreter().hasPendingAdsrRelease(0)).toBe(false);

        // Exactly the writes note on (zero + gate-raise, prime) and note off (gate-clear, restore)
        // make - the harmless late releaseAdsrHold() call adds none of its own, proving it's a true
        // no-op rather than something that happens to write back the same values.
        expect(sid.writeLog.filter(w => w.offset === 4).length).toBe(3);
        expect(sid.writeLog.filter(w => w.offset === 5).length).toBe(2);
        expect(sid.writeLog.filter(w => w.offset === 6).length).toBe(2);
    });

    test('holds armed on two different channels each resolve at their own exact sample', () => {
        const { file, track } = createFile();

        track.events.push(controllerEvent(0, 0, AdsrWorkaroundGlobal, 127));
        track.events.push(controllerEvent(0, 0, AdsrWorkaroundChannel, 127));
        track.events.push(controllerEvent(0, 1, AdsrWorkaroundChannel, 127));

        const noteOnChannel0 = new NoteOnEvent(0, 0);
        noteOnChannel0.key = 60;
        track.events.push(noteOnChannel0);

        // Channel 1's note on arrives 200 samples later, so its hold resolves 200 samples after channel 0's.
        const noteOnChannel1 = new NoteOnEvent(200, 1);
        noteOnChannel1.key = 60;
        track.events.push(noteOnChannel1);

        track.events.push(new EndOfTrackEvent(5000));

        const { processor, sid } = createProcessor(file);
        processor.process(new Int16Array(5200), 5200);

        // Segments: up to channel 0's note on (0, folded into the next), up to channel 1's note on
        // (200), up to channel 0's release (holdSamples - 200), up to channel 1's release (200),
        // then the remainder.
        expect(sid.clockLog).toEqual([200, holdSamples - 200, 200, 5200 - (holdSamples + 200)]);
    });

});
