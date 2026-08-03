import { File, NoteOffEvent, NoteOnEvent, Track } from "@perry-rylance/midi";

const major = [0, 2, 4, 5, 7, 9, 11, 12];

const file = new File();
const track = new Track();
const delta = file.resolution.ticksPerQuarterNote;

file.tracks.push(track);

for(const pitch of [...major, ...major.toReversed()])
{
    const on = new NoteOnEvent();
    const off = new NoteOffEvent(delta);

    on.key = off.key = 60 + pitch;

    track.events.push(on, off);
}

export default file;
