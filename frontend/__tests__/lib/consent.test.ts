import {
  CONSENT_STORE_VERSION,
  OPTIONAL_CONSENT_CATEGORIES,
  createConsentRecord,
  defaultConsentCategories,
  normalizeConsentCategories,
  parseStoredConsent,
  serializeConsent,
} from "@/lib/consent";

describe("cookie consent record", () => {
  it("exposes the four-category model (necessary + functional/analytics/marketing)", () => {
    // Order is the display + persistence order.
    expect(OPTIONAL_CONSENT_CATEGORIES).toEqual([
      "functional",
      "analytics",
      "marketing",
    ]);
    // Single version in the early phase (no users, no migration machinery).
    expect(CONSENT_STORE_VERSION).toBe(1);
    expect(defaultConsentCategories()).toEqual({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    });
  });

  it("round-trips a category record with all four categories", () => {
    const record = createConsentRecord({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: false,
    });

    expect(record.version).toBe(1);
    expect(parseStoredConsent(serializeConsent(record))).toEqual(record);
  });

  it("rejects an expired record", () => {
    const record = createConsentRecord(
      defaultConsentCategories(),
      new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
    );

    expect(parseStoredConsent(record)).toBeNull();
  });

  it("accepts a record regardless of its version number (single model)", () => {
    // Single version in early phase: a stored version number must NOT cause a
    // re-prompt. Any numeric version is accepted; missing optional categories
    // default to false (see the lenient-default case below).
    const parsed = parseStoredConsent({
      version: 99,
      recordedAt: new Date().toISOString(),
      categories: { necessary: true, functional: true, analytics: false, marketing: false },
    });
    expect(parsed).not.toBeNull();
    expect(parsed?.categories).toEqual({
      necessary: true,
      functional: true,
      analytics: false,
      marketing: false,
    });
  });

  it("defaults a missing optional category to false rather than rejecting", () => {
    // A categories map lacking `functional` is the lenient single model: it must
    // normalize with `functional: false`, NOT reject.
    expect(
      normalizeConsentCategories({
        analytics: true,
        marketing: false,
      }),
    ).toEqual({
      necessary: true,
      functional: false,
      analytics: true,
      marketing: false,
    });
    // And the same map inside a stored record is accepted with the default.
    const parsed = parseStoredConsent({
      version: CONSENT_STORE_VERSION,
      recordedAt: new Date().toISOString(),
      categories: { necessary: true, analytics: true, marketing: false },
    });
    expect(parsed?.categories).toEqual({
      necessary: true,
      functional: false,
      analytics: true,
      marketing: false,
    });
  });

  it("always restores necessary consent and rejects invalid categories", () => {
    const record = createConsentRecord({
      necessary: false as true,
      functional: false,
      analytics: false,
      marketing: true,
    });
    expect(record.categories.necessary).toBe(true);
    expect(
      parseStoredConsent({
        version: CONSENT_STORE_VERSION,
        recordedAt: new Date().toISOString(),
        categories: {
          necessary: true,
          functional: false,
          analytics: "yes",
          marketing: false,
        },
      }),
    ).toBeNull();
  });
});
