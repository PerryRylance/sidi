#pragma once

#include "ISidChip.h"
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
};
