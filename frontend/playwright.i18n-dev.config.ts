import { defineConfig, devices } from "@playwright/test";

const port = parseInt(process.env.FRONTEND_PORT ?? "3110", 10);

/**
 * Focused development-server config for i18n lifecycle regressions. The
 * standard frontend E2E config uses `next start`, while this spec targets a
 * race that only appears during repeated locale navigation in `next dev`.
 */
export default defineConfig({
  testDir: "./e2e",
  testMatch: /i18n-hydration\.spec\.ts/,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: "line",
  timeout: 90_000,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: `PORT=${port} pnpm exec next dev --turbopack --hostname 127.0.0.1`,
    port,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
