/// <reference types="audioworklet" />

import { File } from "@perry-rylance/midi";
import assertSingleTrack from "./assertions/assertSingleTrack";
import { SIDModule } from "../compiled/libresidfp";
import SidChipAdapter from "./SidChipAdapter";
import Processor from "./Processor";

interface SidiAudioWorkletProcessorOptions
{
    processorOptions: {
        module: SIDModule;
        midi: File;
        loop?: boolean;
    };
}

class SidiAudioWorkletProcessor extends AudioWorkletProcessor
{
    private sid: SidChipAdapter;
    private processor: Processor;
    private readonly loop: boolean;

    constructor(options: SidiAudioWorkletProcessorOptions)
    {
        super();

        const { module, midi, loop = false } = options.processorOptions;

        assertSingleTrack(midi);

        this.loop = loop;
        this.sid = new SidChipAdapter(new module.SID());
        this.processor = new Processor(this.sid, midi);
    }

    process(_inputList: Float32Array[][], outputList: Float32Array[][], _parameters: Record<string, Float32Array>): boolean
    {
        const output = outputList[0];
        const channel = output?.[0];

        if(!channel)
            return true;

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
