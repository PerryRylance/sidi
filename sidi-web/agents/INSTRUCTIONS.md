# sidi-web agent instructions

## reSID

### Compilation
Your task is to compile a WASM build of libresidfp, to JS this must expose Module.SID class with bindings for the [methods on the SID class](https://libsidplayfp.github.io/libresidfp/html/classreSIDfp_1_1SID.html) provided by libresidfp, exposing the class methods via `EMSCRIPTEN_BINDINGS`.

libresidfp's source lives in `libresidfp-main` at the repo root (a git submodule, shared with `sidi-vst`). Before building, run `node scripts/setup-libresidfp.js` from the repo root to apply the Emscripten-specific patch and generate the config headers. The embind wrapper is `agents/SID_bindings.cpp`; `npm run build:wasm` compiles it into `compiled/libresidfp.js`.

`tests/libresidfp.test.ts` (a Vitest test, run by `npm test`) imports our compiled WASM and tests that all the expected methods exist on the compiled SID class. It needs `compiled/libresidfp.js` to exist, so run `npm run build:wasm` first. Its method list is hard-coded, so keep it in sync with the list below:

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
The module also exposes enums representing reSIDfp's enums (declared in `compiled/libresidfp.d.ts`), these are all numeric:

- ChipModel
- CombinedWaveforms
- SamplingMethod
