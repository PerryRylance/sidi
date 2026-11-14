/// <reference types="vite/client" />

import { describe, expect, it } from "vitest";
import midiUrl from "../fixtures/boots-and-cats.mid?url";

const SAMPLE_RATE = 44100;
const PROCESSOR_NAME = "sidi-audio-worklet-processor";

// NB: Only checks the bundle loads and registers in a real AudioWorkletGlobalScope, not what it sounds like.
describe("built worklet (dist/SidiAudioWorkletProcessor.js)", () =>
{
    it("loads, registers its processor and instantiates without error", async () =>
    {
        const midi = await (await fetch(midiUrl)).arrayBuffer();
        const context = new OfflineAudioContext(1, SAMPLE_RATE, SAMPLE_RATE);

        await context.audioWorklet.addModule("/SidiAudioWorkletProcessor.js");

        // NB: Throws InvalidStateError if registerProcessor() never ran under this name
        const node = new AudioWorkletNode(context, PROCESSOR_NAME, {
            processorOptions: { midi, loop: false },
        });

        let processorError: Event | undefined;
        node.onprocessorerror = (event) => { processorError = event; };

        node.connect(context.destination);
        await context.startRendering();

        expect(processorError).toBeUndefined();
    });
});
