"use client";

/**
 * Cookie consent banner -- fixed bottom-left card.
 *
 * Adapted from context-rocket/frontend/components/cookie-consent-banner.tsx.
 * Simplified for the starter: no preferences sub-panel, no i18n provider
 * (strings come from i18n/keys.ts t()), links to /privacy from siteConfig.
 *
 * Consent state persists in localStorage via lib/analytics.ts.
 * Declining keeps the site fully functional -- no analytics loads.
 *
 * VISIBILITY is a three-way control: siteConfig.features.cookieConsent.
 *   "off"  -> never render.
 *   "on"   -> render until consent is recorded (regardless of analytics).
 *   "auto" -> render only when analytics is configured (analyticsConfigured()
 *             from lib/analytics.ts -- the SAME single-source gate the privacy
 *             page reads) AND consent is not yet recorded. This is the default,
 *             so the shipped starter (no analytics keys) shows NO banner, while
 *             a fork that adds a GA/PostHog key gets it automatically.
 * This governs visibility only; the grant/deny consent contract is unchanged.
 */

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import {
  readConsent,
  grantConsent,
  denyConsent,
  analyticsConfigured,
  type ConsentValue,
} from "@/lib/analytics";
import { siteConfig } from "@/site.config";
import type { FeaturesConfig } from "@/site.config";
import { t } from "@/i18n/keys";

// Derive privacy path from siteConfig (forks may extend siteConfig.privacyPath).
const PRIVACY_HREF = "/privacy";

/**
 * Pure visibility decision (no React, no storage side effects) so the
 * truth-table is unit-testable in isolation.
 *
 * @param mode              siteConfig.features.cookieConsent
 * @param consent           current recorded consent (null = no choice yet)
 * @param analyticsPresent  whether a GA/PostHog key is configured
 */
export function shouldShowBanner(
  mode: FeaturesConfig["cookieConsent"],
  consent: ConsentValue | null,
  analyticsPresent: boolean,
): boolean {
  if (mode === "off") return false;
  // A recorded choice (granted or denied) always suppresses the banner.
  if (consent !== null) return false;
  if (mode === "on") return true;
  // "auto": only when analytics actually exists.
  return analyticsPresent;
}

function useConsentState() {
  // null = not yet read from storage (SSR safe); true = should show banner
  const [shouldShow, setShouldShow] = useState<boolean | null>(null);

  useEffect(() => {
    // Resolve the three-way visibility control against the recorded consent
    // and whether analytics is configured. Runs on the client only, so
    // analyticsConfigured() and readConsent() are safe here.
    setShouldShow(
      shouldShowBanner(
        siteConfig.features.cookieConsent,
        readConsent(),
        analyticsConfigured(),
      ),
    );
  }, []);

  return { shouldShow, setShouldShow };
}

export function CookieConsentBanner() {
  const { shouldShow, setShouldShow } = useConsentState();

  function handleAccept() {
    grantConsent();
    setShouldShow(false);
  }

  function handleDecline() {
    denyConsent();
    setShouldShow(false);
  }

  // Do not render on SSR or when consent already recorded.
  if (shouldShow !== true) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={t("cookie.consent.aria.label")}
      data-testid="cookie-consent-banner"
      className={[
        "fixed bottom-3 left-3 right-3 z-50",
        "sm:right-auto sm:left-6 sm:bottom-6 sm:max-w-md",
        "rounded-lg border border-border bg-background/95 shadow-lg backdrop-blur-sm",
        "animate-in slide-in-from-bottom duration-300",
      ].join(" ")}
    >
      <div className="flex flex-col gap-2.5 px-4 py-3">
        <p className="text-sm font-semibold leading-snug text-foreground">
          {t("cookie.consent.title")}
        </p>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {t("cookie.consent.body")}{" "}
          <Link
            href={PRIVACY_HREF}
            className="underline underline-offset-2 transition-colors duration-200 hover:text-foreground"
            data-testid="cookie-consent-policy-link"
          >
            {t("cookie.consent.policy.link")}
          </Link>
        </p>

        <div className="mt-0.5 flex shrink-0 flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={handleDecline}
            data-testid="cookie-consent-decline"
            className="inline-flex min-h-9 items-center justify-center rounded-md border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            {t("cookie.consent.decline")}
          </button>
          <button
            type="button"
            onClick={handleAccept}
            data-testid="cookie-consent-accept"
            className="inline-flex min-h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("cookie.consent.accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
