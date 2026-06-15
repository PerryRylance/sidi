import fs from "fs";
import { File, Track, NoteOnEvent, NoteOffEvent, WriteStream, EndOfTrackEvent } from "@perry-rylance/midi";

type DemoFiles = Record<string, () => File>;

const files: DemoFiles = {
    "test-tone": () => {

        const file = new File();
        const track = new Track();

        file.tracks.push(track);

        const on = new NoteOnEvent(0, 0);

        on.velocity = 127;
        on.key = 60;

        track.events.push(on);

        const off = new NoteOffEvent(file.resolution.ticksPerQuarterNote * 4, 0);

        off.key = on.key;

        track.events.push(off);

        track.events.push(new EndOfTrackEvent);

        return file;

    }
};

for(const filename in files)
{
    const stream = new WriteStream();
    const generator = files[filename];
    const file = generator();

    file.writeBytes(stream);

    const arrayBuffer = stream.toArrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    fs.writeFileSync(`demo/${filename}.mid`, buffer);

}
