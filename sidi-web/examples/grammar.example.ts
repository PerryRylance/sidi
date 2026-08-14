import { AdsrWorkaroundChannelEvent, AdsrWorkaroundGlobalEvent, AttackEvent, DecayEvent, MidiEventGenerator, NoiseEvent, PulseEvent, ReleaseEvent, SawEvent, SustainEvent, TriangleEvent } from "../src/Grammar";
import { ContinuousControllerValue } from "../src/ContinuousController";
import { ControllerEvent, Event, File, NoteOffEvent, NoteOnEvent, PitchBendRangeEventsFactory, PitchWheelEvent, Track } from "@perry-rylance/midi";

const ppqn = 960;

const oscillators = {
    lead: 0,
    bass: 1,
    percussion: 2
} as const;

const reset = (oscillator: number): Event[] => [
    new NoiseEvent(0, oscillator, false),
    new PulseEvent(0, oscillator, false),
    new TriangleEvent(0, oscillator, false),
    new SawEvent(0, oscillator, false),
    new AttackEvent(0, oscillator, 0),
    new DecayEvent(0, oscillator, 0),
    new SustainEvent(0, oscillator, 0x7F),
    new ReleaseEvent(0, oscillator, 0)
];

const ramp = (generator: (delta: number, value: number) => Event, start: number, end: number, duration: number, steps?: number): Event[] => {

    const result: Event[] = [];

    if(!steps)
        steps = Math.round(duration / (ppqn / 64));

    // TODO: Handle drift / floating point accumulation
    const delta = Math.round(duration / steps);
    
    for(let i = 0; i < steps; i++)
    {
        const interpolation = i / (steps - 1);
        const value = (end * interpolation) - (start * (1 - interpolation));
        const event = generator(delta, value);

        result.push(event);
    }

    return result;

}

const patches: Record<string, Record<string, MidiEventGenerator>> = {
    percussion: {
        kick: (oscillator: number) => [
            // NB: Init the sound
            ...reset(oscillator).filter(event => !(event instanceof TriangleEvent)),
            ...PitchBendRangeEventsFactory.create(oscillator, 36),
            new TriangleEvent(0, oscillator, true),
            new DecayEvent(0, oscillator, 50),
            new SustainEvent(0, oscillator, 0),

            // NB: Produce the sound
            new NoteOnEvent(0, oscillator, 36), // TODO: Does the 0hz mess it up or is that a frequency floor
            ...ramp((delta, amount) => new PitchWheelEvent(delta, oscillator, amount), 0, -1, ppqn / 2),
            new NoteOffEvent(ppqn / 2, oscillator, 36)
        ],
        snare: () => [],
        hihat: (open: boolean = false) => []
    }
};

const patterns: Record<string, Record<string, Event[]>> = {
    percussion: {
        kicks: [0, 1, 2, 3].flatMap(_ => patches.percussion.kick(oscillators.percussion))
    }
};

const header: Track = new Track();

header.events = [
    new AdsrWorkaroundGlobalEvent(0, true),
    new AdsrWorkaroundChannelEvent(0, oscillators.percussion, true) // TODO: Delta re-structure? Make it a delta(amount: number): this so you can chain? Could do same with the channel. Or everything for that matter. It would read much easier and be compatible...
];

const tracks: Track[] = [
    (() => {
        const track = new Track();
        track.events = [...patterns.percussion.kicks];
        return track;
    })()
];

const file: File = new File();

file.tracks = [
    header,
    ...tracks
];

export default file;
