import { describe, expect, it } from "vitest";
import { spawnSync } from "child_process";
import path from "path";
import { pathToFileURL } from "url";

const ROOT = path.resolve(__dirname, "..", "..");
const FIXTURE = path.join(ROOT, "tests", "fixtures", "boots-and-cats.mid");

// NB: Spawns a plain `node` rather than importing inside Vitest - vite-node transforms imported files and
// injects its own __dirname/require, which would mask exactly the Node-only failures this is here to catch.
// The consumer script renders a second of audio through the exported API and prints a JSON summary.
const BODY = `
    const { readFileSync } = require("fs");
    const buffer = readFileSync(${JSON.stringify(FIXTURE)});
    const midi = midiPkg.File.fromArrayBuffer(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
    const module = await api.createSIDModule();
    const processor = new api.Processor(new api.SidChipAdapter(new module.SID()), midi);
    const out = new Int16Array(44100);
    const written = processor.process(out);
    console.log(JSON.stringify({ written, nonSilent: out.some((s) => s !== 0), pal: api.ClockFrequencyHz.Pal }));
`;

function run(args: string[]): { status: number | null; stdout: string; stderr: string }
{
    const result = spawnSync(process.execPath, args, {
        cwd: ROOT,
        encoding: "utf8",
        // NB: Don't inherit an IDE debugger bootloader
        env: { ...process.env, NODE_OPTIONS: "" },
    });

    return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

function expectRendered({ status, stdout, stderr }: ReturnType<typeof run>)
{
    expect(stderr).not.toMatch(/Error/);
    expect(status).toBe(0);

    const summary = JSON.parse(stdout.trim().split("\n").pop()!);

    expect(summary.pal).toBe(985248);
    expect(summary.written).toBeGreaterThan(0);
    expect(summary.nonSilent).toBe(true);
}

describe("built library in Node (dist/)", () =>
{
    it("works when imported as an ES module (dist/index.mjs)", () =>
    {
        const url = pathToFileURL(path.join(ROOT, "dist", "index.mjs")).href;
        const script = `
            import midiPkg from "@perry-rylance/midi";
            import * as api from ${JSON.stringify(url)};
            const require = (await import("module")).createRequire(import.meta.url);
            ${BODY}
        `;

        expectRendered(run(["--input-type=module", "-e", script]));
    });

    it("works when required as CommonJS (dist/index.cjs)", () =>
    {
        const file = path.join(ROOT, "dist", "index.cjs");
        const script = `
            (async () => {
                const midiPkg = require("@perry-rylance/midi");
                const api = require(${JSON.stringify(file)});
                ${BODY}
            })().catch((e) => { console.error(e); process.exit(1); });
        `;

        expectRendered(run(["-e", script]));
    });
});
