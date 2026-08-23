import { defineConfig, devices } from "@playwright/test";

const frontendPort = parseInt(process.env.FRONTEND_PORT ?? "3003", 10);

/**
 * Frontend-only Playwright config. All E2E specs exercise the public site
 * without a local backend.
 *
 * Run via: pnpm run test:e2e:frontend  (or the default test:e2e, which runs
 * this config first).
 */

export default defineConfig({
  testDir: "./e2e",
  // Public starter specs; cookie-consent analytics specs use their own config.
  testMatch:
    /(a11y|cookie-showbanner|forms|i18n|language-switching|locale-detection|seo|surface|theme-playground)\.spec\.ts/,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  timeout: 60_000,
  use: {
    baseURL: `http://localhost:${frontendPort}`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: [
    {
      command: `PORT=${frontendPort} pnpm run start:test`,
      port: frontendPort,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
      env: {
        PORT: String(frontendPort),
        FRONTEND_PORT: String(frontendPort),
      },
    },
  ],
});
