import fs from "fs";
import path from "path";

import { File } from "@perry-rylance/midi";
import createSIDModule from "../compiled/libresidfp";
import Processor from "../src/Processor";
import LoggingSID from "../src/LoggingSID";
import SidChipAdapter from "../src/SidChipAdapter";
import assertSingleTrack from "../src/assertions/assertSingleTrack";
import { FileWriter } from "wav";

async function main() {
    const filename = process.argv[2];
    if (!filename) {
        console.error("Usage: npm run render:wav <midi-file>");
        process.exit(1);
    }

    const absolutePath = path.resolve(filename);
    if (!fs.existsSync(absolutePath)) {
        console.error(`File not found: ${absolutePath}`);
        process.exit(1);
    }

    const fileBuffer = fs.readFileSync(absolutePath);
    const arrayBuffer = fileBuffer.buffer.slice(fileBuffer.byteOffset, fileBuffer.byteOffset + fileBuffer.byteLength);
    const midi = File.fromArrayBuffer(arrayBuffer);

    assertSingleTrack(midi);

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
