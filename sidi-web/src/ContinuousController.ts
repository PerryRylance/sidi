const ContinuousController = {
    PulseWidth: 75,

    Attack: 76,
    Decay: 77,
    Sustain: 78,
    Release: 79,

    Tri: 80,
    Saw: 81,
    Pulse: 82,
    Noise: 83,

    Gate: 84,
    Sync: 85,
    Ring: 86,
    Test: 87,

    FilterCutoff: 74,
    FilterResonance: 71,
    FilterEnable: 88,

    FilterLowPass: 89,
    FilterBandPass: 90,
    FilterHighPass: 91,

    Oscillator3Mute: 92,

    MainVolume: 7,
} as const;

export default ContinuousController;
