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
