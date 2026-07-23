import { File } from "@perry-rylance/midi";

export default function assertSingleTrack(midi: File)
{
    if(midi.tracks.length !== 1)
        throw new Error(`Expected exactly 1 track, found ${midi.tracks.length}`);
}
