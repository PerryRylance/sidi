import type { SidiAudioWorkletProcessorOptions } from "./SidiAudioWorkletProcessor";

export const PROCESSOR_NAME = "sidi-audio-worklet-processor";

export interface CreateSidiNodeOptions
{
    loop?: boolean;

    /** Override where the worklet script is loaded from (e.g. a file placed by `sidi-publish`). */
    workletUrl?: string | URL;
}

// NB: The literal `new URL("./…", import.meta.url)` form is what a consumer's bundler (Vite, webpack 5, Parcel...)
// recognises as "emit this file as an asset and give me its URL". We can't write that literal here, because our
// own build (Vite) would resolve it against src/ and inline the wrong file. So scripts/build-worklet.ts swaps
// this placeholder for "./SidiAudioWorkletProcessor.js" in dist/helper.mjs after bundling (and fails if it can't).
export function getWorkletUrl(): URL
{
    return new URL(/* @vite-ignore */ "__SIDI_WORKLET_URL__", import.meta.url);
}

const loaded = new WeakMap<BaseAudioContext, Map<string, Promise<void>>>();

export function loadSidiWorklet(context: BaseAudioContext, workletUrl: string | URL = getWorkletUrl()): Promise<void>
{
    const url = String(workletUrl);
    let byUrl = loaded.get(context);

    if(!byUrl)
        loaded.set(context, byUrl = new Map());

    let promise = byUrl.get(url);

    if(!promise)
    {
        promise = context.audioWorklet.addModule(url);

        // NB: Don't cache a failure - let the caller retry (e.g. after fixing the URL)
        promise.catch(() => byUrl!.delete(url));
        byUrl.set(url, promise);
    }

    return promise;
}

export async function createSidiNode(context: BaseAudioContext, midi: ArrayBuffer, options: CreateSidiNodeOptions = {}): Promise<AudioWorkletNode>
{
    const { loop = false, workletUrl } = options;

    await loadSidiWorklet(context, workletUrl);

    const nodeOptions: AudioWorkletNodeOptions & SidiAudioWorkletProcessorOptions = {
        processorOptions: { midi, loop },
    };

    return new AudioWorkletNode(context, PROCESSOR_NAME, nodeOptions);
}
