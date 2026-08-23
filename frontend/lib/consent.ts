/**
 * Pure cookie-consent data contract shared by browser storage, auth-starter
 * profile synchronization, and future presenters.
 *
 * This module deliberately has no browser, Next.js, or backend dependencies so
 * it can be used by both client components and server actions. The record is
 * small enough for a first-party cookie, but localStorage remains the primary
 * browser store in the public starter.
 */

// Single version in early phase; re-introduce versioned re-prompt when we have
// users and change the model (see cookie-taxonomy.md).
export const CONSENT_STORE_VERSION = 1;
export const CONSENT_COOKIE_NAME = "cr_cookie_consent";
export const CONSENT_MAX_AGE_SECONDS = 395 * 24 * 60 * 60;
export const CONSENT_MAX_AGE_MS = CONSENT_MAX_AGE_SECONDS * 1000;
export const CONSENT_CHANGED_EVENT = "cr-consent-changed";

// Order is the display + persistence order: functional, analytics, marketing.
// `necessary` is not optional (always literal true) and is never in this list.
export const OPTIONAL_CONSENT_CATEGORIES = [
  "functional",
  "analytics",
  "marketing",
] as const;

export type OptionalConsentCategory =
  (typeof OPTIONAL_CONSENT_CATEGORIES)[number];

export type ConsentCategories = { necessary: true } & Record<
  OptionalConsentCategory,
  boolean
>;

export interface StoredConsent {
  version: typeof CONSENT_STORE_VERSION;
  recordedAt: string;
  categories: ConsentCategories;
}

export function defaultConsentCategories(): ConsentCategories {
  return {
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  };
}

export function normalizeConsentCategories(
  value: unknown,
): ConsentCategories | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }

  const record = value as Record<string, unknown>;
  // Single-model lenient default: a missing optional category is treated as
  // `false` (not granted), not a rejection. Fail closed only on genuinely
  // malformed input -- a present-but-wrong-type value (e.g. a string) is
  // rejected below.
  if (
    ("functional" in record && typeof record.functional !== "boolean") ||
    ("analytics" in record && typeof record.analytics !== "boolean") ||
    ("marketing" in record && typeof record.marketing !== "boolean")
  ) {
    return null;
  }

  return {
    necessary: true,
    functional: record.functional === true,
    analytics: record.analytics === true,
    marketing: record.marketing === true,
  };
}

export function createConsentRecord(
  categories: ConsentCategories,
  recordedAt = new Date().toISOString(),
): StoredConsent {
  const normalized = normalizeConsentCategories(categories);
  if (!normalized) throw new Error("Invalid cookie consent categories");
  if (!Number.isFinite(new Date(recordedAt).getTime())) {
    throw new Error("Invalid cookie consent timestamp");
  }

  return {
    version: CONSENT_STORE_VERSION,
    recordedAt,
    categories: normalized,
  };
}

export function serializeConsent(record: StoredConsent): string {
  return JSON.stringify(record);
}

/**
 * Parse a localStorage or cookie value. Malformed and expired records are
 * rejected (fail closed) so the visitor is prompted again; a record is never
 * rejected merely for its version number in the current single-version model.
 */
export function parseStoredConsent(
  value: unknown,
  now = Date.now(),
): StoredConsent | null {
  let parsed: unknown = value;

  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      try {
        parsed = JSON.parse(decodeURIComponent(value));
      } catch {
        return null;
      }
    }
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return null;
  }

  const record = parsed as Record<string, unknown>;
  // Single version in early phase: do NOT reject a record on its version number.
  // A stored `version` field, if present, must at least be a number, but any
  // number is accepted (there is only one model). Re-introduce a version gate
  // when we have users and change the model (see cookie-taxonomy.md).
  if ("version" in record && typeof record.version !== "number") return null;
  if (typeof record.recordedAt !== "string") return null;

  const recordedAt = new Date(record.recordedAt).getTime();
  if (!Number.isFinite(recordedAt)) return null;
  if (now - recordedAt > CONSENT_MAX_AGE_MS) return null;

  const categories = normalizeConsentCategories(record.categories);
  if (!categories) return null;

  return {
    version: CONSENT_STORE_VERSION,
    recordedAt: record.recordedAt,
    categories,
  };
}
