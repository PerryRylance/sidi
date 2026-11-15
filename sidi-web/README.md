# @perry-rylance/sidi

## Usage

SIDI plays MIDI through an emulated SID chip, inside an [AudioWorklet](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet) so the emulation runs off the main thread. The worklet is one self-contained script, which the browser has to be pointed at by URL.

```
npm install @perry-rylance/sidi
```

The worklet and helper run in the browser. If you use the library entry (`Processor` and friends) from Node, it supports the LTS lines: Node 22 (22.11 or later), 24 and 26.

```ts
import { createSidiNode } from "@perry-rylance/sidi/helper";

const context = new AudioContext();
const midi = await (await fetch("/song.mid")).arrayBuffer();

const node = await createSidiNode(context, midi, { loop: true });

node.connect(context.destination);
await context.resume(); // NB: Browsers only allow this after a user gesture, e.g. a click
```

`midi` is the raw bytes of a MIDI file, as an `ArrayBuffer`. You don't need to parse it first. If you want to build or edit MIDI in your app, [`@perry-rylance/midi`](https://www.npmjs.com/package/@perry-rylance/midi) pairs with this.

### Without the helper

If your build setup can't resolve the worklet for you, copy it somewhere your server serves statically, using the `sidi-publish` command with a destination path:

```
npx sidi-publish public/
```

- If the destination is a directory (it's created if it doesn't exist), the file keeps its name: `public/SidiAudioWorkletProcessor.js`.
- If the destination ends in `.js` or `.mjs`, it's written to exactly that path: `npx sidi-publish public/js/sidi.js`.

Then load it from wherever your server exposes it. The helper accepts the URL:

```ts
const node = await createSidiNode(context, midi, { workletUrl: "/SidiAudioWorkletProcessor.js" });
```

or you can skip the helper entirely, since the worklet is a standard AudioWorklet module:

```ts
await context.audioWorklet.addModule("/SidiAudioWorkletProcessor.js");

const node = new AudioWorkletNode(context, "sidi-audio-worklet-processor", {
    processorOptions: { midi, loop: true },
});
```

If you build the `AudioWorkletNode` yourself, the worklet reports over `node.port`: `{ type: "ready" }` once the emulator has loaded, or `{ type: "error", message }` if it fails. Listen for these, because an async failure inside a worklet is otherwise silent. A processor that throws while starting (for example on invalid MIDI data) fires `node.onprocessorerror` instead.

The copied file is a snapshot of the installed version, so run `sidi-publish` again after upgrading the package. To do that automatically, add it to a script in your own `package.json`, for example `"postinstall": "sidi-publish public/"`.

### API

All exported from `@perry-rylance/sidi/helper`:

| Export | |
|---|---|
| `createSidiNode(context, midi, options?)` | Loads the worklet into `context` (once per context) and resolves to an `AudioWorkletNode` playing `midi`, once the emulator has finished loading. Rejects with a `SidiWorkletError` if the worklet fails to start (see [Errors](#errors)). |
| `loadSidiWorklet(context, workletUrl?)` | Just the loading step, if you want to construct the `AudioWorkletNode` yourself. Cached per context and URL; a failed load can be retried. |
| `getWorkletUrl()` | The default worklet `URL`. |
| `PROCESSOR_NAME` | The registered processor name, `"sidi-audio-worklet-processor"`. |
| `SidiWorkletError` | The error `createSidiNode` rejects with. |

`options`:

| Option | Default | |
|---|---|---|
| `loop` | `false` | Restart the file when it ends. |
| `workletUrl` | `getWorkletUrl()` | Load the worklet from this URL instead. |
| `readyTimeoutMs` | `10000` | How long to wait for the worklet to report ready before rejecting. `Infinity` waits forever. |

### Errors

Failures inside an AudioWorklet are easy to miss: an async error there doesn't reject `addModule()` and doesn't fire `processorerror`, so the node would just sit there playing silence. The worklet reports its own startup success or failure, and `createSidiNode` turns that into a promise you can `await`, so there's nothing to wire up:

```ts
try {
    const node = await createSidiNode(context, midi);
    node.connect(context.destination);
} catch (error) {
    if (error instanceof SidiWorkletError) // the emulator failed to load, the MIDI data was invalid, or the worklet never reported ready
        console.error(error.message);
}
```

"Never reported ready" most often means the worklet file is from an older version than the helper, for example a copy made by `sidi-publish` before an upgrade.

## Building

### reSID (libresidfp)

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
- `npm test` runs the unit tests against `src/`.
- `npm run typecheck` type-checks the whole project.
- `npm run test:dist` builds the package, then checks the built output the way a consumer would: `attw` for type resolution, then real Chromium, Firefox and WebKit, and real Node on each supported version: 22, 24 and 26 (the worklet and library load and render, the Vite asset URL resolves, the `sidi-publish` CLI works). The browser and Node tests run in Docker containers (`docker compose`), so you'll need Docker running. `npm run test:dist:node` runs just the Node matrix.

`npm publish` runs all three first (`prepublishOnly`), and stops if any fail.
