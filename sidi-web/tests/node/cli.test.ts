import { describe, expect, it } from "vitest";
import { spawnSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

const ROOT = path.resolve(__dirname, "..", "..");
const CLI = path.join(ROOT, "bin", "sidi-publish.mjs");
const WORKLET = path.join(ROOT, "dist", "SidiAudioWorkletProcessor.js");

function run(...args: string[])
{
    // NB: Don't inherit an IDE debugger bootloader
    const result = spawnSync(process.execPath, [CLI, ...args], { encoding: "utf8", env: { ...process.env, NODE_OPTIONS: "" } });
    return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "sidi-publish-"));

describe("sidi-publish", () =>
{
    it("copies the worklet into a directory, creating it if needed", () =>
    {
        const target = path.join(tmp(), "public", "audio");
        const { status } = run(target);

        expect(status).toBe(0);
        expect(fs.readFileSync(path.join(target, "SidiAudioWorkletProcessor.js"))).toEqual(fs.readFileSync(WORKLET));
    });

    it("writes to an exact file path when the destination ends in .js", () =>
    {
        const target = path.join(tmp(), "static", "sidi.js");
        const { status } = run(target);

        expect(status).toBe(0);
        expect(fs.readFileSync(target)).toEqual(fs.readFileSync(WORKLET));
    });

    it("prints usage and fails without a destination", () =>
    {
        const { status, stderr } = run();

        expect(status).toBe(1);
        expect(stderr).toContain("Usage: sidi-publish <destination>");
    });

    it("prints usage and succeeds for --help", () =>
    {
        const { status, stdout } = run("--help");

        expect(status).toBe(0);
        expect(stdout).toContain("Usage: sidi-publish <destination>");
    });

    it("refuses a destination that is an existing file", () =>
    {
        const file = path.join(tmp(), "afile");
        fs.writeFileSync(file, "x");

        const { status, stderr } = run(file);

        expect(status).toBe(1);
        expect(stderr).toContain("not a directory");
    });
});
