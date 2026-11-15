import fs from "fs";
import path from "path";
import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";

const DIST = path.resolve(__dirname, "dist");

export default defineConfig({
    // NB: Not `publicDir: "dist"` - the tests also import from dist/ directly, and Vite warns about a file
    // that's both public and imported. This serves dist/ raw at the root instead, so the worklet loads from
    // "/SidiAudioWorkletProcessor.js" as in a real deployment, never through Vite's JS transform.
    publicDir: false,
    plugins: [
        {
            name: "serve-dist-at-root",
            configureServer(server) {
                server.middlewares.use((req, res, next) => {
                    const name = decodeURIComponent((req.url ?? "").split("?")[0]).replace(/^\/+/, "");
                    const file = path.join(DIST, name);

                    // NB: Only top-level files in dist/, and never anything that escapes it
                    if (!name || name.includes("/") || path.dirname(file) !== DIST || !fs.existsSync(file) || !fs.statSync(file).isFile())
                        return next();

                    res.setHeader("Content-Type", file.endsWith(".js") || file.endsWith(".mjs") ? "text/javascript" : "application/octet-stream");
                    fs.createReadStream(file).pipe(res);
                });
            },
        },
    ],
    test: {
        include: ["tests/browser/**/*.test.ts"],
        browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
        },
    },
});
