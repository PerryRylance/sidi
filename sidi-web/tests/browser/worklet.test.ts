/// <reference types="vite/client" />

import { describe, expect, it } from "vitest";
import midiUrl from "../fixtures/boots-and-cats.mid?url";

const SAMPLE_RATE = 44100;
const PROCESSOR_NAME = "sidi-audio-worklet-processor";

async function loadMidi(): Promise<ArrayBuffer>
{
    const response = await fetch(midiUrl);
    return response.arrayBuffer();
}

describe("built worklet (dist/SidiAudioWorkletProcessor.js)", () =>
{
    it("loads in a real AudioWorkletGlobalScope and renders non-silent audio", async () =>
    {
        const midi = await loadMidi();
        const context = new OfflineAudioContext(1, SAMPLE_RATE * 10, SAMPLE_RATE);

        await context.audioWorklet.addModule("/SidiAudioWorkletProcessor.js");

        const node = new AudioWorkletNode(context, PROCESSOR_NAME, {
            processorOptions: { midi, loop: false },
        });

        node.connect(context.destination);

        const rendered = await context.startRendering();
        const samples = rendered.getChannelData(0);
        const peak = samples.reduce((max, sample) => Math.max(max, Math.abs(sample)), 0);

        expect(peak).toBeGreaterThan(0.01);
    });
});
