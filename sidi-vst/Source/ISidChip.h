#pragma once

#include <cstdint>

/**
    The seam MidiInterpreter and AdsrWorkaroundEngine depend on instead of
    reSIDfp::SID directly. reSIDfp::SID has no virtual methods, so it can't
    be subclassed and overridden for testing - this interface exists to
    make that possible.
*/
class ISidChip
{
public:
    virtual ~ISidChip() = default;

    virtual void write (int offset, uint8_t value) = 0;

    // NB: Mirrors reSIDfp::SID::clock(int16_t*, int) - buf must have room for
    // at least numSamples int16_t's. Returns the number of c64 clocks run
    // (see SID.h), not the number of samples produced; callers that only
    // care about filling buf with numSamples samples of audio can ignore it.
    virtual int clock (int16_t* buf, int numSamples) = 0;
};
