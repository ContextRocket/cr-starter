import { defineConfig, devices } from "@playwright/test";

const frontendPort = parseInt(process.env.FRONTEND_PORT ?? "3100", 10);
const backendPort = parseInt(process.env.BACKEND_PORT ?? "8100", 10);

/**
 * Playwright configuration for E2E testing
 * See https://playwright.dev/docs/test-configuration
 *
 * Automatically starts both backend and frontend servers.
 * Requires: Docker DB running (`docker compose up -d db` from project root).
 *
 * Ports are read from FRONTEND_PORT (default 3100) and BACKEND_PORT (default 8100),
 * matching the values in .env.example and the Makefile.
 */
export default defineConfig({
  testDir: "./e2e",
  // The cookie-consent regression needs a purpose-built analytics-gated server
  // (its own port + distDir), so it runs under playwright.cookie-consent.config.ts,
  // not this default run.
  testIgnore: /cookie-consent(-no-analytics)?\.spec\.ts/,
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
      command: `uv run python -m uvicorn app.main:app --host 127.0.0.1 --port ${backendPort}`,
      cwd: "../backend",
      port: backendPort,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
      env: { BACKEND_PORT: String(backendPort) },
    },
    {
      command: `PORT=${frontendPort} pnpm run start:test`,
      port: frontendPort,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
      env: {
        PORT: String(frontendPort),
        FRONTEND_PORT: String(frontendPort),
        // Server actions call the backend via the OpenAPI client, whose base
        // URL is read from API_BASE_URL at runtime (lib/clientConfig.ts).
        // Point it at the Playwright-managed backend so registration/login
        // flows actually reach the API instead of resolving to a relative URL.
        API_BASE_URL: `http://127.0.0.1:${backendPort}`,
        NEXT_PUBLIC_API_BASE_URL: `http://127.0.0.1:${backendPort}`,
      },
    },
  ],
});
