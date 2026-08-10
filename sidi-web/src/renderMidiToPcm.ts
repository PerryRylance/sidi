import { File } from "@perry-rylance/midi";
import createSIDModule from "../compiled/libresidfp";
import Processor from "./Processor";
import SidChipAdapter from "./SidChipAdapter";

export default async function renderMidiToPcm(midi: File, sampleRate: number = 44100): Promise<Float32Array>
{
    const module = await createSIDModule();
    const sid = new SidChipAdapter(new module.SID());
    const processor = new Processor(sid, midi, sampleRate);

    // NB: 1-second chunks, matching scripts/generate-wav.ts - process() only ever fills up to the
    // buffer it's given, so a fixed-size chunk accumulated in a loop handles a file of any length,
    // unlike guessing a single upfront buffer size large enough for the whole render.
    const chunkBuffer = new Int16Array(sampleRate);
    const chunks: Int16Array[] = [];
    let totalSamples = 0;
    let numSamplesWritten: number;

    while ((numSamplesWritten = processor.process(chunkBuffer)))
    {
        chunks.push(chunkBuffer.slice(0, numSamplesWritten));
        totalSamples += numSamplesWritten;
    }

    const samples = new Float32Array(totalSamples);
    let offset = 0;

    for (const chunk of chunks)
    {
        for (let i = 0; i < chunk.length; i++)
            samples[offset + i] = chunk[i] / 32768;

        offset += chunk.length;
    }

    return samples;
}
