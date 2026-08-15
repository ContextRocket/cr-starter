import { describe, it, expect, vi } from "vitest";

import { isChromeLinkVisible } from "@/lib/nav-visibility";
import type { NavLinkConfig } from "@/company.config";

// Only siteConfig.features is read by the predicate (for the featureFlag gate).
// Mock a minimal siteConfig so the test is independent of the real config file.
vi.mock("@/site.config", () => ({
  siteConfig: { features: { blog: true } },
}));

const DASHBOARD: NavLinkConfig = {
  labelKey: "nav.dashboard",
  href: "/dashboard",
  appOnly: true,
};
const BLOG: NavLinkConfig = {
  labelKey: "nav.blog",
  href: "/blog",
  featureFlag: "blog",
};
const PLAIN: NavLinkConfig = { labelKey: "nav.about", href: "/about" };

describe("isChromeLinkVisible — appOnly auth-gating", () => {
  it("hides an appOnly link (Dashboard) for a guest, even when showAppLinks is true", () => {
    // The core rule: guests / public never see app links.
    expect(isChromeLinkVisible(DASHBOARD, /* isGuest */ true, true)).toBe(false);
  });

  it("shows an appOnly link (Dashboard) for an authenticated viewer", () => {
    expect(isChromeLinkVisible(DASHBOARD, /* isGuest */ false, true)).toBe(true);
  });

  it("fails closed: hides an appOnly link when auth is unknown (caller passes isGuest=true)", () => {
    // Static export / no request context resolves isGuest=true upstream; the
    // predicate must then hide app links.
    expect(isChromeLinkVisible(DASHBOARD, true)).toBe(false);
  });

  it("hides an appOnly link for everyone (even authenticated) when showAppLinks is false", () => {
    expect(isChromeLinkVisible(DASHBOARD, /* isGuest */ false, false)).toBe(
      false,
    );
  });

  it("defaults showAppLinks to true so an authenticated viewer sees the app link", () => {
    expect(isChromeLinkVisible(DASHBOARD, /* isGuest */ false)).toBe(true);
  });
});

describe("isChromeLinkVisible — non-app links are unaffected by auth", () => {
  it("shows a plain link to a guest", () => {
    expect(isChromeLinkVisible(PLAIN, true, true)).toBe(true);
  });

  it("shows a plain link to an authenticated viewer", () => {
    expect(isChromeLinkVisible(PLAIN, false, true)).toBe(true);
  });

  it("shows a plain link even when showAppLinks is false (not an app link)", () => {
    expect(isChromeLinkVisible(PLAIN, true, false)).toBe(true);
  });
});

describe("isChromeLinkVisible — featureFlag gate", () => {
  it("shows a link whose featureFlag is enabled", () => {
    expect(isChromeLinkVisible(BLOG, true, true)).toBe(true);
  });

  it("hides a link whose featureFlag is disabled", () => {
    const disabled: NavLinkConfig = {
      labelKey: "nav.gone",
      href: "/gone",
      // @ts-expect-error — exercising an off flag not present in the mock.
      featureFlag: "missing",
    };
    expect(isChromeLinkVisible(disabled, false, true)).toBe(false);
  });
});
