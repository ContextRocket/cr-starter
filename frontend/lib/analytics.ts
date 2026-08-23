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

import {
  CONSENT_CHANGED_EVENT,
  CONSENT_COOKIE_NAME,
  CONSENT_MAX_AGE_SECONDS,
  createConsentRecord,
  normalizeConsentCategories,
  parseStoredConsent,
  serializeConsent,
  type ConsentCategories,
  type StoredConsent,
} from "@/lib/consent";

export {
  CONSENT_CHANGED_EVENT,
  CONSENT_COOKIE_NAME,
  CONSENT_MAX_AGE_SECONDS,
  CONSENT_STORE_VERSION,
  OPTIONAL_CONSENT_CATEGORIES,
  defaultConsentCategories,
  type ConsentCategories,
  type OptionalConsentCategory,
  type StoredConsent,
} from "@/lib/consent";

export const CONSENT_STORAGE_KEY = "cr_analytics_consent";
export const CONSENT_GRANTED = "granted";
export const CONSENT_DENIED = "denied";
export const CONSENT_RECORD_STORAGE_KEY = "cr_cookie_consent";

export type ConsentValue = typeof CONSENT_GRANTED | typeof CONSENT_DENIED;

function getStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function readCookie(): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${CONSENT_COOKIE_NAME}=`;
  const row = document.cookie
    .split("; ")
    .find((candidate) => candidate.startsWith(prefix));
  return row ? row.slice(prefix.length) : null;
}

function writeCookie(record: StoredConsent): void {
  if (typeof document === "undefined") return;
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";
  document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(serializeConsent(record))}; Path=/; Max-Age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

function clearCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${CONSENT_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function dispatchConsentChanged(record: StoredConsent | null): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(CONSENT_CHANGED_EVENT, { detail: record }),
  );
}

function writeLegacyKeys(
  record: StoredConsent,
  storage: Storage | null = getStorage(),
): void {
  if (!storage) return;
  storage.setItem(
    CONSENT_STORAGE_KEY,
    record.categories.analytics ? CONSENT_GRANTED : CONSENT_DENIED,
  );
  storage.setItem(
    CONSENT_CATEGORIES_STORAGE_KEY,
    JSON.stringify(record.categories),
  );
}

function readLegacyRecord(storage: Storage | null): StoredConsent | null {
  if (!storage) return null;
  const rawBinary = storage.getItem(CONSENT_STORAGE_KEY);
  const rawCategories = storage.getItem(CONSENT_CATEGORIES_STORAGE_KEY);
  let categories: ConsentCategories | null = null;
  if (rawCategories) {
    try {
      categories = normalizeConsentCategories(JSON.parse(rawCategories));
    } catch {
      categories = null;
    }
  }

  if (rawBinary !== CONSENT_GRANTED && rawBinary !== CONSENT_DENIED) {
    return categories ? createConsentRecord(categories) : null;
  }

  return createConsentRecord({
    necessary: true,
    functional: categories?.functional === true,
    analytics: rawBinary === CONSENT_GRANTED,
    marketing: categories?.marketing === true,
  });
}

/**
 * Read the versioned browser record. localStorage is primary; the small
 * JavaScript-readable cookie is a fallback/mirror for auth-enabled SSR flows.
 * Legacy binary/category keys are migrated automatically.
 */
export function readStoredConsent(): StoredConsent | null {
  const storage = getStorage();
  const stored = storage
    ? parseStoredConsent(storage.getItem(CONSENT_RECORD_STORAGE_KEY))
    : null;
  if (stored) return stored;

  const cookie = parseStoredConsent(readCookie());
  if (cookie) {
    try {
      storage?.setItem(CONSENT_RECORD_STORAGE_KEY, serializeConsent(cookie));
      writeLegacyKeys(cookie, storage);
    } catch {
      // Storage can be blocked even when cookies are available.
    }
    return cookie;
  }

  const legacy = readLegacyRecord(storage);
  if (legacy) {
    try {
      storage?.setItem(CONSENT_RECORD_STORAGE_KEY, serializeConsent(legacy));
      writeCookie(legacy);
      writeLegacyKeys(legacy, storage);
    } catch {
      // Ignore unavailable storage/cookie writes during migration.
    }
  }
  return legacy;
}

function persistStoredConsent(record: StoredConsent): void {
  const storage = getStorage();
  try {
    storage?.setItem(CONSENT_RECORD_STORAGE_KEY, serializeConsent(record));
    writeLegacyKeys(record, storage);
    writeCookie(record);
  } catch {
    // A blocked storage area must not break the website or consent controls.
  }
  dispatchConsentChanged(record);
}

/** Persist a validated record received from an authenticated profile. */
export function writeStoredConsent(record: StoredConsent): void {
  persistStoredConsent(
    createConsentRecord(record.categories, record.recordedAt),
  );
}

/** Read the persisted consent value. Returns null when no choice has been made. */
export function readConsent(): ConsentValue | null {
  const record = readStoredConsent();
  if (!record) return null;
  return record.categories.analytics ? CONSENT_GRANTED : CONSENT_DENIED;
}

/**
 * Persist a binary consent choice while retaining the other categories.
 *
 * "Accept" / "Reject" from the banner's FIRST layer is a whole-choice signal:
 * Accept opts in to every optional category, Reject opts out of all of them.
 * (Granular per-category selection is the "Manage settings" path via
 * saveConsentCategories.)
 */
export function writeConsent(value: ConsentValue): void {
  const granted = value === CONSENT_GRANTED;
  persistStoredConsent(
    createConsentRecord({
      necessary: true,
      functional: granted,
      analytics: granted,
      marketing: granted,
    }),
  );
}

/** Clear the stored consent (e.g. for testing or re-prompting). */
export function clearConsent(): void {
  const storage = getStorage();
  try {
    storage?.removeItem(CONSENT_RECORD_STORAGE_KEY);
    storage?.removeItem(CONSENT_STORAGE_KEY);
    storage?.removeItem(CONSENT_CATEGORIES_STORAGE_KEY);
    clearCookie();
  } catch {
    // Ignore unavailable storage/cookie writes during reset.
  }
  dispatchConsentChanged(null);
}

// ── Granular consent categories ───────────────────────────────────────────────
//
// The banner offers a "Manage settings" panel with per-category toggles. The
// starter models four categories (the canonical best-general cookie model):
//   - `necessary`  -- always on, not user-toggleable (strictly-required cookies:
//                    session/auth/security + the consent choice itself).
//   - `functional` -- opt-in. Remembers non-essential UI/language preferences
//                    (e.g. a chosen locale or layout). Persisted so a fork can
//                    gate its own preference storage on it; the shipped starter
//                    stores the flag but wires no functional cookie yet. Stored,
//                    not silently dropped.
//   - `analytics`  -- governs whether the analytics providers (GA gtag AND
//                    PostHog) load. This is the ONLY category the starter
//                    actually wires to script loading, so it stays in lockstep
//                    with the binary readConsent() gate (analytics on ->
//                    "granted", off -> "denied"). GA is NEVER treated as
//                    necessary/essential -- it is strictly analytics-gated.
//                    Forks that add a real provider get it for free.
//   - `marketing`  -- persisted so a fork can gate its own marketing scripts, but
//                    the shipped starter loads nothing for it (no marketing
//                    provider). It is stored, not silently dropped.
//
// TODO(cookieless-audience): if/when an exempt, always-on cookieless
// audience-measurement tier is added (aggregate, no cross-site identifiers, no
// consent required), initialize it HERE independently of the `analytics`
// category gate below -- it must NOT reuse the consent-gated GA/PostHog path.
// The cookie-consent-gated PostHog/GA loaders stay behind `analytics`. See the
// separate design note in cr-company-docs before implementing.
//
// Persisting categories keeps the binary consent value in sync so the existing
// banner-visibility + initAnalytics() paths need no changes: a recorded category
// choice records a binary choice too, which suppresses the banner.

export const CONSENT_CATEGORIES_STORAGE_KEY = "cr_analytics_consent_categories";

/**
 * Read the persisted per-category consent. Returns null when the user has not
 * yet made a granular choice. `necessary` is always forced true regardless of
 * stored contents.
 */
export function readConsentCategories(): ConsentCategories | null {
  return readStoredConsent()?.categories ?? null;
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
    functional: categories.functional === true,
    analytics: categories.analytics === true,
    marketing: categories.marketing === true,
  };

  persistStoredConsent(createConsentRecord(resolved));
  if (resolved.analytics) initAnalytics();

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
 * that needs to know whether analytics exists -- the cookie-consent banner's
 * "auto" gate and the privacy page's analytics section -- reads THIS, so the
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
