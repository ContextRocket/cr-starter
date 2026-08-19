import { defineConfig } from "vitest/config";
import os from "os";
import path from "path";

// jsdom setup is the expensive part of this suite, and the default Vitest
// fork pool can leave a large Next.js test inventory looking hung on laptops
// with many logical CPUs. Use a measured, bounded thread pool by default while
// keeping an environment override for constrained CI or local debugging.
const defaultWorkers = Math.min(6, Math.max(2, os.cpus().length - 2));
const configuredWorkers = Number.parseInt(
  process.env.VITEST_MAX_WORKERS ?? String(defaultWorkers),
  10,
);
const maxWorkers = Number.isFinite(configuredWorkers)
  ? Math.max(1, configuredWorkers)
  : defaultWorkers;
const pool = process.env.VITEST_POOL === "forks" ? "forks" : "threads";

// Test organization:
// - Base tests: __tests__/**/*.test.{ts,tsx} (inherited from cr-starter, common to all forks)
// - Fork tests: __tests__/**/*.fork.test.{ts,tsx} (fork-specific, each fork adds its own)
//
// Run commands:
//   npx vitest run                      - All tests
//   npx vitest run --grep "\.fork\."    - Only fork tests
//   npx vitest run --grep-invert "\.fork\." - Only base tests

export default defineConfig({
  test: {
    pool,
    maxWorkers,
    minWorkers: Math.min(2, maxWorkers),
    fileParallelism: true,
    globals: true,
    clearMocks: true,
    environment: "jsdom",
    testTimeout: 30000,
    hookTimeout: 30000,
    setupFiles: [path.resolve(__dirname, "vitest.setup.ts")],
    include: ["__tests__/**/*.test.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/.next/**", "__tests__/__mocks__/**"],
    coverage: { provider: "v8" },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
      // Next.js provides `server-only` at build/runtime; jsdom tests resolve it
      // to a no-op so server-only modules (i18n/redirect, i18n/server) load.
      "server-only": path.resolve(__dirname, "__tests__/__mocks__/server-only.ts"),
    },
  },
});
