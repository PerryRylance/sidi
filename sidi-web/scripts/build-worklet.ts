import path from "path";
import ts from "typescript";
import { build } from "vite";

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

function buildDeclarations() {
    const configPath = path.join(ROOT, "tsconfig.json");
    const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
    const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, ROOT);

    const compilerOptions: ts.CompilerOptions = {
        ...parsed.options,
        declaration: true,
        emitDeclarationOnly: true,
        noEmit: false,
        outDir: OUT_DIR,
        rootDir: SRC_DIR,
    };

    const program = ts.createProgram([ENTRY, LIBRARY_ENTRY], compilerOptions);
    const emitResult = program.emit();

    const diagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

    if (diagnostics.length) {
        const formatted = ts.formatDiagnosticsWithColorAndContext(diagnostics, {
            getCurrentDirectory: () => ROOT,
            getCanonicalFileName: (fileName) => fileName,
            getNewLine: () => ts.sys.newLine,
        });

        console.error(formatted);
    }

    if (emitResult.emitSkipped)
        throw new Error("Failed to emit declarations for SidiAudioWorkletProcessor.ts");
}

async function main() {
    await buildScript();
    await buildLibrary("es");
    await buildLibrary("cjs");
    buildDeclarations();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
