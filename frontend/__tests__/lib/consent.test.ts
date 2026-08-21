import {
  CONSENT_STORE_VERSION,
  createConsentRecord,
  defaultConsentCategories,
  parseStoredConsent,
  serializeConsent,
} from "@/lib/consent";

describe("cookie consent record", () => {
  it("round-trips a versioned category record", () => {
    const record = createConsentRecord({
      necessary: true,
      analytics: true,
      marketing: false,
    });

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

  it("always restores necessary consent and rejects invalid categories", () => {
    const record = createConsentRecord({
      necessary: false as true,
      analytics: false,
      marketing: true,
    });
    expect(record.categories.necessary).toBe(true);
    expect(
      parseStoredConsent({
        version: CONSENT_STORE_VERSION,
        recordedAt: new Date().toISOString(),
        categories: { necessary: true, analytics: "yes", marketing: false },
      }),
    ).toBeNull();
  });
});
