/// <reference types="audioworklet" />

import { File } from "@perry-rylance/midi";
import createSIDModule from "../compiled/libresidfp";
import SidChipAdapter from "./SidChipAdapter";
import Processor from "./Processor";
import type { SidiWorkletMessage } from "./SidiWorkletMessage";

export interface SidiAudioWorkletProcessorOptions
{
    processorOptions: {
        midi: ArrayBuffer;
        loop?: boolean;
    };
}

class SidiAudioWorkletProcessor extends AudioWorkletProcessor
{
    private processor?: Processor;
    private readonly loop: boolean;

    // NB: Only ticks while the WASM module is still loading, to be synced to a loading animation later
    private bufferedSampleCount: number = 0;

    constructor(options: SidiAudioWorkletProcessorOptions)
    {
        super();

        const { midi, loop = false } = options.processorOptions;
        const file = File.fromArrayBuffer(midi);

        this.loop = loop;

        // NB: Async failures here don't surface as a processorerror event or a rejected addModule() - they'd be
        // an unhandled rejection inside the worklet scope that the main thread never hears about - so report
        // them (and success) over the port. The helper's createSidiNode() waits on this.
        createSIDModule().then((module) =>
        {
            const sid = new SidChipAdapter(new module.SID());
            this.processor = new Processor(sid, file);
            this.post({ type: "ready" });
        }).catch((error: unknown) =>
        {
            this.post({ type: "error", message: error instanceof Error ? error.message : String(error) });
        });
    }

    private post(message: SidiWorkletMessage): void
    {
        this.port.postMessage(message);
    }

    process(_inputList: Float32Array[][], outputList: Float32Array[][], _parameters: Record<string, Float32Array>): boolean
    {
        const output = outputList[0];
        const channel = output?.[0];

        if(!channel)
            return true;

        if(!this.processor)
        {
            this.bufferedSampleCount += channel.length;
            return true;
        }

        const buffer = new Int16Array(channel.length);
        const numSamplesWritten = this.processor.process(buffer, buffer.length, this.loop);

        for (let i = 0; i < channel.length; i++)
        {
            const sample = i < numSamplesWritten ? buffer[i] / 0x8000 : 0;

            for (let c = 0; c < output.length; c++)
                output[c][i] = sample;
        }

        return true;
    }
}

registerProcessor("sidi-audio-worklet-processor", SidiAudioWorkletProcessor);
