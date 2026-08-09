import { execFileSync } from "child_process";

// NB: Decodes via ffmpeg entirely in-memory (stdin/stdout pipes, no intermediate file) - works for
// any format ffmpeg supports (wav, flac, ...), used by both test fixtures and the CLI script.
export default function decodeAudioFile(absolutePath: string, sampleRate: number = 44100): Float32Array
{
    const raw = execFileSync("ffmpeg", [
        "-v", "error",
        "-i", absolutePath,
        "-f", "f32le",
        "-ac", "1",
        "-ar", String(sampleRate),
        "-"
    ], {
        maxBuffer: 1024 * 1024 * 256
    });

    // NB: execFileSync's Buffer may be a view into a pooled ArrayBuffer with a non-4-byte-aligned
    // byteOffset - copy into a fresh, offset-0 buffer before constructing the Float32Array over it.
    const bytes = new Uint8Array(raw);

    return new Float32Array(bytes.buffer, 0, Math.floor(bytes.length / Float32Array.BYTES_PER_ELEMENT));
}
