/**
 * Analytics loader -- the ONLY place any analytics script is loaded.
 *
 * Design contract:
 *   - When no keys are set (NEXT_PUBLIC_GA_MEASUREMENT_ID, NEXT_PUBLIC_POSTHOG_KEY),
 *     this module loads NOTHING. Zero network calls, zero script tags.
 *   - When a key is present, analytics initializes ONLY AFTER the user grants
 *     cookie consent. Declining consent keeps the site fully functional.
 *   - Consent state is persisted in localStorage under CONSENT_STORAGE_KEY.
 *   - This file is the grep gate: no gtag/posthog reference may exist outside it.
 *
 * Usage (called from layout.tsx after consent banner mounts):
 *   import { initAnalytics, onConsentGranted } from "@/lib/analytics";
 *   initAnalytics();  // safe to call multiple times; idempotent
 *
 * Grep gate enforcement:
 *   grep -rn "gtag\|posthog" frontend --include="*.ts" --include="*.tsx" -l
 *   must return ONLY this file and its test.
 */

// ── Consent persistence ───────────────────────────────────────────────────────

export const CONSENT_STORAGE_KEY = "cr_analytics_consent";
export const CONSENT_GRANTED = "granted";
export const CONSENT_DENIED = "denied";

export type ConsentValue = typeof CONSENT_GRANTED | typeof CONSENT_DENIED;

function canUseStorage(): boolean {
  try {
    return typeof window !== "undefined" && typeof localStorage !== "undefined";
  } catch {
    return false;
  }
}

/** Read the persisted consent value. Returns null when no choice has been made. */
export function readConsent(): ConsentValue | null {
  if (!canUseStorage()) return null;
  const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
  if (raw === CONSENT_GRANTED || raw === CONSENT_DENIED) return raw;
  return null;
}

/** Persist a consent choice. */
export function writeConsent(value: ConsentValue): void {
  if (!canUseStorage()) return;
  localStorage.setItem(CONSENT_STORAGE_KEY, value);
}

/** Clear the stored consent (e.g. for testing or re-prompting). */
export function clearConsent(): void {
  if (!canUseStorage()) return;
  localStorage.removeItem(CONSENT_STORAGE_KEY);
  localStorage.removeItem(CONSENT_CATEGORIES_STORAGE_KEY);
}

// ── Granular consent categories ───────────────────────────────────────────────
//
// The banner offers a "Manage settings" panel with per-category toggles. The
// starter models three categories:
//   - `necessary`  — always on, not user-toggleable (strictly-required cookies).
//   - `analytics`  — governs whether the analytics providers load. This is the
//                    ONLY category the starter actually wires to script loading,
//                    so it stays in lockstep with the binary readConsent() gate
//                    (analytics on -> "granted", off -> "denied"). Forks that add
//                    a real provider get it for free.
//   - `marketing`  — persisted so a fork can gate its own marketing scripts, but
//                    the shipped starter loads nothing for it (no marketing
//                    provider). It is stored, not silently dropped.
//
// Persisting categories keeps the binary consent value in sync so the existing
// banner-visibility + initAnalytics() paths need no changes: a recorded category
// choice records a binary choice too, which suppresses the banner.

export const CONSENT_CATEGORIES_STORAGE_KEY = "cr_analytics_consent_categories";

/** Optional (user-toggleable) categories, in display order. */
export const OPTIONAL_CONSENT_CATEGORIES = ["analytics", "marketing"] as const;

export type OptionalConsentCategory =
  (typeof OPTIONAL_CONSENT_CATEGORIES)[number];

/** Full category map. `necessary` is always true (not user-toggleable). */
export type ConsentCategories = { necessary: true } & Record<
  OptionalConsentCategory,
  boolean
>;

/** Default map: necessary on, everything optional off (privacy-preserving). */
export function defaultConsentCategories(): ConsentCategories {
  return { necessary: true, analytics: false, marketing: false };
}

function isBoolRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Read the persisted per-category consent. Returns null when the user has not
 * yet made a granular choice. `necessary` is always forced true regardless of
 * stored contents.
 */
export function readConsentCategories(): ConsentCategories | null {
  if (!canUseStorage()) return null;
  const raw = localStorage.getItem(CONSENT_CATEGORIES_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isBoolRecord(parsed)) return null;
    return {
      necessary: true,
      analytics: parsed["analytics"] === true,
      marketing: parsed["marketing"] === true,
    };
  } catch {
    return null;
  }
}

/**
 * Persist a granular category choice, keep the binary consent value in sync
 * (analytics on -> grant + load; off -> deny), and return the saved map.
 * Necessary is always coerced to true.
 */
