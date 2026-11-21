import { ChannelAftertouchEvent, File, NoteOffEvent, NoteOnEvent, PitchBendRangeEventsFactory, PitchWheelEvent, SetTempoEvent, Track } from "@perry-rylance/midi";
import { AdsrWorkaroundChannelEvent, AdsrWorkaroundGlobalEvent, DecayEvent, FilterBandPassEvent, FilterCutoffEvent, FilterEnableEvent, FilterLowPassEvent, FilterResonanceEvent, NoiseEvent, PulseEvent, PulseWidthEvent, SawEvent, SustainEvent, TriangleEvent } from "../src/Grammar";
import { ramp, repeat, channel, parallel, interpolate, cycle } from "@perry-rylance/midi-macros";

const bpm = 185;
const ppqn = 480;
const root = 29;

const percussion = {
    kick: () => {

        const pitch = 29;

        return [
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
        ];

    },
    snare: (delta: number = 0) => {

        const pitch = 53;

        return [
            new PulseEvent().enabled(false),

            ...PitchBendRangeEventsFactory.create(2, 12),
            new DecayEvent().value(0x4F),
            new SustainEvent().value(0),

            new FilterEnableEvent().enabled(true),
            new FilterLowPassEvent().enabled(true),
            new FilterBandPassEvent().enabled(true),
            new FilterResonanceEvent().value(0x7F),

            new NoteOnEvent().key(pitch).delta(delta),
            ...ramp(ppqn / 2, 24 * 2, 0x3F, 0x1A, (delta, value, index) => [
                new FilterCutoffEvent(0, Math.round(value)),
                ...(index % 2 === 0 ?
                [
                    new NoiseEvent(delta).enabled(false),
                    new PitchWheelEvent().amount(0),
                    new TriangleEvent(0).enabled(true)
                ] :
                [
                    new FilterCutoffEvent(0, Math.round(value)),
                    new TriangleEvent(delta).enabled(false),
                    new PitchWheelEvent().amount(1),
                    new NoiseEvent(0).enabled(true)
                ])
            ]),
            new NoteOffEvent().key(pitch),
            new ChannelAftertouchEvent(ppqn / 2),

            new FilterLowPassEvent().enabled(false),
            new FilterBandPassEvent().enabled(false),
            new FilterEnableEvent().enabled(false),

            new NoiseEvent().enabled(false),
            new PulseEvent().enabled(true)
        ];
        
    }
}

const bass = {
    init: () => [
        new SawEvent().enabled(false),
        new PulseEvent().enabled(true),
        new PulseWidthEvent().value(0x3F),
        ...PitchBendRangeEventsFactory.create(2, 48),
    ],
    ostinato: () => [0, 1, null, 0, 1, 0, null, 1].flatMap((octave, index, arr) => {

        if(octave === null)
            return [];

        const quaver = ppqn / 2;
        const afterRest = index > 0 && arr[index - 1] === null;
        const pitch = root + octave * 12;

        return [
            new NoteOnEvent(afterRest ? quaver : 0).key(pitch),
            new NoteOffEvent(quaver).key(pitch)
        ];
    }),
    pulseWaveCycle: (bars: number) => cycle(
        ppqn * 4 * bars, 
        8 * 60,
        ppqn * 8,
        (delta, value) => new PulseWidthEvent(delta).value( 
            Math.round(
                0x3F + Math.sin(value) * 0x2F
            )
        )
    )
};

const file = new File()
    .tracks([
        new Track().events([
            new SetTempoEvent().bpm(bpm),
            new AdsrWorkaroundGlobalEvent(0, true),
            ...( [0, 1, 2].map(channel => new AdsrWorkaroundChannelEvent(0, channel, true)) )
        ]),
        // NB: Lead
        // NB: Snare, hats, chords
        new Track().events(
            channel(1, 
                repeat(4, () => percussion.snare(ppqn))
            )
        ),
        // NB: Bass and kick
        // new Track().events(
        //     channel(2, 
        //         parallel([
        //             bass.init(),
        //             repeat(2, bass.ostinato),
        //             bass.pulseWaveCycle(2),
        //             repeat(8, percussion.kick)
        //         ])
        //     )
        // )
    ]);

file.resolution.ticksPerQuarterNote = ppqn;

export default file;
