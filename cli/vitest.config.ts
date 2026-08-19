import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["test/**/*.test.ts"],
    // No live network: every seam (HTTP, browser-open, loopback) is injected in
    // the CLI flow logic, so tests never open a socket.
    testTimeout: 15000,
  },
});
