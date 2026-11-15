#!/usr/bin/env node

// Copies the self-contained worklet script out of the package, for apps that can't (or won't) let their bundler
// handle it. Usage: sidi-publish <destination>
//   <destination> ending in .js/.mjs  -> written to exactly that file path
//   anything else                     -> treated as a directory, file keeps its name (created if missing)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const FILE_NAME = "SidiAudioWorkletProcessor.js";
const SOURCE = fileURLToPath(new URL(`../dist/${FILE_NAME}`, import.meta.url));

const USAGE = `Usage: sidi-publish <destination>

Copies ${FILE_NAME} to <destination> so your app can serve it and load it with
audioWorklet.addModule(). <destination> is a directory (e.g. public/) unless it
ends in .js or .mjs, in which case it is the exact file path to write.`;

const args = process.argv.slice(2);

if(args.includes("-h") || args.includes("--help"))
{
    console.log(USAGE);
    process.exit(0);
}

if(args.length !== 1)
{
    console.error(USAGE);
    process.exit(1);
}

if(!fs.existsSync(SOURCE))
{
    console.error(`sidi-publish: ${SOURCE} not found - the package is missing its build output.`);
    process.exit(1);
}

const destination = path.resolve(args[0]);
const isFile = /\.m?js$/i.test(destination);
const target = isFile ? destination : path.join(destination, FILE_NAME);

if(!isFile && fs.existsSync(destination) && !fs.statSync(destination).isDirectory())
{
    console.error(`sidi-publish: ${destination} exists and is not a directory.`);
    process.exit(1);
}

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.copyFileSync(SOURCE, target);

console.log(`Wrote ${path.relative(process.cwd(), target) || target}`);
console.log(`Load it with: createSidiNode(context, midi, { workletUrl: "/${path.basename(target)}" })  (adjust to the URL your server exposes it at)`);
