"use client";

/**
 * Cookie consent banner -- slim full-width bar pinned to the bottom.
 *
 * Layout: a single row on desktop -- one-line message + "Privacy Policy" link
 * on the left, Decline (ghost/outline) + Accept (brand-accent primary) on the
 * right. On mobile it stacks cleanly with >=44px touch targets. This is the
 * owner-selected shape (full-width bar, not the prior bottom-left card).
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
        // Full-width bar pinned to the bottom edge (no side insets).
        "fixed inset-x-0 bottom-0 z-50",
        // Lifted border + elevation + blur so the bar reads clearly as a
        // surface in both themes (a top border, not a floating card).
        "border-t border-card-border bg-background/95 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur-sm dark:shadow-[0_-4px_16px_rgba(0,0,0,0.4)]",
        // Respect reduced-motion: skip the slide-in entrance.
        "animate-in slide-in-from-bottom duration-300 motion-reduce:animate-none",
      ].join(" ")}
    >
      {/* Single row on desktop; stacks on mobile. Centered to the content
          column so it lines up with the page gutter. */}
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-sm leading-snug text-muted-foreground">
          {t("cookie.consent.body")}{" "}
          <Link
            href={PRIVACY_HREF}
            className="rounded-sm font-medium text-foreground underline underline-offset-2 transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            data-testid="cookie-consent-policy-link"
          >
            {t("cookie.consent.policy.link")}
          </Link>
        </p>

        {/* >=44px touch targets on mobile (min-h-11); Accept is brand-accent
            primary, Decline is ghost/outline. */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handleDecline}
            data-testid="cookie-consent-decline"
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none sm:min-h-9 sm:flex-none"
          >
            {t("cookie.consent.decline")}
          </button>
          <button
            type="button"
            onClick={handleAccept}
            data-testid="cookie-consent-accept"
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md bg-brand-accent px-4 text-sm font-semibold text-brand-accent-foreground transition-colors hover:bg-brand-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none sm:min-h-9 sm:flex-none"
          >
            {t("cookie.consent.accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
