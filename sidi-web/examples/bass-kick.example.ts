import { File, NoteOffEvent, NoteOnEvent, PitchBendRangeEventsFactory, PitchWheelEvent, Track } from "@perry-rylance/midi";
import { AdsrWorkaroundChannelEvent, AdsrWorkaroundGlobalEvent, PulseEvent, SawEvent } from "../src/Grammar";
import { ramp, repeat, channel } from "@perry-rylance/midi-macros";

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
            (delta, x) => new PitchWheelEvent(delta).amount(Math.random())
            // (delta, x) => new PitchWheelEvent(
            //     delta, 
            //     channel,
            //     Math.pow(((1 - x) * (1 - x)), 30)
            // )
        ),
        new NoteOffEvent().key(pitch) // TODO: Not really needed if the bass note stays the same?
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
                new SawEvent().enabled(false),
                new PulseEvent().enabled(true),
                ...PitchBendRangeEventsFactory.create(2, 12),
                ...kick()
            ])
        )
    ]);

file.resolution.ticksPerQuarterNote = ppqn;

export default file;
