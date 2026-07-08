#include "SidChipAdapter.h"
#include "SID.h"

SidChipAdapter::SidChipAdapter (reSIDfp::SID& sidChip)
    : sid (sidChip)
{
    // NB: Zero everything first
    for (int i = 0; i < 18; ++i)
        sid.write(i, 0);

    for (int i = 0; i < 3; ++i)
        sid.write((0x7 * i) + 0x6, 0xf0); // NB: Full sustain, no release

    // NB: Full volume
    sid.write(0x18, 0xf);
}

void SidChipAdapter::write (int offset, uint8_t value)
{
    sid.write (offset, value);
}
