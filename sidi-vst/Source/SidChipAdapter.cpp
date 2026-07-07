#include "SidChipAdapter.h"
#include "SID.h"

SidChipAdapter::SidChipAdapter (reSIDfp::SID& sidChip)
    : sid (sidChip)
{
}

void SidChipAdapter::write (int offset, uint8_t value)
{
    sid.write (offset, value);
}
