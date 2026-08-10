import path from "path";
import fs from "fs";
import { Table } from "console-table-printer";
import decodeAudioFile from "../src/decodeAudioFile";
import renderMidiToPcm from "../src/renderMidiToPcm";
import loadMidiFile from "./load-midi-file";
import OnsetDetector, { AubioOnsetMethod } from "../src/OnsetDetector";

const MIDI_EXTENSIONS = [".mid", ".midi"];

async function main() {
    const filename = process.argv[2];
    const method = (process.argv[3] as AubioOnsetMethod) || "hfc";

    if (!filename) {
        console.error("Usage: npm run detect:onsets -- <audio-or-midi-file> [method]");
        console.error("Methods: default, energy, hfc, complex, phase, specdiff, kl, mkl, specflux (default: hfc)");
        process.exit(1);
    }

    const absolutePath = path.resolve(filename);
    if (!fs.existsSync(absolutePath)) {
        console.error(`File not found: ${absolutePath}`);
        process.exit(1);
    }

    const sampleRate = 44100;
    const isMidi = MIDI_EXTENSIONS.includes(path.extname(absolutePath).toLowerCase());

    let samples: Float32Array;

    if (isMidi) {
        const midi = await loadMidiFile(absolutePath);
        midi.tracks.flatten();
        samples = await renderMidiToPcm(midi, sampleRate);
    } else {
        samples = decodeAudioFile(absolutePath, sampleRate);
    }

    const onsets = await OnsetDetector.detect(samples, { sampleRate, method });

    const table = new Table({ title: `Detected onsets (method: ${method})` });
    const rows = onsets.map((time, i) => ({
        "#": i + 1,
        "time (s)": time.toFixed(4),
        "Δ from previous (ms)": i > 0 ? ((time - onsets[i - 1]) * 1000).toFixed(1) : ""
    }));

    rows.forEach(row => table.addRow(row));
    table.printTable();

    const intervalsMs = onsets.slice(1).map((time, i) => (time - onsets[i]) * 1000);
    const meanMs = intervalsMs.reduce((a, b) => a + b, 0) / (intervalsMs.length || 1);

    console.log(`\n${onsets.length} onsets detected`);
    console.log(`Inter-onset interval: min ${Math.min(...intervalsMs).toFixed(1)}ms, max ${Math.max(...intervalsMs).toFixed(1)}ms, mean ${meanMs.toFixed(1)}ms`);

    const outputDir = path.resolve("rendered");
    fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, `${path.basename(absolutePath)}.onsets.csv`);
    const csv = ["#,time (s),delta from previous (ms)", ...rows.map(row => `${row["#"]},${row["time (s)"]},${row["Δ from previous (ms)"]}`)].join("\n");

    fs.writeFileSync(outputPath, csv);
    console.log(`\nSaved to ${outputPath}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
