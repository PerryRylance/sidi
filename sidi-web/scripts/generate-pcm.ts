import fs from "fs";
import path from "path";
import assert from "assert";
import { File } from "@perry-rylance/midi";
import createSIDModule from "../compiled/libresidfp";
import Driver from "../src/Driver";

async function main() {
    const filename = process.argv[2];
    if (!filename) {
        console.error("Usage: npx tsx scripts/generate-pcm.ts <midi-file>");
        process.exit(1);
    }

    const absolutePath = path.resolve(filename);
    if (!fs.existsSync(absolutePath)) {
        console.error(`File not found: ${absolutePath}`);
        process.exit(1);
    }

    const buffer = fs.readFileSync(absolutePath);
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    const file = File.fromArrayBuffer(arrayBuffer);

    assert.strictEqual(file.tracks.length, 1, `Expected exactly 1 track, found ${file.tracks.length}`);

    const track = file.tracks[0];

    const module = await createSIDModule();
    const sid = new module.SID();
    const driver = new Driver(sid, file.resolution);

    // Create a buffer of 10 seconds of silence/PCM at 44.1kHz (441000 samples)
    const pcmBuffer = new Float64Array(44100 * 10);

    driver.process(track, pcmBuffer);

    console.log("Processed track successfully.");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
