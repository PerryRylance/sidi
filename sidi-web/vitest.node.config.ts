import { defineConfig } from "vitest/config";

// NB: Post-build checks of dist/ under real Node - see tests/node/dist.test.ts. Run via `npm run test:dist`.
export default defineConfig({
    test: {
        environment: "node",
        include: ["tests/node/**/*.test.ts"],
    },
});
