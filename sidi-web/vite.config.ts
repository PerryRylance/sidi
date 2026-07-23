import { defineConfig } from "vite";

export default defineConfig({
    // NB: dist/ is prebuilt by build:worklet - serve it as-is, never through Vite's JS transform pipeline
    publicDir: "dist",
    plugins: [
        {
            name: "serve-demo-at-root",
            configureServer(server) {
                server.middlewares.use((req, res, next) => {
                    if (req.url === "/") {
                        req.url = "/demo/index.html";
                    }
                    next();
                });
            },
        },
    ],
});
