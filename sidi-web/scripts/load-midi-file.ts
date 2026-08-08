import path from "path";
import fs from "fs";
import { pathToFileURL } from "url";
import { File } from "@perry-rylance/midi";

export default async function loadMidiFile(filename: string): Promise<File> {
    const absolutePath = path.resolve(filename);

    if (!fs.existsSync(absolutePath))
        throw new Error(`File not found: ${absolutePath}`);

    if (path.extname(absolutePath).toLowerCase() === ".mid") {
        const buffer = fs.readFileSync(absolutePath);
        return File.fromArrayBuffer(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
    }

    const imported = await import(pathToFileURL(absolutePath).href);
    const midi = await imported.default;

    if (!(midi instanceof File))
        throw new Error(`${absolutePath} must have a default export of type File, from @perry-rylance/midi`);

    return midi;
}
