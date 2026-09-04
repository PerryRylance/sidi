import { File, NoteOffEvent, NoteOnEvent, Track } from "@perry-rylance/midi";
import { AdsrWorkaroundChannelEvent, AdsrWorkaroundGlobalEvent, DecayEvent, FilterBandPassEvent, FilterCutoffEvent, FilterEnableEvent, FilterHighPassEvent, FilterLowPassEvent, FilterResonanceEvent, NoiseEvent, SawEvent, SustainEvent, TriangleEvent } from "../src/Grammar";
import { channel, interpolate, ramp, repeat } from "@perry-rylance/midi-macros";

const ppqn = 480;

const snare = () => {

    const pitch = 53;

    return [
        new NoteOnEvent().key(pitch),
        // ...interpolate(ppqn, 24 * 4, (delta, interpolant, index) => 
        //     index % 2 === 0 ?
        //     [
        //         new NoiseEvent(delta).enabled(false),
        //         new TriangleEvent(0).enabled(true)
        //     ] :
        //     [
        //         new TriangleEvent(delta).enabled(false),
        //         new NoiseEvent(0).enabled(true)
        //     ]
        // ),
        ...ramp(ppqn, 24 * 4, 0x7F, 0x0, (delta, value, index) =>
            index % 2 === 0 ?
            [
                new FilterCutoffEvent(0, Math.round(value)),
                new NoiseEvent(delta).enabled(false),
                new TriangleEvent(0).enabled(true)
            ] :
            [
                new FilterCutoffEvent(0, Math.round(value)),
                new TriangleEvent(delta).enabled(false),
                new NoiseEvent(0).enabled(true)
            ]
        ),
        new NoteOffEvent().key(pitch)
    ];

};

const file = new File()
    .tracks([
        new Track().events([
            new AdsrWorkaroundGlobalEvent(0, true),
            ...( [0, 1, 2].map(channel => new AdsrWorkaroundChannelEvent(0, channel, true)) )
        ]),
        new Track().events([
            new FilterLowPassEvent().enabled(true),
            new FilterBandPassEvent().enabled(true),
            new FilterResonanceEvent().value(0x7F),
            new FilterCutoffEvent().value(0x3F),
            ...channel(2, [
                
                new SawEvent().enabled(false),
                new DecayEvent().value(0x3F),
                new SustainEvent().value(0),
                new FilterEnableEvent().enabled(true),

                ...repeat(8, snare())
            ])
        ])
    ]);

file.resolution.ticksPerQuarterNote = ppqn;

export default file;
