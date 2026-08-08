import fs from "fs";
import os from "os";
import path from "path";

import { ChildProcess, execFileSync, spawn } from "child_process";

import { FileWriter } from "wav";
import createSIDModule from "../compiled/libresidfp";
import Processor from "../src/Processor";
import SidChipAdapter from "../src/SidChipAdapter";
import loadMidiFile from "./load-midi-file";

const SAMPLE_RATE = 44100;
const BUFFER_SIZE = 4096;
const CHUNK_SAMPLES = SAMPLE_RATE * 10;

// NB: Render one chunk at a time rather than the whole track, so this supports scripts that
// generate indefinitely - only ever one chunk sits in memory/on disk ahead of playback.
function renderChunk(processor: Processor, buffer: Int16Array): Buffer | null {
    const chunks: Buffer[] = [];
    let samplesAccumulated = 0;

    while (samplesAccumulated < CHUNK_SAMPLES) {
        const numSamplesWritten = processor.process(buffer);
        if (!numSamplesWritten)
            break;

        const byteLength = numSamplesWritten * buffer.BYTES_PER_ELEMENT;
        const chunk = Buffer.allocUnsafe(byteLength);
        const audioBytes = Buffer.from(buffer.buffer, buffer.byteOffset, byteLength);

        audioBytes.copy(chunk);
        chunks.push(chunk);
        samplesAccumulated += numSamplesWritten;
    }

    return chunks.length ? Buffer.concat(chunks) : null;
}

function writeWavFile(filePath: string, pcm: Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
        const writer = new FileWriter(filePath, {
            sampleRate: SAMPLE_RATE,
            channels: 1,
            bitDepth: 16,
        });

        writer.on("error", reject);
        writer.on("close", () => resolve());

        writer.write(pcm);
        writer.end();
    });
}

function toWindowsPath(linuxPath: string): string {
    return execFileSync("wslpath", ["-w", linuxPath]).toString().trim();
}

// NB: WSLg's own audio passthrough (ffplay/PulseAudio, or a native binding straight to the
// same device) glitches on anything but perfectly steady tones once it's fed live rather than
// from a finished file - confirmed across ffplay via pipe, ffplay via FIFO, and a native
// RtAudio/PulseAudio binding, at buffer sizes from 93ms up to 8 seconds. Handing a finished WAV
// straight to the Windows host to play sidesteps that bridge entirely.
function playWav(filePath: string, onSpawned: (child: ChildProcess) => void): Promise<void> {
    const windowsPath = toWindowsPath(filePath);

    return new Promise((resolve, reject) => {
        const child = spawn("powershell.exe", [
            "-NoProfile",
            "-Command",
            `(New-Object Media.SoundPlayer '${windowsPath}').PlaySync()`,
        ]);

        onSpawned(child);

        child.on("error", reject);
        child.on("close", () => resolve());
    });
}

async function main() {
    const filename = process.argv[2];
    if (!filename) {
        console.error("Usage: npm run listen:midi -- <file.ts|.mid>");
        process.exit(1);
    }

    const midi = await loadMidiFile(filename);

    // NB: Processor insists on a single track, same as scripts/generate-wav.ts.
    midi.tracks.flatten();

    const module = await createSIDModule();
    const sid = new SidChipAdapter(new module.SID());
    const processor = new Processor(sid, midi, SAMPLE_RATE);
    const buffer = new Int16Array(BUFFER_SIZE);

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "sidi-listen-"));

    let interrupted = false;
    let currentPlayer: ChildProcess | null = null;

    process.on("SIGINT", () => {
        interrupted = true;
        currentPlayer?.kill();
    });

    let chunkIndex = 0;
    let previousPlayback: Promise<void> = Promise.resolve();

    while (!interrupted) {
        const pcm = renderChunk(processor, buffer);
        if (!pcm)
            break;

        const wavPath = path.join(tempDir, `chunk-${chunkIndex++}.wav`);
        await writeWavFile(wavPath, pcm);

        // NB: Wait for the previous chunk to finish playing before starting this one - keeps
        // playback order and stops chunks overlapping. The next chunk is rendered and written
        // to disk *before* this wait, so it's ready the instant the previous one finishes.
        await previousPlayback;

        if (interrupted)
            break;

        previousPlayback = playWav(wavPath, (child) => { currentPlayer = child; })
            .finally(() => fs.rmSync(wavPath, { force: true }));
    }

    await previousPlayback;

    fs.rmSync(tempDir, { recursive: true, force: true });

    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
