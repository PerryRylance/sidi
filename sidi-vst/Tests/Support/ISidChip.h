#pragma once

#include <cstdint>

/**
    The seam SidRegisterInterpreter depends on instead of reSIDfp::SID
    directly. reSIDfp::SID has no virtual methods, so it can't be subclassed
    and overridden for testing - this interface exists to make that possible.

    Kept to exactly what the interpreter needs (register writes only). The
    timing loop that will eventually drive reSIDfp::SID::clock() belongs to
    a different seam, ported alongside Driver.
*/
class ISidChip
{
public:
    virtual ~ISidChip() = default;

    virtual void write (int offset, uint8_t value) = 0;
};
