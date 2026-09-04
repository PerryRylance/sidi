import { beforeAll, describe, expect, test } from "vitest";
import createSIDModule from "../compiled/libresidfp";
import { ControllerEvent, File, Track } from "@perry-rylance/midi";
import Processor from "../src/Processor";
import SidChipAdapter from "../src/SidChipAdapter";
import ContinuousController from "../src/ContinuousController";
import mockSID from "./support/mockSid";

const { FilterEnable, FilterLowPass, FilterHighPass } = ContinuousController;

// NB: Regression coverage for examples/snare.example.ts's reported bug - enabling a filter mode
// (FilterLowPass/FilterHighPass) on a channel with FilterEnable off produced total silence. The
// cause had nothing to do with per-voice filter routing: SidChipAdapter powers register $18 on to
// 0x0F (full volume, no filter mode bits), but Processor's MidiInterpreter kept its own shadow of
// that register starting at 0, unseeded from the chip's real power-on value. Since $18 packs the
// filter mode bits and the main volume nibble together, the first filter mode CC did a
// read-modify-write against the stale shadow and zeroed the volume nibble outright. See
// MidiInterpreter's constructor and SidChipAdapter.DEFAULT_FILTER_MODE_VOLUME.
describe('SidChipAdapter power-on defaults survive Processor/MidiInterpreter wiring', () => {

    let module: any;

    beforeAll(async () => {
        module = await createSIDModule({});
    });

    function makeProcessor() {
        const rawSid = mockSID(new module.SID());
        const sid = new SidChipAdapter(rawSid);

        const file = new File();
        const track = new Track();
        file.tracks.push(track);

        const processor = new Processor(sid, file);

        return { sid, processor };
    }

    test('a filter mode CC on a channel with filter routing disabled does not mute the chip', () => {

        const { sid, processor } = makeProcessor();
        const interpreter = processor.getInterpreter();
        const channel = 2;

        const disableRouting = new ControllerEvent(0, channel);
        disableRouting.controller = FilterEnable;
        disableRouting.value = 0;
        interpreter.process(disableRouting);

        const lowPassOn = new ControllerEvent(0, 0);
        // @ts-ignore NB: See https://github.com/PerryRylance/midi/issues/10
        lowPassOn.controller = FilterLowPass;
        lowPassOn.value = 127;
        interpreter.process(lowPassOn);

        const highPassOff = new ControllerEvent(0, 0);
        // @ts-ignore NB: See https://github.com/PerryRylance/midi/issues/10
        highPassOff.controller = FilterHighPass;
        highPassOff.value = 0;
        interpreter.process(highPassOff);

        const volumeNibble = sid.read(0x18) & 0x0F;

        expect(volumeNibble).toBe(SidChipAdapter.DEFAULT_FILTER_MODE_VOLUME);
        expect(volumeNibble).not.toBe(0);

    });

});
