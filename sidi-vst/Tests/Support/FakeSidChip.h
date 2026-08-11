#pragma once

#include "../../Source/ISidChip.h"
#include <array>
#include <cstdint>
#include <vector>

/**
    Pure in-memory test double for the register-mapping contract tests -
    no reSIDfp dependency, no DSP, no write-only-register decay modelling
    to fight in assertions. Real reSIDfp::SID is exercised separately by
    integration-level tests instead.
*/
class FakeSidChip : public ISidChip
{
public:
    struct Write
    {
        int offset;
        uint8_t value;
    };

    std::array<uint8_t, 32> registers {};
    std::vector<Write> writeLog;

    void write (int offset, uint8_t value) override
    {
        registers[(size_t) offset] = value;
        writeLog.push_back ({ offset, value });
    }

    // NB: Fills buf with a monotonically increasing counter (unique across the
    // whole test, not just this call) instead of silence/zero, so tests can tell
    // exactly which clock() call produced which sample in an output buffer purely
    // by its value - no DSP needed to make the segmentation observable.
    int clock (int16_t* buf, int numSamples) override
    {
        clockLog.push_back (numSamples);

        for (int i = 0; i < numSamples; ++i)
            buf[i] = (int16_t) (nextSampleValue++);

        return numSamples;
    }

    std::vector<int> clockLog;
    int nextSampleValue = 0;
};
