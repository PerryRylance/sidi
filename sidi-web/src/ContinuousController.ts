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

    // Engine-level "ADSR bug" workaround (see MidiInterpreter's ADSR priming/hold logic):
    // AdsrWorkaroundGlobal arms the workaround on any channel; AdsrWorkaroundChannel then opts
    // a specific oscillator in/out of actually using it. Global must be armed for the per-channel
    // switch to have any effect. Mirrors sidi-vst's ContinuousController.h.
    AdsrWorkaroundGlobal: 93,
    AdsrWorkaroundChannel: 94,

    MainVolume: 7,
} as const;

export default ContinuousController;
