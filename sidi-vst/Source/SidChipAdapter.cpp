#include "SidChipAdapter.h"
#include "SID.h"

SidChipAdapter::SidChipAdapter (reSIDfp::SID& sidChip)
    : sid (sidChip)
{
    // NB: Zero everything first
    for (int i = 0; i < 18; ++i)
        write (i, 0);

    for (int i = 0; i < 3; ++i)
    {
        write ((0x7 * i) + 0x4, DEFAULT_CONTROL_REGISTER);
        write ((0x7 * i) + 0x6, DEFAULT_SUSTAIN_RELEASE);
    }

    // NB: Full volume
    write (0x18, 0xf);
}

void SidChipAdapter::write (int offset, uint8_t value)
{
    sid.write (offset, value);

    if (offset >= 0 && offset < numRegisters)
        lastWrittenValues[(size_t) offset].store (value, std::memory_order_relaxed);
}

uint8_t SidChipAdapter::getRegisterValue (int offset) const
{
    if (offset < 0 || offset >= numRegisters)
        return 0;

    return lastWrittenValues[(size_t) offset].load (std::memory_order_relaxed);
}
