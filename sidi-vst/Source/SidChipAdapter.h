#pragma once

#include "ISidChip.h"

namespace reSIDfp { class SID; }

/**
    Adapts reSIDfp::SID to the ISidChip seam MidiInterpreter depends on.
    reSIDfp::SID has no virtual methods (see ISidChip.h), so it can't
    implement the interface directly - this forwards register writes to it.
*/
class SidChipAdapter : public ISidChip
{
public:
    explicit SidChipAdapter (reSIDfp::SID& sidChip);

    void write (int offset, uint8_t value) override;

private:
    reSIDfp::SID& sid;
};
