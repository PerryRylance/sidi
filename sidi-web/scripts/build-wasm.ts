import path from "path";
import fs from "fs";
import { spawnSync } from "child_process";

const ROOT = path.resolve(__dirname, "..", "..");
const LIBRESIDFP_DIR = path.join(ROOT, "libresidfp-main");
const LIBRESIDFP_SRC = path.join(LIBRESIDFP_DIR, "src");
const BINDINGS_FILE = path.join(__dirname, "..", "agents", "SID_bindings.cpp");
const OUTPUT_FILE = path.join(__dirname, "..", "compiled", "libresidfp.js");

// Mirrors the reSIDfp source list compiled by sidi-vst (see ../../sidi-vst/sidi-vst.jucer)
const LIBRESIDFP_SOURCES = [
    "Dac.cpp",
    "EnvelopeGenerator.cpp",
    "ExternalFilter.cpp",
    "Filter.cpp",
    "Filter6581.cpp",
    "Filter8580.cpp",
    "FilterModelConfig.cpp",
    "FilterModelConfig6581.cpp",
    "FilterModelConfig8580.cpp",
    "Integrator6581.cpp",
    "Integrator8580.cpp",
    "OpAmp.cpp",
    "SID.cpp",
    "Spline.cpp",
    "WaveformCalculator.cpp",
    "WaveformGenerator.cpp",
    path.join("resample", "SincResampler.cpp"),
];

function main() {
    if (!fs.existsSync(path.join(LIBRESIDFP_SRC, "siddefs-fp.h"))) {
        console.error(
            `libresidfp-main is missing generated headers (src/siddefs-fp.h).\n` +
            `Run "node scripts/setup-libresidfp.js" from the repo root first.`
        );
        process.exit(1);
    }

    const sources = LIBRESIDFP_SOURCES.map((relative) => path.join(LIBRESIDFP_SRC, relative));

    const args = [
        BINDINGS_FILE,
        ...sources,
        "-I", LIBRESIDFP_SRC,
        "-I", path.join(LIBRESIDFP_SRC, "resample"),
        "--bind",
        "-O3",
        "-s", "MODULARIZE=1",
        "-s", "EXPORT_NAME=Module",
        "-s", "ALLOW_MEMORY_GROWTH=1",
        "-s", "SINGLE_FILE=1",
        "-o", OUTPUT_FILE,
    ];

    console.log(`emcc ${args.join(" ")}`);

    const result = spawnSync("emcc", args, { stdio: "inherit" });

    if (result.error) {
        console.error(result.error.message);
        process.exit(1);
    }

    process.exit(result.status ?? 1);
}

main();
