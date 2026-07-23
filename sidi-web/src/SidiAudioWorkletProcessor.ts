/// <reference types="audioworklet" />

import { File } from "@perry-rylance/midi";
import assertSingleTrack from "./assertions/assertSingleTrack";
import createSIDModule from "../compiled/libresidfp";
import SidChipAdapter from "./SidChipAdapter";
import Processor from "./Processor";

export interface SidiAudioWorkletProcessorOptions
{
    processorOptions: {
        midi: File;
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

        assertSingleTrack(midi);

        this.loop = loop;

        createSIDModule().then((module) =>
        {
            const sid = new SidChipAdapter(new module.SID());
            this.processor = new Processor(sid, midi);
        });
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
