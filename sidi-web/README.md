# @perry-rylance/sidi

## Usage



## reSID (libresidfp)

`libresidfp-main` (at the repo root) is a git submodule of [libsidplayfp/libresidfp](https://github.com/libsidplayfp/libresidfp), pinned to a specific commit. After cloning, or after resetting the submodule, run from the repo root:
```
git submodule update --init
node scripts/setup-libresidfp.js
```
This applies the Emscripten single-threaded filter-init patch and generates the config headers (`siddefs-fp.h`, `residfp/sidversion.h`) that libresidfp's autotools build would normally produce.

### Building the WASM module
Requires an [Emscripten SDK](https://emscripten.org/docs/getting_started/downloads.html) on your `PATH`. From `sidi-web`, run:
```
npm run build:wasm
```
This compiles `agents/SID_bindings.cpp` against `../libresidfp-main/src` into `compiled/libresidfp.js`.

## Tests

### Requirements
- You'll need to have run `npm install`
- The compiled WASM module must exist at `compiled/libresidfp.js` (see above)

### Running
Run `npm test`
