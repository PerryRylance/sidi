#pragma once

#include "FakeSidChip.h"
#include "SidRegisterInterpreter.h"
#include <juce_core/juce_core.h>
#include <cstdint>
#include <vector>

// A CC number/mask/name triple representing one on-off bit within a shared
// SID register (eg. one waveform select bit, one filter routing bit).
struct ControlBit
{
    int controller;
    uint8_t mask;
    const char* name;
};

// Drives every combination of a set of independent on/off control bits
// (the power set), asserting that register `address` ends up holding
// exactly the OR of the selected masks. Mirrors the testControlRegisterBits/
// testFilterModeBits helpers in sidi-web/tests/interpreter.test.ts. A fresh
// FakeSidChip/SidRegisterInterpreter pair is used per combination, matching
// how the JS test constructs a fresh driver per test.each row.
inline void expectControlBitPowerSet (juce::UnitTest& test,
                                       int channel,
                                       int address,
                                       const std::vector<ControlBit>& bits)
{
    const int totalCombinations = 1 << (int) bits.size();

    for (int combination = 0; combination < totalCombinations; ++combination)
    {
        juce::StringArray selectedNames;
        int expectedMask = 0;

        for (size_t bitIndex = 0; bitIndex < bits.size(); ++bitIndex)
        {
            if ((combination & (1 << bitIndex)) != 0)
            {
                expectedMask |= bits[bitIndex].mask;
                selectedNames.add (bits[bitIndex].name);
            }
        }

        FakeSidChip sid;
        SidRegisterInterpreter interpreter (sid);

        for (auto& bit : bits)
        {
            const bool isSelected = (expectedMask & bit.mask) != 0;
            interpreter.controller (channel, bit.controller, isSelected ? 127 : 0);
        }

        const juce::String description = selectedNames.isEmpty()
                                              ? juce::String ("none")
                                              : selectedNames.joinIntoString (" + ");

        test.expectEquals ((int) sid.registers[(size_t) address], expectedMask,
                            "writes expected bits for combination: " + description);
    }
}
