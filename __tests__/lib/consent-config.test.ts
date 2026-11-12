import { describe, expect, it } from "vitest";
import { shouldShowConsentBanner } from "@/lib/consent-config";

describe("automatic cookie consent prompt", () => {
  it("shows for optional analytics integrations by default", () => {
    expect(shouldShowConsentBanner("auto", "auto", {
      analytics: { enabled: true },
      productAnalytics: { enabled: true, consentCategory: "analytics" },
    })).toBe(true);
  });

  it("does not show when there are no optional integrations", () => {
    expect(shouldShowConsentBanner("auto", "auto", {})).toBe(false);
    expect(shouldShowConsentBanner("auto", "auto", {
      requiredSession: { enabled: true, consentCategory: "necessary" },
    })).toBe(false);
    expect(shouldShowConsentBanner("auto", "auto", {
      disabledAnalytics: { enabled: false },
    })).toBe(false);
  });

  it("respects explicit prompt and integration-manager choices", () => {
    expect(shouldShowConsentBanner("on", "auto", {})).toBe(true);
    expect(shouldShowConsentBanner("off", "auto", {
      analytics: { enabled: true },
    })).toBe(false);
    expect(shouldShowConsentBanner("on", "always", {})).toBe(false);
    expect(shouldShowConsentBanner("on", "external", {})).toBe(false);
  });
});