export function saveConsentCategories(
  categories: Partial<ConsentCategories>,
): ConsentCategories {
  const resolved: ConsentCategories = {
    necessary: true,
    analytics: categories.analytics === true,
    marketing: categories.marketing === true,
  };

  if (canUseStorage()) {
    localStorage.setItem(
      CONSENT_CATEGORIES_STORAGE_KEY,
      JSON.stringify(resolved),
    );
  }

  // Keep the binary analytics gate in lockstep with the analytics category.
  if (resolved.analytics) {
    grantConsent();
  } else {
    denyConsent();
  }

  return resolved;
}

// ── Key resolution ────────────────────────────────────────────────────────────

function gaKey(): string | undefined {
  return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || undefined;
}

function posthogKey(): string | undefined {
  return process.env.NEXT_PUBLIC_POSTHOG_KEY || undefined;
}

function posthogHost(): string {
  return process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
}

// ── Loader state (idempotency guard) ─────────────────────────────────────────

let _gaLoaded = false;
let _posthogLoaded = false;

/**
 * The single source of truth for "is analytics configured on this fork?".
 *
 * Returns true iff at least one analytics provider key is present
 * (NEXT_PUBLIC_GA_MEASUREMENT_ID or NEXT_PUBLIC_POSTHOG_KEY). Every consumer
 * that needs to know whether analytics exists — the cookie-consent banner's
 * "auto" gate and the privacy page's analytics section — reads THIS, so the
 * check is defined once and never mirrored.
 */
export function analyticsConfigured(): boolean {
  return Boolean(gaKey() || posthogKey());
}

// ── Script injection helpers ──────────────────────────────────────────────────

function loadGA(measurementId: string): void {
  if (_gaLoaded) return;
  _gaLoaded = true;

  // Inject the gtag loader script.
  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize the gtag data layer using Google's documented push-queue pattern.
  // window.dataLayer and window.gtag are typed as unknown to avoid global augmentation.
  const w = window as unknown as Record<string, unknown>;
  const dataLayer: unknown[] = (w["dataLayer"] as unknown[]) ?? [];
  w["dataLayer"] = dataLayer;

  // gtag pushes its arguments array onto the data layer queue.
  // The push-based approach is used instead of a rest-param function because
  // the real gtag script replaces this stub; the queue is all that matters here.
  function pushToDataLayer(...args: unknown[]) {
    dataLayer.push(args);
  }
  w["gtag"] = pushToDataLayer;
  pushToDataLayer("js", new Date());
  pushToDataLayer("config", measurementId);
}

function loadPosthog(key: string, host: string): void {
  if (_posthogLoaded) return;
  _posthogLoaded = true;

  // Inject the posthog loader.
  // Uses the standard posthog snippet pattern: set a stub array, then load
  // the real script asynchronously.
  const w = window as unknown as Record<string, unknown>;
  const posthogStub = function (...args: unknown[]) {
    (posthogStub as unknown as { q: unknown[][] }).q =
      (posthogStub as unknown as { q: unknown[][] }).q || [];
    (posthogStub as unknown as { q: unknown[][] }).q.push(args);
  };
  (posthogStub as unknown as { q: unknown[][] }).q = [];
  w["posthog"] = posthogStub;
  posthogStub("init", key, { api_host: host, loaded: () => {} });

  const script = document.createElement("script");
  script.src = `${host}/static/array.js`;
  script.async = true;
  document.head.appendChild(script);
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Initialize analytics -- loads provider scripts ONLY when:
 *   1. The relevant env key is set.
 *   2. The user has granted consent (readConsent() === "granted").
 *
 * Safe to call multiple times; guards with idempotency flags.
 * Call from layout.tsx on mount, and again after the user grants consent.
 */
export function initAnalytics(): void {
  if (typeof window === "undefined") return;
  if (readConsent() !== CONSENT_GRANTED) return;

  const ga = gaKey();
  if (ga) loadGA(ga);

  const ph = posthogKey();
  if (ph) loadPosthog(ph, posthogHost());
}

/**
 * Grant consent and immediately initialize analytics.
 * Call this when the user clicks "Accept" in the cookie banner.
 */
export function grantConsent(): void {
  writeConsent(CONSENT_GRANTED);
  initAnalytics();
}

/**
 * Deny consent. Analytics will not initialize.
 * Call this when the user clicks "Decline" in the cookie banner.
 */
export function denyConsent(): void {
  writeConsent(CONSENT_DENIED);
}
