import fs from "fs";
import path from "path";
import { spawn } from "child_process";

import createSIDModule from "../compiled/libresidfp";
import Processor from "../src/Processor";
import SidChipAdapter from "../src/SidChipAdapter";
import { FileWriter } from "wav";
import loadMidiFile from "./load-midi-file";

const scriptPath = __filename;

async function render(filename: string): Promise<void> {
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

    console.log(`Rendered ${outputPath}`);
}

// NB: Re-renders in watch mode run this same script in a fresh child process, one per render,
// rather than re-importing the input file in this process. Node's ESM loader (and tsx's, which
// ignores cache-busting query strings) caches modules for the lifetime of the process, so an
// in-process re-import would keep returning the stale, first-loaded version of the input file. A
// fresh process also sidesteps createSIDModule() registering a new process-level
// "uncaughtException" listener on every call (see compiled/libresidfp.js) - reusing one process
// across many renders would otherwise leak listeners until Node's MaxListeners warning fires.
function renderInChildProcess(filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const child = spawn(process.execPath, [...process.execArgv, scriptPath, filename], {
            stdio: "inherit"
        });

        child.on("error", reject);
        child.on("exit", (code) => {
            if (code === 0)
                resolve();
            else
                reject(new Error(`Render exited with code ${code}`));
        });
    });
}

function watch(filename: string) {
    const absolutePath = path.resolve(filename);
    const dir = path.dirname(absolutePath);
    const base = path.basename(absolutePath);

    let pending = false;
    let rerenderQueued = false;
    let debounceTimer: NodeJS.Timeout | null = null;

    const rerender = async () => {
        if (pending) {
            rerenderQueued = true;
            return;
        }

        pending = true;
        rerenderQueued = false;

        try {
            await renderInChildProcess(filename);
        } catch (err) {
            console.error(err);
        } finally {
            pending = false;

            if (rerenderQueued)
                rerender();
        }
    };

    const scheduleRerender = () => {
        if (debounceTimer)
            clearTimeout(debounceTimer);

        debounceTimer = setTimeout(rerender, 100);
    };

    console.log(`Watching ${absolutePath} for changes...`);

    // NB: Watches the containing directory rather than the file itself - editors that save
    // atomically (write to a temp file, then rename over the target) replace the file's inode,
    // which breaks a watch held on the file path directly.
    fs.watch(dir, { persistent: true }, (eventType, changedFilename) => {
        if (changedFilename !== base)
            return;

        scheduleRerender();
    });
}

async function main() {
    const filename = process.argv[2];
    const watchFlag = process.argv.includes("--watch");

    if (!filename) {
        console.error("Usage: npm run midi:render -- <file.ts|.mid> [--watch]");
        process.exit(1);
    }

    if (watchFlag) {
        await renderInChildProcess(filename);
        watch(filename);
        return;
    }

    await render(filename);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
