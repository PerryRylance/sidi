/// <reference types="vite/client" />

import { describe, expect, it } from "vitest";
import { File } from "@perry-rylance/midi";
import midiUrl from "../fixtures/boots-and-cats.mid?url";
import { Processor, SidChipAdapter, ContinuousController, ClockFrequencyHz, createSIDModule } from "../../dist/index.mjs";

describe("built library (dist/index.mjs)", () =>
{
    it("exports the public API", () =>
    {
        expect(ClockFrequencyHz.Pal).toBe(985248);
        expect(ContinuousController.MainVolume).toBe(7);
        expect(Processor).toBeTypeOf("function");
        expect(SidChipAdapter).toBeTypeOf("function");
    });

    it("creates the WASM module and renders non-silent audio through Processor", async () =>
    {
        const module = await createSIDModule();
        const midi = File.fromArrayBuffer(await (await fetch(midiUrl)).arrayBuffer());
        const processor = new Processor(new SidChipAdapter(new module.SID()), midi);
        const buffer = new Int16Array(44100);
        const numSamplesWritten = processor.process(buffer);

        expect(numSamplesWritten).toBeGreaterThan(0);
        expect(buffer.some((sample) => sample !== 0)).toBe(true);
    });
});
