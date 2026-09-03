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

const ease = {
    log: (x: number, k = 100) => {
        x = Math.max(0, Math.min(1, x));
        return Math.log(1 + k * x) / Math.log(1 + k);
    }
};

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
        kick: (oscillator: number) => {
            const startingPitch = 0x50;
            const bendRage = 0x4F;
            const decayTime = 24;

            return [
                // NB: Init the sound
                ...reset(oscillator).filter(event => !(event instanceof TriangleEvent)),
                ...PitchBendRangeEventsFactory.create(oscillator, bendRage),
                new TriangleEvent(0, oscillator, true),
                new DecayEvent(0, oscillator, decayTime),
                new SustainEvent(0, oscillator, 0),

                // NB: Produce the sound
                new NoteOnEvent(0, oscillator, startingPitch), // TODO: Does the 0hz mess it up or is that a frequency floor
                ...ramp(
                    ppqn / 4, 
                    128, 
                    0,
                    1,
                    (delta, value) => new PitchWheelEvent(delta, oscillator, -ease.log(value, 10))
                ),
                new NoteOffEvent(ppqn / 4, oscillator, startingPitch),
                new PitchWheelEvent(0, oscillator, 0)
            ]
        },
        snare: () => [],
        hihat: (open: boolean = false) => []
    }
};

const patterns: Record<string, Record<string, Event[]>> = {
    percussion: {
        kicks: [0, 1, 2, 3, 4, 5, 6, 7].flatMap(_ => patches.percussion.kick(oscillators.percussion))
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
