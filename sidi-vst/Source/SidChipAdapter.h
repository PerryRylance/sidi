#pragma once

#include "ISidChip.h"
#include <array>
#include <atomic>

namespace reSIDfp { class SID; }

/**
    Adapts reSIDfp::SID to the ISidChip seam MidiInterpreter depends on.
    reSIDfp::SID has no virtual methods (see ISidChip.h), so it can't
    implement the interface directly - this forwards register writes to it.
*/
class SidChipAdapter : public ISidChip
{
public:
    // NB: SID registers span 0x00-0x18 (25 registers)
    static constexpr int numRegisters = 0x19;

    // NB: Mirrors sidi-web/src/SidChipAdapter.ts's DEFAULT_CONTROL_REGISTER/
    // DEFAULT_SUSTAIN_RELEASE - the real chip's power-on state, passed to
    // MidiInterpreter explicitly so its shadow registers agree with what's
    // actually on the chip (see MidiInterpreter's constructor).
    static constexpr uint8_t DEFAULT_CONTROL_REGISTER = 0x20; // NB: Saw waveform, gate off
    static constexpr uint8_t DEFAULT_SUSTAIN_RELEASE = 0xF0;  // NB: Full sustain, no release

    explicit SidChipAdapter (reSIDfp::SID& sidChip);

    void write (int offset, uint8_t value) override;

    // NB: Safe to call from any thread; used by the editor to display
    // live register state without touching the audio thread's sid object.
    uint8_t getRegisterValue (int offset) const;

private:
    reSIDfp::SID& sid;
    std::array<std::atomic<uint8_t>, numRegisters> lastWrittenValues {};
};
