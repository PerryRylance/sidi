import { AdsrWorkaroundChannelEvent, AdsrWorkaroundGlobalEvent, AttackEvent, DecayEvent, MidiEventGenerator, NoiseEvent, PulseEvent, ReleaseEvent, SawEvent, SustainEvent, TriangleEvent } from "../src/Grammar";
import { ContinuousControllerValue } from "../src/ContinuousController";
import { ControllerEvent, Event, File, NoteOffEvent, NoteOnEvent, PitchBendRangeEventsFactory, PitchWheelEvent, Track } from "@perry-rylance/midi";
import { ramp } from "@perry-rylance/midi-macros";

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
            new NoteOnEvent(0, oscillator, 12 + 36), // TODO: Does the 0hz mess it up or is that a frequency floor
            ...ramp(
                ppqn / 2, 
                128, 
                0,
                -1,
                (delta, value) => new PitchWheelEvent(delta, oscillator, value)
            ),
            new NoteOffEvent(0, oscillator, 12 + 36)
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
    new AdsrWorkaroundChannelEvent(0, oscillators.percussion, true) // TODO: Delta re-structure? Make it a delta(amount: number): this so you can chain? Could do same with the channel. Or everything for that matter. It would read much easier and be compatible... Could do events() and tracks() too if it's possible to make them callable
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
