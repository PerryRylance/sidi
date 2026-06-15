#include <emscripten/bind.h>
#include <emscripten/val.h>
#include "SID.h"
#include <vector>
#include <string>

using namespace emscripten;

int sid_clock(reSIDfp::SID& self, emscripten::val arg1, emscripten::val arg2) {
    bool has_arg2 = !arg2.isUndefined() && !arg2.isNull();
    
    if (!has_arg2) {
        // clock(TypedArray)
        if (arg1.instanceof(emscripten::val::global("Int16Array"))) {
            int len = arg1["length"].as<int>();
            std::vector<int16_t> temp_buf(len);
            int cycles = self.clock(temp_buf.data(), len);
            emscripten::val memoryView = emscripten::val(emscripten::typed_memory_view(len, temp_buf.data()));
            arg1.call<void>("set", memoryView);
            return cycles;
        }
        return 0;
    }
    
    bool arg1_is_number = arg1.typeOf().as<std::string>() == "number";
    bool arg2_is_number = arg2.typeOf().as<std::string>() == "number";
    bool arg1_is_int16array = arg1.instanceof(emscripten::val::global("Int16Array"));
    bool arg2_is_int16array = arg2.instanceof(emscripten::val::global("Int16Array"));
    
    // Case 1: clock(cycles, TypedArray)
    if (arg1_is_number && arg2_is_int16array) {
        unsigned int cycles = arg1.as<unsigned int>();
        int len = arg2["length"].as<int>();
        std::vector<int16_t> temp_buf(len);
        int samples = self.clock(cycles, temp_buf.data());
        if (samples > 0) {
            emscripten::val memoryView = emscripten::val(emscripten::typed_memory_view(samples, temp_buf.data()));
            arg2.call<void>("set", memoryView);
        }
        return samples;
    }
    
    // Case 2: clock(TypedArray, bufSize)
    if (arg1_is_int16array && arg2_is_number) {
        int bufSize = arg2.as<int>();
        std::vector<int16_t> temp_buf(bufSize);
        int cycles = self.clock(temp_buf.data(), bufSize);
        emscripten::val memoryView = emscripten::val(emscripten::typed_memory_view(bufSize, temp_buf.data()));
        arg1.call<void>("set", memoryView);
        return cycles;
    }
    
    // Case 3: Both are numbers (raw pointers)
    if (arg1_is_number && arg2_is_number) {
        double val1 = arg1.as<double>();
        double val2 = arg2.as<double>();
        // Distinguish based on heuristic
        if (val1 < 1000000.0) {
            // clock(cycles, buf_ptr)
            unsigned int cycles = static_cast<unsigned int>(val1);
            int16_t* buf = reinterpret_cast<int16_t*>(static_cast<intptr_t>(val2));
            return self.clock(cycles, buf);
        } else {
            // clock(buf_ptr, bufSize)
            int16_t* buf = reinterpret_cast<int16_t*>(static_cast<intptr_t>(val1));
            int bufSize = static_cast<int>(val2);
            return self.clock(buf, bufSize);
        }
    }
    
    return 0;
}

EMSCRIPTEN_BINDINGS(residfp) {
    enum_<reSIDfp::ChipModel>("ChipModel")
        .value("MOS6581", reSIDfp::MOS6581)
        .value("CSG8580", reSIDfp::CSG8580)
        ;

    enum_<reSIDfp::CombinedWaveforms>("CombinedWaveforms")
        .value("AVERAGE", reSIDfp::AVERAGE)
        .value("WEAK", reSIDfp::WEAK)
        .value("STRONG", reSIDfp::STRONG)
        ;

    enum_<reSIDfp::SamplingMethod>("SamplingMethod")
        .value("DECIMATE", reSIDfp::DECIMATE)
        .value("RESAMPLE", reSIDfp::RESAMPLE)
        .value("NONE", reSIDfp::NONE)
        ;

    class_<reSIDfp::SID>("SID")
        .constructor<>(&std::make_unique<reSIDfp::SID>)
        .function("setChipModel", &reSIDfp::SID::setChipModel)
        .function("getChipModel", &reSIDfp::SID::getChipModel)
        .function("setCombinedWaveforms", &reSIDfp::SID::setCombinedWaveforms)
        .function("reset", &reSIDfp::SID::reset)
        .function("input", &reSIDfp::SID::input)
        .function("read", &reSIDfp::SID::read)
        .function("write", &reSIDfp::SID::write)
        .function("setSamplingParameters", &reSIDfp::SID::setSamplingParameters)
        .function("clock", &sid_clock)
        .function("clockSilent", &reSIDfp::SID::clockSilent)
        .function("setFilter6581Curve", &reSIDfp::SID::setFilter6581Curve)
        .function("setFilter6581Range", &reSIDfp::SID::setFilter6581Range)
        .function("setFilter8580Curve", &reSIDfp::SID::setFilter8580Curve)
        .function("enableFilter", &reSIDfp::SID::enableFilter)
        .function("enableOld6581caps", &reSIDfp::SID::enableOld6581caps)
        ;
}
