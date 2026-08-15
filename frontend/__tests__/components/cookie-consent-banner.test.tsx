/**
 * Tests for components/cookie-consent-banner.tsx
 *
 * Two layers:
 *   1. The pure visibility decision (shouldShowBanner) — the three-way
 *      cookieConsent control x recorded consent x analytics-configured
 *      truth-table, tested in isolation with no React or storage.
 *   2. The rendered component — proves the banner mounts (or not) under the
 *      shipped default and the explicit overrides, with analyticsConfigured()
 *      and the consent store mocked.
 *
 * Truth-table (consent = no prior choice unless noted):
 *   auto + analytics configured  -> RENDERS
 *   on                           -> RENDERS (regardless of analytics)
 *   auto + no analytics          -> DOES NOT render  (the shipped default)
 *   off                          -> DOES NOT render
 *   any mode + consent recorded  -> DOES NOT render
 */

import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// ── Mock the single analytics source + config so we drive the two inputs ──────
// analyticsConfigured() is mocked per-test; the consent store is backed by a
// mutable holder so we control "prior choice" without real localStorage.
const { mockAnalytics, mockFeatures } = vi.hoisted(() => ({
  mockAnalytics: {
    configured: false,
    consent: null as "granted" | "denied" | null,
  },
  mockFeatures: {
    cookieConsent: "auto" as "auto" | "on" | "off",
  },
}));

vi.mock("@/lib/analytics", () => ({
  analyticsConfigured: () => mockAnalytics.configured,
  readConsent: () => mockAnalytics.consent,
  grantConsent: vi.fn(() => {
    mockAnalytics.consent = "granted";
  }),
  denyConsent: vi.fn(() => {
    mockAnalytics.consent = "denied";
  }),
}));

vi.mock("@/site.config", () => ({
  siteConfig: {
    get features() {
      return mockFeatures;
    },
  },
}));

import {
  CookieConsentBanner,
  shouldShowBanner,
} from "@/components/cookie-consent-banner";

beforeEach(() => {
  mockAnalytics.configured = false;
  mockAnalytics.consent = null;
  mockFeatures.cookieConsent = "auto";
});

afterEach(() => {
  cleanup();
});

// ── Pure decision truth-table ─────────────────────────────────────────────────

describe("shouldShowBanner", () => {
  it("auto + analytics configured + no consent -> true", () => {
    expect(shouldShowBanner("auto", null, true)).toBe(true);
  });

  it("auto + NO analytics + no consent -> false (shipped default)", () => {
    expect(shouldShowBanner("auto", null, false)).toBe(false);
  });

  it("on + no consent -> true regardless of analytics", () => {
    expect(shouldShowBanner("on", null, false)).toBe(true);
    expect(shouldShowBanner("on", null, true)).toBe(true);
  });

  it("off -> false in every combination", () => {
    expect(shouldShowBanner("off", null, true)).toBe(false);
    expect(shouldShowBanner("off", null, false)).toBe(false);
  });

  it("recorded consent -> false for auto and on", () => {
    expect(shouldShowBanner("auto", "granted", true)).toBe(false);
    expect(shouldShowBanner("auto", "denied", true)).toBe(false);
    expect(shouldShowBanner("on", "granted", true)).toBe(false);
    expect(shouldShowBanner("on", "denied", false)).toBe(false);
  });
});

// ── Rendered component ────────────────────────────────────────────────────────

const BANNER = "cookie-consent-banner";
const ACCEPT = "cookie-consent-accept";
const DECLINE = "cookie-consent-decline";
const POLICY_LINK = "cookie-consent-policy-link";

describe("CookieConsentBanner", () => {
  it("renders when auto + analytics configured + no prior consent", () => {
    mockFeatures.cookieConsent = "auto";
    mockAnalytics.configured = true;
    mockAnalytics.consent = null;
    render(<CookieConsentBanner />);
    expect(screen.getByTestId(BANNER)).toBeInTheDocument();
  });

  it("renders the slim-bar shape: labelled dialog + policy link + both actions", () => {
    mockFeatures.cookieConsent = "on";
    mockAnalytics.consent = null;
    render(<CookieConsentBanner />);

    // Labelled region for a11y (role=dialog with an aria-label).
    const banner = screen.getByTestId(BANNER);
    expect(banner).toHaveAttribute("role", "dialog");
    expect(banner).toHaveAttribute("aria-label");

    // Full-width bar pinned to the bottom edge (not the prior bottom-left card).
    expect(banner.className).toContain("fixed");
    expect(banner.className).toContain("inset-x-0");
    expect(banner.className).toContain("bottom-0");

    // Policy link + both action buttons are present.
    expect(screen.getByTestId(POLICY_LINK)).toBeInTheDocument();
    expect(screen.getByTestId(DECLINE)).toBeInTheDocument();
    const accept = screen.getByTestId(ACCEPT);
    expect(accept).toBeInTheDocument();
    // Accept is the brand-accent primary; Decline is ghost/outline.
    expect(accept.className).toContain("bg-brand-accent");
    expect(screen.getByTestId(DECLINE).className).toContain("border");
  });

  it("renders when mode is on (analytics not configured)", () => {
    mockFeatures.cookieConsent = "on";
    mockAnalytics.configured = false;
    mockAnalytics.consent = null;
    render(<CookieConsentBanner />);
    expect(screen.getByTestId(BANNER)).toBeInTheDocument();
  });

  it("does NOT render when auto + no analytics (the shipped default)", () => {
    mockFeatures.cookieConsent = "auto";
    mockAnalytics.configured = false;
    mockAnalytics.consent = null;
    render(<CookieConsentBanner />);
    expect(screen.queryByTestId(BANNER)).not.toBeInTheDocument();
  });

  it("does NOT render when mode is off (even with analytics + no consent)", () => {
    mockFeatures.cookieConsent = "off";
    mockAnalytics.configured = true;
    mockAnalytics.consent = null;
    render(<CookieConsentBanner />);
    expect(screen.queryByTestId(BANNER)).not.toBeInTheDocument();
  });

  it("does NOT render when consent is already recorded", () => {
    mockFeatures.cookieConsent = "auto";
    mockAnalytics.configured = true;
    mockAnalytics.consent = "granted";
    render(<CookieConsentBanner />);
    expect(screen.queryByTestId(BANNER)).not.toBeInTheDocument();
  });
});
