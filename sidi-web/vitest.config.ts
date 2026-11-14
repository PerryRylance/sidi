import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    // NB: Browser tests need a real browser and a built dist/ - run via `npm run test:dist`
    exclude: [...configDefaults.exclude, 'tests/browser/**'],
  },
});
