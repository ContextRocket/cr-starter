import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    environment: "jsdom",
    // Raise the per-test and per-hook timeouts to 30s: on some machines jsdom
    // environment spin-up alone can exceed vitest's 5s default, producing
    // spurious "Test timed out in 5000ms" / worker-start failures on otherwise
    // green suites. This base value is inherited by every fork on sync.
    testTimeout: 30000,
    hookTimeout: 30000,
    setupFiles: [path.resolve(__dirname, "vitest.setup.ts")],
    include: ["__tests__/**/*.test.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/.next/**", "__tests__/__mocks__/**"],
    coverage: { provider: "v8" },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname) },
  },
});
