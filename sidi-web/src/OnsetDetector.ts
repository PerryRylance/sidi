import aubioFactory from "aubiojs";

export type AubioOnsetMethod = "default" | "energy" | "hfc" | "complex" | "phase" | "specdiff" | "kl" | "mkl" | "specflux";

// NB: aubiojs's shipped index.d.ts declares Onset's constructor as (bufferSize, hopSize, sampleRate),
// but the compiled WASM binding actually requires a leading method argument too - confirmed by
// calling it, where the 3-arg form throws "expected 4 parameters instead". Declaring our own minimal,
// correct surface here rather than fighting the incorrect upstream types.
interface AubioOnsetInstance
{
    do(buffer: Float32Array): number;
    getLastS(): number;
    setSilence(silenceDb: number): number;
    setThreshold(threshold: number): number;
}

interface AubioModule
{
    Onset: new (method: AubioOnsetMethod, bufferSize: number, hopSize: number, sampleRate: number) => AubioOnsetInstance;
}

export interface OnsetDetectionOptions
{
    sampleRate?: number;
    bufferSize?: number;
    hopSize?: number;
    // NB: "hfc" (High Frequency Content) is tuned for bright/percussive material - it will reliably
    // catch cymbals, snares, hi-hats etc. to within a few ms, but is largely deaf to bass-heavy
    // low-frequency hits (kick drums), which it under-weights by design. Pick "energy" or "complex"
    // instead if the content you need timed is low-frequency-dominant.
    method?: AubioOnsetMethod;
    minInterOnsetMs?: number;
    // NB: Signal level below this (dBFS) is treated as silence and can't trigger an onset, regardless
    // of the novelty function - see the doc comment on DEFAULTS.silenceDb for why this is raised well
    // above aubio's own default.
    silenceDb?: number;
    // NB: Peak-picking sensitivity on the onset detection function itself - lower fires more readily.
    threshold?: number;
}

const DEFAULTS: Required<OnsetDetectionOptions> = {
    sampleRate: 44100,
    bufferSize: 512,
    hopSize: 256,
    method: "hfc",
    // NB: This build of aubiojs doesn't expose a working minioi setter, and testing showed an
    // occasional spurious re-trigger ~150ms after a hit's own attack - this backstop filters that
    // without being anywhere near the fixture's real ~250ms inter-hit spacing.
    minInterOnsetMs: 200,
    // NB: aubio's own default is -70dBFS, which is permissive enough to fire on inaudible sub-noise-
    // floor residue during a decay tail (observed: a real hit's decay leaves ~-63dBFS ringing that
    // triggered a spurious onset ~30ms before the actual, audible attack). -50dBFS sits comfortably
    // above that residue and well below any audible hit in testing, but tune per-material if hits are
    // quieter than that.
    silenceDb: -50,
    threshold: 0.058
};

let aubioModulePromise: Promise<AubioModule> | null = null;

function getAubioModule(): Promise<AubioModule>
{
    if (!aubioModulePromise)
        aubioModulePromise = aubioFactory() as unknown as Promise<AubioModule>;

    return aubioModulePromise;
}

export default class OnsetDetector
{
    static async detect(samples: Float32Array, options: OnsetDetectionOptions = {}): Promise<number[]>
    {
        const { sampleRate, bufferSize, hopSize, method, minInterOnsetMs, silenceDb, threshold } = { ...DEFAULTS, ...options };

        const { Onset } = await getAubioModule();
        const onset = new Onset(method, bufferSize, hopSize, sampleRate);
        onset.setSilence(silenceDb);
        onset.setThreshold(threshold);

        const minInterOnsetSamples = (minInterOnsetMs / 1000) * sampleRate;
        const onsets: number[] = [];
        let lastOnsetSample = -Infinity;

        for (let i = 0; i + hopSize <= samples.length; i += hopSize)
        {
            const chunk = samples.subarray(i, i + hopSize);

            if (onset.do(chunk) && i - lastOnsetSample >= minInterOnsetSamples)
            {
                onsets.push(onset.getLastS());
                lastOnsetSample = i;
            }
        }

        return onsets;
    }
}
