/**
 * Pure cookie-consent data contract shared by browser storage, auth-starter
 * profile synchronization, and future presenters.
 *
 * This module deliberately has no browser, Next.js, or backend dependencies so
 * it can be used by both client components and server actions. The record is
 * small enough for a first-party cookie, but localStorage remains the primary
 * browser store in the public starter.
 */

// Bumped 1 -> 2 when `functional` (preferences) was added as a 4th consent
// category. A stored v1 record (which has no `functional` field) is a different
// consent model, so it must NOT silently pass: parseStoredConsent rejects it on
// the version check and the visitor is re-prompted for a compliant re-consent.
export const CONSENT_STORE_VERSION = 2;
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
  // Every optional category must be a present boolean. A legacy record missing
  // `functional` fails here (returns null) rather than defaulting silently, so
  // the changed model re-prompts instead of quietly granting/denying a category
  // the visitor never saw.
  if (
    typeof record.functional !== "boolean" ||
    typeof record.analytics !== "boolean" ||
    typeof record.marketing !== "boolean"
  ) {
    return null;
  }

  return {
    necessary: true,
    functional: record.functional,
    analytics: record.analytics,
    marketing: record.marketing,
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
 * Parse a localStorage or cookie value. Invalid and expired records are
 * rejected so a changed consent policy can prompt the visitor again.
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
  if (record.version !== CONSENT_STORE_VERSION) return null;
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
