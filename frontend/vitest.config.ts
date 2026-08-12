import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    environment: "jsdom",
    setupFiles: [path.resolve(__dirname, "vitest.setup.ts")],
    include: ["__tests__/**/*.test.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/.next/**", "__tests__/__mocks__/**"],
    coverage: { provider: "v8" },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname) },
  },
});
