"use client";

/**
 * Cookie consent banner -- three configurable layouts, one consent contract.
 *
 * STYLE is chosen by `siteConfig.chrome.cookieBannerStyle`:
 *   "bar"      (DEFAULT) -- a slim full-width bar pinned to the bottom edge. A
 *                           single desktop row: one-line message + "Privacy
 *                           Policy" link on the left, Decline (ghost) + Accept
 *                           (primary) on the right; stacks cleanly
 *                           on mobile with >=44px touch targets.
 *   "card"     -- the prior bottom-left floating card (title + body + policy
 *                           link + stacked Decline/Accept), brought up to the
 *                           same polish (primary Accept, ghost Decline,
 *                           focus-visible rings, dark-legible border).
 *   "terminal" -- a compact bottom-left card with terminal chrome: a mono
 *                           `> cookies` prompt with a caret, square corners,
 *                           bracket-labelled actions ([ manage ] [ decline ]
 *                           [ accept ]), and a brand-accent accent line. The
 *                           same consent logic as the other two; adapted from
 *                           context-rocket but token-styled for the starter
 *                           (no CR-pink, no next-intl).
 *
 * All three layouts share the SAME consent logic and the SAME `data-testid`s
 * (cookie-consent-banner / -accept / -decline / -policy-link / -manage / -save)
 * -- only the wrapper/layout differs.
 *
 * MANAGE SETTINGS: every layout exposes a "Manage settings" control that opens
 * the shared `CookiePreferencesDialog` MODAL -- Necessary (locked on) +
 * Analytics + Marketing toggles with a "Save preferences" action. Save
 * dismisses the dialog AND the banner; Escape / backdrop / X closes without
 * saving.
 *
 * Consent state persists in localStorage via lib/analytics.ts. Declining keeps
 * the site fully functional -- no analytics loads.
 *
 * VISIBILITY is a three-way control: siteConfig.features.cookieConsent.
 *   "off"  -> never render.
 *   "on"   -> render until consent is recorded (regardless of analytics).
 *   "auto" -> render only when analytics is configured (analyticsConfigured()
 *             from lib/analytics.ts) AND consent is not yet recorded (the
 *             default; the shipped starter shows no banner until a fork adds a
 *             GA/PostHog key).
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
import { siteConfig } from "@/config/site.config";
import type { FeaturesConfig } from "@/config/site.config";
import { useTranslations } from "@/i18n/locale-provider";

import { CookiePreferencesDialog } from "@/components/shared/cookie-consent/preferences-dialog";

// Derive privacy path from siteConfig (forks may extend siteConfig.privacyPath).
const PRIVACY_HREF = "/privacy";

export type CookieBannerStyle = "bar" | "card" | "terminal";

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

/**
 * Test / design-review override: `?showbanner` forces the banner visible
 * regardless of config or recorded consent; `?showbanner=bar|card|terminal`
 * also forces a specific layout so every mode can be previewed without touching
 * config. Pure so it is unit-testable without a browser.
 */
export function parseShowBannerParam(search: string): {
  force: boolean;
  style: CookieBannerStyle | null;
} {
  const params = new URLSearchParams(search);
  if (!params.has("showbanner")) return { force: false, style: null };
  const value = params.get("showbanner");
  const style =
    value === "bar" || value === "card" || value === "terminal"
      ? value
      : null;
  return { force: true, style };
}

function useConsentState(forceShow: boolean) {
  // null = not yet read from storage (SSR safe); true = should show banner
  const [shouldShow, setShouldShow] = useState<boolean | null>(null);

  useEffect(() => {
    // The ?showbanner preview override wins over the three-way control.
    if (forceShow) {
      setShouldShow(true);
      return;
    }
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
  }, [forceShow]);

  return { shouldShow, setShouldShow };
}

/**
 * The shared policy link -- identical copy + testid in every layout. Styling is
 * passed in so each variant can tune its inline vs standalone appearance.
 */
function PolicyLink({ className }: { className: string }) {
  const t = useTranslations();
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
 * The shared action pair for the "bar" and "card" layouts: "Manage settings"
 * (ghost) + Decline (ghost) + Accept (primary). Same testids and
 * handlers; only the container class differs.
 */
function ConsentActions({
  onAccept,
  onDecline,
  onManage,
  containerClassName,
  buttonSizing,
}: {
  onAccept: () => void;
  onDecline: () => void;
  onManage: () => void;
  containerClassName: string;
  buttonSizing: string;
}) {
  const t = useTranslations();
  return (
    <div className={containerClassName}>
      <button
        type="button"
        onClick={onManage}
        data-testid="cookie-consent-manage"
        className={`inline-flex items-center justify-center rounded-md px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none ${buttonSizing}`}
      >
        {t("cookie.consent.manage")}
      </button>
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
        className={`inline-flex items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none ${buttonSizing}`}
      >
        {t("cookie.consent.accept")}
      </button>
    </div>
  );
}

/**
 * Terminal-styled action button: mono `[ label ]` with bracket accents.
 * accents. `tone` colors the brackets (brand accent on neutral surfaces,
 * translucent on the filled brand button).
 */
function TerminalButton({
  label,
  onClick,
  testId,
  tone = "ghost",
}: {
  label: string;
  onClick: () => void;
  testId: string;
  tone?: "ghost" | "outline" | "brand";
}) {
  const bracket =
    tone === "brand" ? "text-primary-foreground/60" : "text-brand-accent";
  const toneClass =
    tone === "brand"
      ? "bg-primary text-primary-foreground hover:bg-primary-hover"
      : tone === "outline"
        ? "border border-border bg-background text-foreground hover:bg-muted"
        : "text-muted-foreground hover:bg-muted hover:text-foreground";
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      className={`inline-flex min-h-9 items-center justify-center rounded-none px-3 font-mono text-sm tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none ${toneClass}`}
    >
      <span className={bracket} aria-hidden="true">
        [
      </span>
      <span className="px-1">{label}</span>
      <span className={bracket} aria-hidden="true">
        ]
      </span>
    </button>
  );
}

