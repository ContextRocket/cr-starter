#!/usr/bin/env node
/**
 * Playwright webServer launcher for the cookie-consent E2E regression.
 *
 * Builds and serves the app on its OWN port + OWN distDir with:
 *   - E2E_COOKIE_CONSENT_AUTO=1  -> next.config.mjs aliases @/site.config to the
 *     "auto" override (shipped default) and isolates the build dir, and
 *   - NEXT_PUBLIC_GA_MEASUREMENT_ID set -> analyticsConfigured() is genuinely
 *     true, so the "auto" gate actually shows the banner. This reproduces the
 *     real production integration the unit test mocks past.
 *
 * The tracked site.config.ts is NEVER edited (the alias does the override), and
 * the build output lives in .next-e2e-cookie-consent so a concurrent local
 * review build in ./.next is untouched.
 *
 * Next injects the distDir's types path into tsconfig.json during build; we
 * snapshot tsconfig.json and restore it afterward so the working tree stays
 * clean.
 */

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDir = path.resolve(__dirname, "..");
const tsconfigPath = path.join(frontendDir, "tsconfig.json");

// Two modes, selected by E2E_COOKIE_CONSENT_MODE:
//   "analytics" (default) -> GA key set  -> auto gate SHOWS the banner (the bug)
//   "no-analytics"        -> no GA key   -> auto gate HIDES the banner (contract)
// Both use the SHIPPED `cookieConsent: "auto"` default via the config alias, so
// the pair proves the real gate in both directions. Each mode gets its own port
// + distDir so they can run side by side without collision.
const mode = process.env.E2E_COOKIE_CONSENT_MODE ?? "analytics";
const analytics = mode !== "no-analytics";

const port = process.env.PORT ?? (analytics ? "3210" : "3211");
const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-E2ECOOKIE01";

const buildEnv = {
  ...process.env,
  E2E_COOKIE_CONSENT_AUTO: "1",
  NEXT_TELEMETRY_DISABLED: "1",
  // Distinct distDir per mode so the two builds never clobber each other.
  E2E_COOKIE_CONSENT_DIST_SUFFIX: analytics ? "analytics" : "no-analytics",
};
if (analytics) {
  buildEnv.NEXT_PUBLIC_GA_MEASUREMENT_ID = gaId;
} else {
  // Ensure no inherited key leaks in and makes analyticsConfigured() true.
  delete buildEnv.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  delete buildEnv.NEXT_PUBLIC_POSTHOG_KEY;
}

function run(cmd, args, env) {
  execFileSync(cmd, args, { cwd: frontendDir, stdio: "inherit", env });
}

// Snapshot tsconfig so Next's build-time distDir type injection does not leave
// the tree dirty.
const tsconfigSnapshot = readFileSync(tsconfigPath, "utf8");
try {
  run("pnpm", ["run", "build"], buildEnv);
} finally {
  writeFileSync(tsconfigPath, tsconfigSnapshot);
}

// Serve the isolated build. `next start` reads the built distDir; the alias +
// GA key are already baked in, so start only needs the port + distDir.
run(
  "pnpm",
  ["exec", "next", "start", "--hostname", "127.0.0.1", "--port", port],
  { ...buildEnv, NODE_ENV: "production" },
);
