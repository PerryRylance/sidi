import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
    // NB: dist/ is prebuilt by build:worklet - serve it as-is at the root (so the worklet loads from
    // "/SidiAudioWorkletProcessor.js", as in a real deployment), never through Vite's JS transform.
    publicDir: "dist",
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
