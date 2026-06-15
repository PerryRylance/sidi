# sidi-web agent instructions

## reSID

### Compilation
Your task is to compile a WASM build of libresidfp, to JS this must expose Module.SID class with bindings for the [methods on the SID class](https://libsidplayfp.github.io/libresidfp/html/classreSIDfp_1_1SID.html) provided by libresidfp, exposing the class methods via `EMSCRIPTEN_BINDINGS`.

First we are going to need a `ts-jest` test, this shall import our compiled WASM, then test that all the expected methods exist on the compiled SID class:

- setChipModel
- getChipModel
- setCombinedWaveforms
- reset
- input
- read
- write
- setSamplingParameters
- clock
- clockSilent
- setFilter6581Curve
- setFilter6581Range
- setFilter8580Curve
- enableFilter
- enableOld6581caps

### Interface
Next we are going to need enums representing reSIDfp's enums, these are all numeric:

- ChipModel
- CombinedWaveforms
- SamplingMethod
