import { File } from "@perry-rylance/midi";

const PROCESSOR_NAME = "sidi-audio-worklet-processor";
const PROCESSOR_URL = "/SidiAudioWorkletProcessor.js";

const input = document.querySelector<HTMLInputElement>("input[type=\"file\"]");

let audioContext: AudioContext | undefined;
let workletReady: Promise<void> | undefined;

async function getAudioContext(): Promise<AudioContext>
{
    if(!audioContext)
        audioContext = new AudioContext();

    if(!workletReady)
        workletReady = audioContext.audioWorklet.addModule(PROCESSOR_URL);

    await workletReady;
    await audioContext.resume();

    return audioContext;
}

input?.addEventListener("change", async () =>
{
    const file = input.files?.[0];

    if(!file)
        return;

    const arrayBuffer = await file.arrayBuffer();
    const midi = File.fromArrayBuffer(arrayBuffer);

    console.log("Loaded MIDI file");

    const context = await getAudioContext();

    const node = new AudioWorkletNode(context, PROCESSOR_NAME, {
        processorOptions: {
            midi,
            loop: false,
        },
    });

    console.log("Connecting processor");

    node.connect(context.destination);
});
