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
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { readConsent, grantConsent, denyConsent } from "@/lib/analytics";
import { t } from "@/i18n/keys";

// Derive privacy path from siteConfig (forks may extend siteConfig.privacyPath).
const PRIVACY_HREF = "/privacy";

function useConsentState() {
  // null = not yet read from storage (SSR safe); true = should show banner
  const [shouldShow, setShouldShow] = useState<boolean | null>(null);

  useEffect(() => {
    const current = readConsent();
    // Show banner only when no choice has been recorded yet.
    setShouldShow(current === null);
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
      aria-label={t("COOKIE_CONSENT_ARIA_LABEL")}
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
          {t("COOKIE_CONSENT_TITLE")}
        </p>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {t("COOKIE_CONSENT_BODY")}{" "}
          <Link
            href={PRIVACY_HREF}
            className="underline underline-offset-2 transition-colors duration-200 hover:text-foreground"
            data-testid="cookie-consent-policy-link"
          >
            {t("COOKIE_CONSENT_POLICY_LINK")}
          </Link>
        </p>

        <div className="mt-0.5 flex shrink-0 flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={handleDecline}
            data-testid="cookie-consent-decline"
            className="inline-flex min-h-9 items-center justify-center rounded-md border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            {t("COOKIE_CONSENT_DECLINE")}
          </button>
          <button
            type="button"
            onClick={handleAccept}
            data-testid="cookie-consent-accept"
            className="inline-flex min-h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("COOKIE_CONSENT_ACCEPT")}
          </button>
        </div>
      </div>
    </div>
  );
}
