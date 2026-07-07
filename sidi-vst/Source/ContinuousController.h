#pragma once

// Mirrors sidi-web/src/ContinuousController.ts - the MIDI CC assignment
// contract shared between sidi-web and sidi-vst.
namespace ContinuousController
{
    constexpr int PulseWidth = 75;

    constexpr int Attack = 76;
    constexpr int Decay = 77;
    constexpr int Sustain = 78;
    constexpr int Release = 79;

    constexpr int Tri = 80;
    constexpr int Saw = 81;
    constexpr int Pulse = 82;
    constexpr int Noise = 83;

    constexpr int Gate = 84;
    constexpr int Sync = 85;
    constexpr int Ring = 86;
    constexpr int Test = 87;

    constexpr int FilterCutoff = 74;
    constexpr int FilterResonance = 71;
    constexpr int FilterEnable = 88;

    constexpr int FilterLowPass = 89;
    constexpr int FilterBandPass = 90;
    constexpr int FilterHighPass = 91;

    constexpr int Oscillator3Mute = 92;

    constexpr int MainVolume = 7;

    // Standard MIDI RPN / Data Entry controller numbers, not SID-specific.
    constexpr int RpnMsb = 101;
    constexpr int RpnLsb = 100;
    constexpr int DataEntryMsb = 6;
}
