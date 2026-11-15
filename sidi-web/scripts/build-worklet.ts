import path from "path";
import fs from "fs";
import { build } from "vite";
import { rolldown } from "rolldown";
import { dts } from "rolldown-plugin-dts";

const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "src");
const ENTRY = path.join(SRC_DIR, "SidiAudioWorkletProcessor.ts");
const OUT_DIR = path.join(ROOT, "dist");
const OUT_FILE = "SidiAudioWorkletProcessor.js";
const LIBRARY_ENTRY = path.join(SRC_DIR, "index.ts");
// NB: Explicit extensions so Node never has to guess the module format (package.json has no "type").
const LIBRARY_OUT_FILES = { es: "index.mjs", cjs: "index.cjs" } as const;

async function buildScript() {
    await build({
        configFile: false,
        build: {
            lib: {
                entry: ENTRY,
                name: "SidiAudioWorkletProcessor",
                formats: ["iife"],
                fileName: () => OUT_FILE,
            },
            outDir: OUT_DIR,
            emptyOutDir: false,
            minify: false,
            rollupOptions: {
                // NB: libresidfp.js has Node-only fallback paths (guarded by ENVIRONMENT_IS_NODE)
                // that never run in the worklet, but the bundler still tries to resolve them.
                external: ["fs", "path"],
            },
        },
    });
}

// NB: libresidfp.js (Emscripten) detects Node and then reaches for CommonJS globals - __dirname and require -
// which don't exist in an ES module. Shim them, in Node only. A static `import "node:module"` would break
// the same file in browsers, so this goes via process.getBuiltinModule (Node 20.16+/22.3+, see "engines").
const ES_NODE_SHIM = `var __sidiNode = typeof process === "object" && process.versions && process.versions.node && process.getBuiltinModule;
var require = __sidiNode ? process.getBuiltinModule("module").createRequire(import.meta.url) : undefined;
var __dirname = __sidiNode ? process.getBuiltinModule("path").dirname(process.getBuiltinModule("url").fileURLToPath(import.meta.url)) : undefined;
`;

async function buildLibrary(format: keyof typeof LIBRARY_OUT_FILES) {
    await build({
        configFile: false,
        build: {
            lib: {
                entry: LIBRARY_ENTRY,
                formats: [format],
                fileName: () => LIBRARY_OUT_FILES[format],
            },
            outDir: OUT_DIR,
            emptyOutDir: false,
            minify: false,
            rollupOptions: {
                external: ["fs", "path"],
                output: format === "es" ? { banner: ES_NODE_SHIM } : {},
            },
        },
    });
}

// NB: Declarations are bundled into self-contained files rather than emitted one-per-source-file, so the
// package exposes only what's public, ships no "../compiled/..." relative imports, and can give each module
// format its own correctly-typed file: index.d.mts (ESM) and index.d.cts (CJS). The worklet is a plain
// script with no runtime exports, so it only needs its options type, as SidiAudioWorkletProcessor.d.ts.
async function buildDeclarations() {
    const tsconfig = path.join(ROOT, "tsconfig.json");

    // NB: Stale outputs from earlier builds (e.g. one-file-per-source declarations) must not linger in the package.
    for (const file of fs.readdirSync(OUT_DIR))
        if (/\.d\.(ts|mts|cts)$/.test(file))
            fs.rmSync(path.join(OUT_DIR, file));

    const bundleOf = (input: string, name: string) => rolldown({
        input: { [name]: input },
        plugins: [dts({ emitDtsOnly: true, tsconfig })],
        // NB: Left as an import (it's a peer dependency) so consumers' File type is the same one they installed
        external: [/^@perry-rylance\/midi(\/|$)/],
    });

    // NB: rolldown-plugin-dts only bundles in "es" format. That's fine: a bundled declaration file has no relative
    // imports left, so the same text is a valid .d.cts - what matters to TypeScript is the file extension.
    const library = await bundleOf(LIBRARY_ENTRY, "index");
    await library.write({ dir: OUT_DIR, format: "es", entryFileNames: "[name].mjs" });
    fs.copyFileSync(path.join(OUT_DIR, "index.d.mts"), path.join(OUT_DIR, "index.d.cts"));

    // NB: The worklet's types are a plain .d.ts - the JS is a classic script, not an ES module or CJS module
    const worklet = await bundleOf(ENTRY, "SidiAudioWorkletProcessor");
    await worklet.write({ dir: OUT_DIR, format: "es", entryFileNames: "[name].mjs" });
    fs.renameSync(path.join(OUT_DIR, "SidiAudioWorkletProcessor.d.mts"), path.join(OUT_DIR, "SidiAudioWorkletProcessor.d.ts"));
}

async function main() {
    await buildScript();
    await buildLibrary("es");
    await buildLibrary("cjs");
    await buildDeclarations();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
