"use client";

/**
 * Cookie consent banner -- two configurable layouts, one consent contract.
 *
 * STYLE is chosen by `siteConfig.chrome.cookieBannerStyle`:
 *   "bar"  (DEFAULT) -- a slim full-width bar pinned to the bottom edge. A
 *                       single desktop row: one-line message + "Privacy Policy"
 *                       link on the left, Decline (ghost) + Accept (brand-accent
 *                       primary) on the right; stacks cleanly on mobile with
 *                       >=44px touch targets. The owner-selected new shape.
 *   "card"          -- the prior bottom-left floating card (title + body +
 *                       policy link + stacked Decline/Accept), brought up to the
 *                       same polish (brand-accent Accept, ghost Decline,
 *                       focus-visible rings, dark-legible border).
 *
 * Both layouts share the SAME consent logic, the SAME `data-testid`s
 * (cookie-consent-banner / -accept / -decline / -policy-link), and the SAME
 * grant/deny + localStorage flow -- only the wrapper/layout differs.
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

/**
 * The shared policy link — identical copy + testid in both layouts. Styling is
 * passed in so each variant can tune its inline vs standalone appearance.
 */
function PolicyLink({ className }: { className: string }) {
  return (
    <Link
      href={PRIVACY_HREF}
      className={className}
      data-testid="cookie-consent-policy-link"
    >
      {t("cookie.consent.policy.link")}
    </Link>
  );
}

/**
 * The shared Decline (ghost) + Accept (brand-accent primary) action pair. Both
 * layouts render the SAME testids and the SAME handlers; only the container
 * class differs (a right-aligned row in the bar, a stacked footer in the card).
 */
function ConsentActions({
  onAccept,
  onDecline,
  containerClassName,
  buttonSizing,
}: {
  onAccept: () => void;
  onDecline: () => void;
  containerClassName: string;
  buttonSizing: string;
}) {
  return (
    <div className={containerClassName}>
      <button
        type="button"
        onClick={onDecline}
        data-testid="cookie-consent-decline"
        className={`inline-flex items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none ${buttonSizing}`}
      >
        {t("cookie.consent.decline")}
      </button>
      <button
        type="button"
        onClick={onAccept}
        data-testid="cookie-consent-accept"
        className={`inline-flex items-center justify-center rounded-md bg-brand-accent px-4 text-sm font-semibold text-brand-accent-foreground transition-colors hover:bg-brand-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none ${buttonSizing}`}
      >
        {t("cookie.consent.accept")}
      </button>
    </div>
  );
}

/**
 * Slim full-width bar pinned to the bottom edge (the default variant). One
 * desktop row; stacks on mobile.
 */
function CookieBarLayout({
  onAccept,
  onDecline,
}: {
  onAccept: () => void;
  onDecline: () => void;
}) {
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
          <PolicyLink className="rounded-sm font-medium text-foreground underline underline-offset-2 transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background" />
        </p>

        {/* >=44px touch targets on mobile (min-h-11); collapse to compact on
            desktop. */}
        <ConsentActions
          onAccept={onAccept}
          onDecline={onDecline}
          containerClassName="flex shrink-0 items-center gap-2"
          buttonSizing="min-h-11 flex-1 sm:min-h-9 sm:flex-none"
        />
      </div>
    </div>
  );
}

/**
 * Bottom-left floating card (the restored prior variant), brought up to the bar
 * variant's polish: brand-accent Accept, ghost Decline, focus-visible rings,
 * dark-legible border.
 */
function CookieCardLayout({
  onAccept,
  onDecline,
}: {
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={t("cookie.consent.aria.label")}
      data-testid="cookie-consent-banner"
      className={[
        // Floating card anchored to the bottom-left on >=sm; full-width inset
        // strip on mobile.
        "fixed bottom-3 left-3 right-3 z-50",
        "sm:right-auto sm:left-6 sm:bottom-6 sm:max-w-md",
        // Dark-legible card border + elevation + blur.
        "rounded-lg border border-card-border bg-background/95 shadow-lg backdrop-blur-sm",
        // Respect reduced-motion: skip the slide-in entrance.
        "animate-in slide-in-from-bottom duration-300 motion-reduce:animate-none",
      ].join(" ")}
    >
      <div className="flex flex-col gap-2.5 px-4 py-3">
        <p className="text-sm font-semibold leading-snug text-foreground">
          {t("cookie.consent.title")}
        </p>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {t("cookie.consent.body")}{" "}
          <PolicyLink className="rounded-sm underline underline-offset-2 transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background" />
        </p>

        <ConsentActions
          onAccept={onAccept}
          onDecline={onDecline}
          containerClassName="mt-0.5 flex shrink-0 flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end"
          buttonSizing="min-h-11 sm:min-h-9"
        />
      </div>
    </div>
  );
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

  // Pick the layout from config; "bar" is the owner-selected default.
  return siteConfig.chrome.cookieBannerStyle === "card" ? (
    <CookieCardLayout onAccept={handleAccept} onDecline={handleDecline} />
  ) : (
    <CookieBarLayout onAccept={handleAccept} onDecline={handleDecline} />
  );
}
