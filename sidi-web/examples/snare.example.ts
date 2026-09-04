import { ChannelAftertouchEvent, File, NoteOffEvent, NoteOnEvent, PitchBendRangeEventsFactory, PitchWheelEvent, Track } from "@perry-rylance/midi";
import { AdsrWorkaroundChannelEvent, AdsrWorkaroundGlobalEvent, DecayEvent, FilterBandPassEvent, FilterCutoffEvent, FilterEnableEvent, FilterHighPassEvent, FilterLowPassEvent, FilterResonanceEvent, NoiseEvent, SawEvent, SustainEvent, TriangleEvent } from "../src/Grammar";
import { channel, interpolate, ramp, repeat } from "@perry-rylance/midi-macros";

const ppqn = 480;

const snare = () => {

    const pitch = 53;

    return [
        new NoteOnEvent().key(pitch),
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
        new ChannelAftertouchEvent(ppqn / 2)
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
            ...channel(2, [
                
                new SawEvent().enabled(false),
                ...PitchBendRangeEventsFactory.create(2, 12),
                new DecayEvent().value(0x4F),
                new SustainEvent().value(0),
                new FilterEnableEvent().enabled(true),

                ...repeat(8, snare())
            ])
        ])
    ]);

file.resolution.ticksPerQuarterNote = ppqn;

export default file;
