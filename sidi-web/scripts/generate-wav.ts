import fs from "fs";
import path from "path";

import createSIDModule from "../compiled/libresidfp";
import Processor from "../src/Processor";
import SidChipAdapter from "../src/SidChipAdapter";
import { FileWriter } from "wav";
import loadMidiFile from "./load-midi-file";

async function main() {
    const filename = process.argv[2];
    if (!filename) {
        console.error("Usage: npm run render:midi -- <file.ts|.mid>");
        process.exit(1);
    }

    const midi = await loadMidiFile(filename);

    midi.tracks.flatten();

    const module = await createSIDModule();
    const sid = new SidChipAdapter(new module.SID());
    const processor = new Processor(sid, midi);
    const buffer = new Int16Array(44100);

    const outputDir = path.resolve("rendered");
    fs.mkdirSync(outputDir, { recursive: true });

    const basename = path.basename(filename, path.extname(filename));
    const outputPath = path.join(outputDir, `${basename}.wav`);

    const stream = new FileWriter(outputPath, {
        sampleRate: 44100,
        channels: 1,
        bitDepth: 16
    });

    let numSamplesWritten: number;

    while((numSamplesWritten = processor.process(buffer)))
    {
        const byteLength = numSamplesWritten * buffer.BYTES_PER_ELEMENT;
        const chunk = Buffer.allocUnsafe(byteLength);
        const audioBytes = Buffer.from(buffer.buffer, buffer.byteOffset, byteLength);

        audioBytes.copy(chunk);
        stream.write(chunk);
    }

    stream.end();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
