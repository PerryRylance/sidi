/// <reference types="vite/client" />

import { describe, expect, it } from "vitest";
import midiUrl from "../fixtures/boots-and-cats.mid?url";
import { createSidiNode, loadSidiWorklet, getWorkletUrl, PROCESSOR_NAME } from "../../dist/helper.mjs";

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
});
