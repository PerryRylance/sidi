import assert from "assert";
import { File } from "@perry-rylance/midi";

export default function assertSingleTrack(midi: File)
{
    assert.strictEqual(midi.tracks.length, 1, `Expected exactly 1 track, found ${midi.tracks.length}`);
}
