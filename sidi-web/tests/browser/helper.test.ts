/// <reference types="vite/client" />

import { describe, expect, it } from "vitest";
import midiUrl from "../fixtures/boots-and-cats.mid?url";
import { createSidiNode, loadSidiWorklet, getWorkletUrl, PROCESSOR_NAME, SidiWorkletError } from "../../dist/helper.mjs";

// NB: Stand-ins for the real worklet, registering the same processor name, to drive the helper's failure paths
function fakeWorklet(body: string): string
{
    const source = `
        class Fake extends AudioWorkletProcessor {
            constructor() { super(); ${body} }
            process() { return true; }
        }
        registerProcessor(${JSON.stringify(PROCESSOR_NAME)}, Fake);
    `;

    return URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
}

describe("built helper (dist/helper.mjs)", () =>
{
    it("creates a node using an explicit workletUrl (as a sidi-publish'd file would be loaded)", async () =>
    {
        const midi = await (await fetch(midiUrl)).arrayBuffer();
        const context = new OfflineAudioContext(1, 44100, 44100);
        const node = await createSidiNode(context, midi, { workletUrl: "/SidiAudioWorkletProcessor.js" });

        expect(node).toBeInstanceOf(AudioWorkletNode);
    });

    it("loads the worklet only once per context", async () =>
    {
        const context = new OfflineAudioContext(1, 44100, 44100);
        const url = "/SidiAudioWorkletProcessor.js";

        expect(loadSidiWorklet(context, url)).toBe(loadSidiWorklet(context, url));
    });

    it("rejects, and can be retried, when the worklet URL is wrong", async () =>
    {
        const context = new OfflineAudioContext(1, 44100, 44100);

        await expect(loadSidiWorklet(context, "/does-not-exist.js")).rejects.toBeDefined();
        await expect(loadSidiWorklet(context, "/SidiAudioWorkletProcessor.js")).resolves.toBeUndefined();
    });

    it("exposes the processor name and a default URL next to the helper", () =>
    {
        expect(PROCESSOR_NAME).toBe("sidi-audio-worklet-processor");
        expect(getWorkletUrl().pathname.endsWith("/SidiAudioWorkletProcessor.js")).toBe(true);
    });

    describe("createSidiNode readiness", () =>
    {
        it("rejects with the worklet's own message when it reports an error", async () =>
        {
            const context = new OfflineAudioContext(1, 44100, 44100);
            const workletUrl = fakeWorklet(`this.port.postMessage({ type: "error", message: "SIM-WASM-LOAD-FAILED" });`);

            const error = await createSidiNode(context, new ArrayBuffer(0), { workletUrl }).catch((e) => e);

            expect(error).toBeInstanceOf(SidiWorkletError);
            expect(error.message).toContain("SIM-WASM-LOAD-FAILED");
        });

        it("rejects, rather than hanging, when the worklet never reports (e.g. a stale published file)", async () =>
        {
            const context = new OfflineAudioContext(1, 44100, 44100);
            const workletUrl = fakeWorklet("");

            const error = await createSidiNode(context, new ArrayBuffer(0), { workletUrl, readyTimeoutMs: 300 }).catch((e) => e);

            expect(error).toBeInstanceOf(SidiWorkletError);
            expect(error.message).toContain("sidi-publish");
        });

        it("rejects, rather than hanging, when the worklet's constructor throws", async () =>
        {
            const context = new OfflineAudioContext(1, 44100, 44100);
            const workletUrl = fakeWorklet(`throw new Error("SIM-CONSTRUCTOR-THROW");`);

            const error = await createSidiNode(context, new ArrayBuffer(0), { workletUrl, readyTimeoutMs: 3000 }).catch((e) => e);

            expect(error).toBeInstanceOf(SidiWorkletError);
        });

        it("rejects, rather than hanging, when the MIDI data is invalid (real worklet)", async () =>
        {
            const context = new OfflineAudioContext(1, 44100, 44100);

            const error = await createSidiNode(context, new Uint8Array([1, 2, 3, 4]).buffer, {
                workletUrl: "/SidiAudioWorkletProcessor.js",
                readyTimeoutMs: 3000,
            }).catch((e) => e);

            expect(error).toBeInstanceOf(SidiWorkletError);
        });
    });
});
