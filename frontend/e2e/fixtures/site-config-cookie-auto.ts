/**
 * E2E build-time override of `@/site.config` for the cookie-consent regression.
 *
 * WHY THIS EXISTS
 * ---------------
 * The cookie-consent banner is a *config-gated* component: it renders only when
 * `siteConfig.features.cookieConsent` and the live `analyticsConfigured()` gate
 * agree. The unit test mocks both inputs, so it stays green even when the REAL
 * rendered app fails to show the banner (the exact bug this E2E catches).
 *
 * To reproduce the true production path we must build the app with:
 *   1. `cookieConsent: "auto"` — the SHIPPED default, and
 *   2. a genuine analytics key (`NEXT_PUBLIC_GA_MEASUREMENT_ID`) so
 *      `analyticsConfigured()` is really true.
 *
 * The repo's working tree carries a live-review toggle (`cookieConsent: "on"`)
 * that we must NOT disturb. Rather than edit the tracked `site.config.ts`, the
 * cookie-consent Playwright build aliases `@/site.config` to THIS module via
 * `turbopack.resolveAlias` (gated behind `E2E_COOKIE_CONSENT_AUTO=1` in
 * next.config.mjs). The alias is inert for every normal build.
 *
 * The override is byte-identical to the shipped app except it pins
 * `cookieConsent: "auto"` (which is also the committed default) — so this is
 * the most faithful reproduction of the production integration, not a mock.
 *
 * FORK PATTERN
 * ------------
 * This is the reusable "config-gated component — verify it actually renders
 * end-to-end" recipe: alias the config module at build time to force the
 * feature ON via its REAL gate, then assert the DOM. Copy it for any other
 * config/env-gated surface (banners, feature flags, provider widgets).
 *
 * NOTE: import the real config by RELATIVE path, never `@/site.config` — the
 * alias points `@/site.config` here, so a `@/`-import would resolve back to
 * this file and loop.
 */

// Re-export every type + value from the real config so all other importers
// (siteConfig, FeaturesConfig, SiteConfig, PathsConfig, ...) keep working.
export * from "../../site.config";

import { siteConfig as realSiteConfig } from "../../site.config";

// Faithful clone of the shipped config with the shipped-default gate pinned.
// "auto" is the committed default; the working-tree "on" toggle is intentionally
// ignored here so the test exercises the auto + analytics production path.
export const siteConfig = {
  ...realSiteConfig,
  features: {
    ...realSiteConfig.features,
    cookieConsent: "auto" as const,
  },
};
