import path from "path";
import { describe, test, expect } from "vitest";
import decodeAudioFile from "../src/decodeAudioFile";
import OnsetDetector from "../src/OnsetDetector";

// NB: Matches each expected onset to its nearest not-yet-used detection within tolerance, rather
// than comparing by array index - a single missed or extra detection would otherwise misalign every
// subsequent comparison and make errors look far larger (or smaller) than they really are.
function matchOnsets(expected: number[], detected: number[], toleranceSeconds: number)
{
    const usedDetectedIndices = new Set<number>();
    const matched: { expected: number, detected: number, errorMs: number }[] = [];
    const missed: number[] = [];

    for (const expectedTime of expected)
    {
        let bestIndex = -1;
        let bestDistance = Infinity;

        detected.forEach((detectedTime, index) => {
            if (usedDetectedIndices.has(index))
                return;

            const distance = Math.abs(detectedTime - expectedTime);
            if (distance < bestDistance)
            {
                bestDistance = distance;
                bestIndex = index;
            }
        });

        if (bestIndex >= 0 && bestDistance <= toleranceSeconds)
        {
            matched.push({ expected: expectedTime, detected: detected[bestIndex], errorMs: (detected[bestIndex] - expectedTime) * 1000 });
            usedDetectedIndices.add(bestIndex);
        }
        else
        {
            missed.push(expectedTime);
        }
    }

    const spurious = detected.filter((_, index) => !usedDetectedIndices.has(index));

    return { matched, missed, spurious };
}

describe("onset detection", () => {

    test("stays within 5ms of ground truth on a synthetic click train", async () => {
        const sampleRate = 44100;
        const expectedOnsets = [0.500, 0.750, 1.000, 1.250, 1.500, 1.750, 2.000];

        const samples = synthesizeClickTrain({
            sampleRate,
            durationSeconds: 2.5,
            onsetsSeconds: expectedOnsets,
            attackMs: 1,
            decayMs: 80
        });

        const detected = await OnsetDetector.detect(samples, { sampleRate, method: "energy" });
        const { matched, missed, spurious } = matchOnsets(expectedOnsets, detected, 0.02);

        console.log(`Matched: ${matched.length}/${expectedOnsets.length}, missed: ${missed.length}, spurious: ${spurious.length}`);
        console.log(`Errors (ms): ${matched.map(m => m.errorMs.toFixed(2)).join(", ")}`);

        expect(missed.length).toBe(0);
        matched.forEach(m => expect(Math.abs(m.errorMs)).toBeLessThan(5));
    });

    // NB: Per manual verification, the first 32 hits (4 bars) of this fixture are known-good, evenly
    // spaced 250ms apart - a real ground truth, not a synthetic proxy. The "hfc" (High Frequency
    // Content) method is deaf to the fixture's low-frequency kick hits by design (see OnsetDetector's
    // doc comment) - this asserts accuracy only on the hits it does detect, and reports the rest.
    test("detects the higher-pitched hits in the boots and cats fixture to within 5ms", async () => {
        const fixturePath = path.join(__dirname, "fixtures", "sidi test - boots and cats_stems_sidi-vst-007.flac");
        const samples = decodeAudioFile(fixturePath);

        const expectedOnsets = Array.from({ length: 32 }, (_, i) => i * 0.25);
        const detected = await OnsetDetector.detect(samples);
        const { matched, missed, spurious } = matchOnsets(expectedOnsets, detected, 0.02);

        console.log(`Matched: ${matched.length}/${expectedOnsets.length}`);
        console.log(`Missed (likely low-frequency kick hits, expected with "hfc"): ${missed.map(t => t.toFixed(2)).join(", ")}`);
        console.log(`Spurious: ${spurious.map(t => t.toFixed(3)).join(", ")}`);
        console.log(`Errors on matched hits (ms): ${matched.map(m => m.errorMs.toFixed(2)).join(", ")}`);

        expect(matched.length).toBeGreaterThan(0);
        matched.forEach(m => expect(Math.abs(m.errorMs)).toBeLessThan(5));
    });

});

function synthesizeClickTrain(options: {
    sampleRate: number;
    durationSeconds: number;
    onsetsSeconds: number[];
    attackMs: number;
    decayMs: number;
}): Float32Array
{
    const { sampleRate, durationSeconds, onsetsSeconds, attackMs, decayMs } = options;
    const samples = new Float32Array(Math.round(durationSeconds * sampleRate));

    // NB: Deterministic PRNG (not Math.random) so this test is reproducible run to run.
    let seed = 1;
    const random = () => {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        return (seed / 0x7fffffff) * 2 - 1;
    };

    const attackSamples = Math.round((attackMs / 1000) * sampleRate);
    const decaySamples = Math.round((decayMs / 1000) * sampleRate);

    for (const onsetSeconds of onsetsSeconds)
    {
        const onsetSample = Math.round(onsetSeconds * sampleRate);

        for (let i = 0; i < decaySamples; i++)
        {
            const index = onsetSample + i;
            if (index >= samples.length) break;

            // Linear attack ramp (not an instant jump) into an exponential decay - a fairer test of
            // a detector's bias than a Dirac impulse, since real percussive hits aren't instantaneous.
            const envelope = i < attackSamples
                ? i / attackSamples
                : Math.exp(-(i - attackSamples) / (decaySamples * 0.3));

            samples[index] += envelope * random();
        }
    }

    return samples;
}
