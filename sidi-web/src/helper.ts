import type { SidiAudioWorkletProcessorOptions } from "./SidiAudioWorkletProcessor";
import type { SidiWorkletMessage } from "./SidiWorkletMessage";

export const PROCESSOR_NAME = "sidi-audio-worklet-processor";

export interface CreateSidiNodeOptions
{
    loop?: boolean;

    /** Override where the worklet script is loaded from (e.g. a file placed by `sidi-publish`). */
    workletUrl?: string | URL;

    /**
     * How long to wait for the worklet to report it's ready before giving up, in milliseconds (default 10000).
     * `Infinity` waits forever.
     */
    readyTimeoutMs?: number;
}

/** Thrown (as a rejection of `createSidiNode`) when the worklet fails to start, or never reports that it has. */
export class SidiWorkletError extends Error
{
    constructor(message: string)
    {
        super(message);
        this.name = "SidiWorkletError";
    }
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

function waitUntilReady(node: AudioWorkletNode, timeoutMs: number): Promise<void>
{
    return new Promise<void>((resolve, reject) =>
    {
        let timer: ReturnType<typeof setTimeout> | undefined;

        const settle = (error?: SidiWorkletError) =>
        {
            clearTimeout(timer);
            node.port.onmessage = null;
            node.onprocessorerror = null;

            if(error)
            {
                node.port.close();
                reject(error);
            }
            else
                resolve();
        };

        node.port.onmessage = (event: MessageEvent<SidiWorkletMessage>) =>
        {
            if(event.data?.type === "ready")
                settle();
            else if(event.data?.type === "error")
                settle(new SidiWorkletError(`The SIDI worklet failed to start: ${event.data.message}`));
        };

        // NB: Fires if the processor's constructor throws synchronously - e.g. the MIDI data isn't a valid file
        node.onprocessorerror = () =>
            settle(new SidiWorkletError("The SIDI worklet threw while starting (is the MIDI data a valid file?). See the browser console for details."));

        if(Number.isFinite(timeoutMs))
            timer = setTimeout(
                () => settle(new SidiWorkletError(
                    `The SIDI worklet didn't report ready within ${timeoutMs}ms. If you load it from a file copied with sidi-publish, it may be from an older version - run sidi-publish again.`
                )),
                timeoutMs
            );
    });
}

/**
 * Loads the worklet into `context` and resolves to a node playing `midi`, once the emulator has finished loading.
 * Rejects with a `SidiWorkletError` if the worklet fails to start, or doesn't report ready in time.
 */
export async function createSidiNode(context: BaseAudioContext, midi: ArrayBuffer, options: CreateSidiNodeOptions = {}): Promise<AudioWorkletNode>
{
    const { loop = false, workletUrl, readyTimeoutMs = 10_000 } = options;

    await loadSidiWorklet(context, workletUrl);

    const nodeOptions: AudioWorkletNodeOptions & SidiAudioWorkletProcessorOptions = {
        processorOptions: { midi, loop },
    };

    const node = new AudioWorkletNode(context, PROCESSOR_NAME, nodeOptions);

    await waitUntilReady(node, readyTimeoutMs);

    return node;
}