/**
 * Slim full-width bar pinned to the bottom edge (the default variant). One
 * desktop row; stacks on mobile.
 */
function CookieBarLayout({
  onAccept,
  onDecline,
  onManage,
}: {
  onAccept: () => void;
  onDecline: () => void;
  onManage: () => void;
}) {
  const t = useTranslations();
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
          onManage={onManage}
          containerClassName="flex shrink-0 items-center gap-2"
          buttonSizing="min-h-11 flex-1 sm:min-h-9 sm:flex-none"
        />
      </div>
    </div>
  );
}

/**
 * Bottom-left floating card (the prior variant), brought up to the bar
 * variant's polish.
 */
function CookieCardLayout({
  onAccept,
  onDecline,
  onManage,
}: {
  onAccept: () => void;
  onDecline: () => void;
  onManage: () => void;
}) {
  const t = useTranslations();
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
          onManage={onManage}
          containerClassName="mt-0.5 flex shrink-0 flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end"
          buttonSizing="min-h-11 sm:min-h-9"
        />
      </div>
    </div>
  );
}

/**
 * Terminal-styled bottom-left card: mono `> cookies` prompt, square corners,
 * bracket-labelled actions, brand-accent accent line. Same consent contract as
 * the other layouts -- only the chrome differs.
 */
function CookieTerminalLayout({
  onAccept,
  onDecline,
  onManage,
}: {
  onAccept: () => void;
  onDecline: () => void;
  onManage: () => void;
}) {
  const t = useTranslations();
  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={t("cookie.consent.aria.label")}
      data-testid="cookie-consent-banner"
      className={[
        // Floating card anchored bottom-left on >=sm; inset strip on mobile.
        "fixed bottom-3 left-3 right-3 z-50",
        "sm:right-auto sm:left-6 sm:bottom-6 sm:max-w-sm",
        // Terminal surface: square corners, dark-legible border, blur.
        "overflow-hidden rounded-none border border-card-border bg-background/95 shadow-lg backdrop-blur-sm",
        // Respect reduced-motion: skip the slide-in entrance.
        "animate-in slide-in-from-bottom duration-300 motion-reduce:animate-none",
      ].join(" ")}
    >
      {/* Subtle brand accent -- the one flash of color on the chrome. */}
      <div
        aria-hidden="true"
        className="h-px w-full bg-gradient-to-r from-brand-accent via-brand-accent/40 to-transparent"
      />
      <div className="flex flex-col gap-2.5 px-4 py-3">
        {/* Decorative terminal prompt -- not read by screen readers. */}
        <div
          aria-hidden="true"
          className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
        >
          <span className="text-brand-accent">&gt;</span>
          <span>cookies</span>
          <span className="leading-none">▋</span>
        </div>

        <p className="text-sm font-semibold leading-snug text-foreground">
          {t("cookie.consent.title")}
        </p>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {t("cookie.consent.body")}{" "}
          <PolicyLink className="rounded-sm underline underline-offset-2 transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background" />
        </p>

        <div className="mt-0.5 flex shrink-0 flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
          <TerminalButton
            tone="ghost"
            label={t("cookie.consent.manage")}
            onClick={onManage}
            testId="cookie-consent-manage"
          />
          <TerminalButton
            tone="outline"
            label={t("cookie.consent.decline")}
            onClick={onDecline}
            testId="cookie-consent-decline"
          />
          <TerminalButton
            tone="brand"
            label={t("cookie.consent.accept")}
            onClick={onAccept}
            testId="cookie-consent-accept"
          />
        </div>
      </div>
    </div>
  );
}

export function CookieConsentBanner() {
  // Read the ?showbanner override once per render (client-only). SSR renders
  // nothing (shouldShow starts null), so there is no hydration mismatch.
  const override =
    typeof window !== "undefined"
      ? parseShowBannerParam(window.location.search)
      : { force: false, style: null };
  const { shouldShow, setShouldShow } = useConsentState(override.force);
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleAccept() {
    grantConsent();
    setShouldShow(false);
  }

  function handleDecline() {
    denyConsent();
    setShouldShow(false);
  }

  // "Save preferences" persisted a granular choice (which also recorded a
  // binary consent value); dismiss the dialog and the banner.
  function handleSaved() {
    setDialogOpen(false);
    setShouldShow(false);
  }

  function handleManage() {
    setDialogOpen(true);
  }

  // Do not render on SSR or when consent already recorded (unless ?showbanner).
  if (shouldShow !== true) return null;

  // Pick the layout from config (or the ?showbanner=bar|card|terminal
  // override); "bar" is the owner-selected default.
  const style = override.style ?? siteConfig.chrome.cookieBannerStyle;
  const layout =
    style === "card" ? (
      <CookieCardLayout
        onAccept={handleAccept}
        onDecline={handleDecline}
        onManage={handleManage}
      />
    ) : style === "terminal" ? (
      <CookieTerminalLayout
        onAccept={handleAccept}
        onDecline={handleDecline}
        onManage={handleManage}
      />
    ) : (
      <CookieBarLayout
        onAccept={handleAccept}
        onDecline={handleDecline}
        onManage={handleManage}
      />
    );

  return (
    <>
      {layout}
      {dialogOpen && (
        <CookiePreferencesDialog
          onSaved={handleSaved}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </>
  );
}
