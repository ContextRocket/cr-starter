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
    // The store version is bumped so the added `functional` category re-prompts
    // existing visitors (compliant re-consent on model change).
    expect(CONSENT_STORE_VERSION).toBe(2);
    expect(defaultConsentCategories()).toEqual({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    });
  });

  it("round-trips a versioned category record with all four categories", () => {
    const record = createConsentRecord({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: false,
    });

    expect(record.version).toBe(2);
    expect(parseStoredConsent(serializeConsent(record))).toEqual(record);
  });

  it("rejects an expired record", () => {
    const record = createConsentRecord(
      defaultConsentCategories(),
      new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
    );

    expect(parseStoredConsent(record)).toBeNull();
  });

  it("rejects records from an unknown schema version", () => {
    expect(
      parseStoredConsent({
        version: CONSENT_STORE_VERSION + 1,
        recordedAt: new Date().toISOString(),
        categories: defaultConsentCategories(),
      }),
    ).toBeNull();
  });

  it("re-prompts a legacy v1 record (older store version -> null)", () => {
    // A pre-`functional` record was stored under version 1. It must NOT pass:
    // the version check rejects it so the visitor is re-prompted.
    expect(
      parseStoredConsent({
        version: 1,
        recordedAt: new Date().toISOString(),
        categories: { necessary: true, analytics: true, marketing: false },
      }),
    ).toBeNull();
  });

  it("fails normalization when `functional` is missing (does NOT silently pass)", () => {
    // Even at the current version, a categories map lacking `functional` is the
    // old model. It must fail normalization rather than defaulting the field.
    expect(
      normalizeConsentCategories({
        analytics: true,
        marketing: false,
      }),
    ).toBeNull();
    // And the same map inside an otherwise-current record is rejected.
    expect(
      parseStoredConsent({
        version: CONSENT_STORE_VERSION,
        recordedAt: new Date().toISOString(),
        categories: { necessary: true, analytics: true, marketing: false },
      }),
    ).toBeNull();
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
