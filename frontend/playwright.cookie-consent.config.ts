import { defineConfig, devices } from "@playwright/test";

/**
 * Dedicated Playwright config for the cookie-consent banner regression.
 *
 * WHY A SEPARATE CONFIG
 * ---------------------
 * The cookie-consent banner is a config-gated component. Reproducing the real
 * bug ("auto" + analytics configured must SHOW the banner) requires a build with
 * a genuine analytics key AND the shipped `cookieConsent: "auto"` default. The
 * main playwright.config.ts serves a plain build (no analytics key) on :3100,
 * which cannot exercise the analytics-gated path.
 *
 * This config launches TWO of its own frontend webServers, each on its own port
 * + its own distDir (so they never collide with the main E2E run or a local
 * review server such as :3002):
 *   - :3210 "analytics"    -> GA key baked in  -> auto gate SHOWS the banner
 *   - :3211 "no-analytics" -> no GA key        -> auto gate HIDES the banner
 * Two projects route each spec to the matching server via baseURL. The banner is
 * client-only (no API calls), so no backend webServer is needed.
 */

const analyticsPort = parseInt(process.env.COOKIE_CONSENT_PORT ?? "3210", 10);
const noAnalyticsPort = parseInt(
  process.env.COOKIE_CONSENT_NO_ANALYTICS_PORT ?? "3211",
  10,
);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: "list",
  timeout: 60_000,
  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "cookie-consent-analytics",
      testMatch: /cookie-consent\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: `http://127.0.0.1:${analyticsPort}`,
      },
    },
    {
      name: "cookie-consent-no-analytics",
      testMatch: /cookie-consent-no-analytics\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: `http://127.0.0.1:${noAnalyticsPort}`,
      },
    },
  ],

  webServer: [
    {
      command: "node scripts/e2e-cookie-consent-server.mjs",
      port: analyticsPort,
      reuseExistingServer: false,
      timeout: 300_000,
      env: {
        PORT: String(analyticsPort),
        E2E_COOKIE_CONSENT_MODE: "analytics",
      },
    },
    {
      command: "node scripts/e2e-cookie-consent-server.mjs",
      port: noAnalyticsPort,
      reuseExistingServer: false,
      timeout: 300_000,
      env: {
        PORT: String(noAnalyticsPort),
        E2E_COOKIE_CONSENT_MODE: "no-analytics",
      },
    },
  ],
});
