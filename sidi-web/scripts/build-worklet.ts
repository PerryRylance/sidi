import path from "path";
import ts from "typescript";
import { build } from "vite";

const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "src");
const ENTRY = path.join(SRC_DIR, "SidiAudioWorkletProcessor.ts");
const OUT_DIR = path.join(ROOT, "dist");
const OUT_FILE = "SidiAudioWorkletProcessor.js";

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

    const program = ts.createProgram([ENTRY], compilerOptions);
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
    buildDeclarations();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
