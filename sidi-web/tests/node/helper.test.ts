import { describe, expect, it } from "vitest";
import { build } from "vite";
import fs from "fs";
import os from "os";
import path from "path";
import { pathToFileURL } from "url";

const ROOT = path.resolve(__dirname, "..", "..");
const HELPER = path.join(ROOT, "dist", "helper.mjs");
const WORKLET = path.join(ROOT, "dist", "SidiAudioWorkletProcessor.js");

describe("built helper (dist/helper.mjs)", () =>
{
    it("keeps the literal new URL(\"./SidiAudioWorkletProcessor.js\", import.meta.url) for consumers' bundlers", () =>
    {
        const source = fs.readFileSync(HELPER, "utf8");

        expect(source).toContain('new URL("./SidiAudioWorkletProcessor.js", import.meta.url)');
        expect(source).not.toContain("__SIDI_WORKLET_URL__");
        // NB: Vite inlines whatever file it resolves the URL to as base64 - that would mean it found the wrong one
        expect(source).not.toContain("data:");
    });

    it("doesn't pull the WASM/Processor bundle into a consumer", () =>
    {
        expect(fs.statSync(HELPER).size).toBeLessThan(10_000);
    });

    it("is emitted by a consumer's Vite build as the real worklet asset, not inlined", async () =>
    {
        const project = fs.mkdtempSync(path.join(os.tmpdir(), "sidi-consumer-"));
        const outDir = path.join(project, "out");

        fs.writeFileSync(path.join(project, "main.js"),
            `import { getWorkletUrl } from ${JSON.stringify(pathToFileURL(HELPER).href)};\nconsole.log(getWorkletUrl().href);\n`);

        await build({
            root: project,
            logLevel: "silent",
            configFile: false,
            // NB: An app build, not lib mode - lib mode inlines every asset, which is not what a consumer app gets
            build: { outDir, emptyOutDir: true, rollupOptions: { input: path.join(project, "main.js") } },
        });

        const assets = fs.readdirSync(path.join(outDir, "assets"));
        const asset = assets.find((file) => /^SidiAudioWorkletProcessor-.*\.js$/.test(file));
        const entryFile = assets.find((file) => /^main-.*\.js$/.test(file));

        expect(asset, `emitted: ${assets.join(", ")}`).toBeDefined();
        expect(entryFile, `emitted: ${assets.join(", ")}`).toBeDefined();

        const entry = fs.readFileSync(path.join(outDir, "assets", entryFile!), "utf8");

        expect(fs.readFileSync(path.join(outDir, "assets", asset!), "utf8")).toBe(fs.readFileSync(WORKLET, "utf8"));
        expect(entry).toContain(asset!);
        expect(entry.length).toBeLessThan(10_000);
    });
});
