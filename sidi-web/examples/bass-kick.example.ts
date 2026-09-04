import { File, NoteOffEvent, NoteOnEvent, PitchBendRangeEventsFactory, PitchWheelEvent, Track } from "@perry-rylance/midi";
import { AdsrWorkaroundChannelEvent, AdsrWorkaroundGlobalEvent, PulseEvent, PulseWidthEvent, SawEvent } from "../src/Grammar";
import { ramp, repeat, channel, parallel, interpolate, cycle } from "@perry-rylance/midi-macros";

const ppqn = 480;

// TODO: 480 / 128 is floating and I believe that causes silent failure

const kick = () => {

    const pitch = 29;

    return [
        new NoteOnEvent().key(pitch),
        ...ramp(
            ppqn,
            ppqn / 4,
            0,
            1,
            (delta, x) => new PitchWheelEvent(
                delta, 
                2,
                Math.pow(((1 - x) * (1 - x)), 4)
            )
        ),
        new NoteOffEvent().key(pitch), // TODO: Not really needed if the bass note stays the same?
    ];

};

const file = new File()
    .tracks([
        new Track().events([
            new AdsrWorkaroundGlobalEvent(0, true),
            ...( [0, 1, 2].map(channel => new AdsrWorkaroundChannelEvent(0, channel, true)) )
        ]),
        new Track().events(
            channel(2, [
                ...parallel([
                    [
                        new SawEvent().enabled(false),
                        new PulseEvent().enabled(true),
                        new PulseWidthEvent().value(0x3F),
                        ...PitchBendRangeEventsFactory.create(2, 48),
                        ...repeat(8, kick())
                    ],
                    cycle(
                        ppqn * 8, 
                        8 * 120,
                        ppqn * 8,
                        (delta, value) => new PulseWidthEvent(delta).value( 
                            Math.round(
                                0x3F + Math.sin(value) * 0x2F
                            )
                        )
                    )
                ])
            ]),
            
            // channel(2,
            //     parallel([
            //         [
            //             new SawEvent().enabled(false),
            //             new PulseEvent().enabled(true),
            //             new PulseWidthEvent().value(0x3F),
            //             ...PitchBendRangeEventsFactory.create(2, 48),
            //             ...repeat(8, kick())
            //         ],
            //         cycle(
            //             ppqn * 8, 
            //             8 * 120,
            //             ppqn * 8,
            //             (delta, value) => new PulseWidthEvent(delta).value( 
            //                 Math.round(
            //                     0x3F + Math.sin(value) * 0x2F
            //                 )
            //             )
            //         )
            //     ])
            // )
            
        )
    ]);

file.resolution.ticksPerQuarterNote = ppqn;

export default file;
