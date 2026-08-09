import path from "path";
import fs from "fs";
import { Table } from "console-table-printer";
import decodeAudioFile from "../src/decodeAudioFile";
import OnsetDetector, { AubioOnsetMethod } from "../src/OnsetDetector";

async function main() {
    const filename = process.argv[2];
    const method = (process.argv[3] as AubioOnsetMethod) || "hfc";

    if (!filename) {
        console.error("Usage: npm run detect:onsets -- <audio-file> [method]");
        console.error("Methods: default, energy, hfc, complex, phase, specdiff, kl, mkl, specflux (default: hfc)");
        process.exit(1);
    }

    const absolutePath = path.resolve(filename);
    if (!fs.existsSync(absolutePath)) {
        console.error(`File not found: ${absolutePath}`);
        process.exit(1);
    }

    const samples = decodeAudioFile(absolutePath);
    const onsets = await OnsetDetector.detect(samples, { method });

    const table = new Table({ title: `Detected onsets (method: ${method})` });

    onsets.forEach((time, i) => {
        const intervalMs = i > 0 ? (time - onsets[i - 1]) * 1000 : undefined;

        table.addRow({
            "#": i + 1,
            "time (s)": time.toFixed(4),
            "Δ from previous (ms)": intervalMs !== undefined ? intervalMs.toFixed(1) : ""
        });
    });

    table.printTable();

    const intervalsMs = onsets.slice(1).map((time, i) => (time - onsets[i]) * 1000);
    const meanMs = intervalsMs.reduce((a, b) => a + b, 0) / (intervalsMs.length || 1);

    console.log(`\n${onsets.length} onsets detected`);
    console.log(`Inter-onset interval: min ${Math.min(...intervalsMs).toFixed(1)}ms, max ${Math.max(...intervalsMs).toFixed(1)}ms, mean ${meanMs.toFixed(1)}ms`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
