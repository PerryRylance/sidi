import { Table } from 'console-table-printer';
import Case from "case";
import loadMidiFile from "./load-midi-file";
import ContinuousController from '../src/ContinuousController';
import { ControlEvent, ControllerEvent, MetaEvent, NoteEvent, NoteOffEvent, NoteOnEvent, PitchWheelEvent, SysExEvent } from '@perry-rylance/midi';

function midiToPitch(midi: number) {
  const noteNames = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
  const name = noteNames[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  
  return `${name}${octave}`;
}

type ContinuousControllerName = keyof typeof ContinuousController;

const ContinuousControllerByValue: Record<number, ContinuousControllerName> =
    Object.fromEntries(
        Object.entries(ContinuousController).map(([name, value]) => [value, name])
    ) as Record<number, ContinuousControllerName>;

async function main() {
    const filename = process.argv[2];
    if (!filename) {
        console.error("Usage: npm run explain:midi -- <file.ts|.mid>");
        process.exit(1);
    }

    const midi = await loadMidiFile(filename);
    
    midi.tracks.flatten();

    const track = midi.tracks[0];
    const table = new Table({
        title: "MIDI events",
        colorMap: {
            ignored: "\x1b[90m",
            processed: "\x1b[37m",
            significant: "\x1b[32m"
        }
    });

    for(const event of track.events)
    {
        if(event instanceof SysExEvent)
        {
            table.addRow({
                "ΔT": event.delta,
                type: "sysex"
            }, {
                color: "ignored"
            });
        }
        else if(event instanceof MetaEvent)
        {
            table.addRow({
                "ΔT": event.delta,
                type: "meta"
            }, {
                color: "ignored"
            });
        }
        else if(event instanceof ControlEvent)
        {
            let type: string;
            let value: number | string;
            let desc: string = "";
            let color = "ignored";

            if((event instanceof NoteEvent || event instanceof ControllerEvent) && event.channel < 3)
            {
                color = "processed";

                if(event instanceof NoteEvent)
                    color = "significant";
            }

            if(event instanceof NoteOnEvent)
            {
                type = "note on";
                value = midiToPitch(event.key);
            }
            else if(event instanceof NoteOffEvent)
            {
                type = "note off";
                value = midiToPitch(event.key);
            }
            else if(event instanceof ControllerEvent)
            {
                type = "cc";

                if(event.controller in ContinuousControllerByValue)
                {
                    desc = Case.kebab(ContinuousControllerByValue[event.controller].replace(/aeiou/, ""));

                    if(event.channel < 3)
                        color = "significant";
                }
                else
                    desc = event.controller.toString();

                value = event.value;
            }
            else if(event instanceof PitchWheelEvent)
            {
                type = "pitch";
                value = event.amount.toFixed(2);

                if(event.channel < 3)
                    color = "significant";
            }
            else
            {
                type = "other";
                value = "";
            }

            table.addRow({
                "ΔT": event.delta,
                chan: event.channel + 1,
                type,
                desc,
                value
            }, {
                color
            });
        }
    }

    table.printTable();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

