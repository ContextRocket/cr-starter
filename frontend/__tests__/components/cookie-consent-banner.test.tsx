/**
 * Tests for components/cookie-consent-banner.tsx
 *
 * Two layers:
 *   1. The pure visibility decision (shouldShowBanner) -- the three-way
 *      cookieConsent control x recorded consent x analytics-configured
 *      truth-table, tested in isolation with no React or storage.
 *   2. The rendered component -- proves the banner mounts (or not) under the
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

import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// ── Mock the single analytics source + config so we drive the two inputs ──────
// analyticsConfigured() is mocked per-test; the consent store is backed by a
// mutable holder so we control "prior choice" without real localStorage.
const { mockAnalytics, mockFeatures, mockChrome, saveConsentCategoriesMock } =
  vi.hoisted(() => {
    const mockAnalytics = {
      configured: false,
      consent: null as "granted" | "denied" | null,
    };
    return {
      mockAnalytics,
      mockFeatures: {
        cookieConsent: "auto" as "auto" | "on" | "off",
      },
      mockChrome: {
        cookieBannerStyle: "bar" as "bar" | "card" | "terminal",
      },
      // Mirrors the real store: analytics on -> granted, else denied.
      saveConsentCategoriesMock: vi.fn(
        (categories: Record<string, unknown>) => {
          mockAnalytics.consent =
            categories.analytics === true ? "granted" : "denied";
          return {
            necessary: true,
            analytics: categories.analytics === true,
            marketing: categories.marketing === true,
          };
        },
      ),
    };
  });

vi.mock("@/lib/analytics", () => ({
  CONSENT_CHANGED_EVENT: "cr:consent-changed",
  analyticsConfigured: () => mockAnalytics.configured,
  readConsent: () => mockAnalytics.consent,
  grantConsent: vi.fn(() => {
    mockAnalytics.consent = "granted";
  }),
  denyConsent: vi.fn(() => {
    mockAnalytics.consent = "denied";
  }),
  // Granular-category surface used by the shared preferences panel.
  OPTIONAL_CONSENT_CATEGORIES: ["analytics", "marketing"] as const,
  readConsentCategories: () => null,
  saveConsentCategories: saveConsentCategoriesMock,
}));

vi.mock("@/config/site.config", () => ({
  siteConfig: {
    get features() {
      return mockFeatures;
    },
    get chrome() {
      return mockChrome;
    },
  },
}));

import {
  CookieConsentBanner,
  parseShowBannerParam,
  shouldShowBanner,
} from "@/components/shared/cookie-consent-banner";

beforeEach(() => {
  mockAnalytics.configured = false;
  mockAnalytics.consent = null;
  mockFeatures.cookieConsent = "auto";
  mockChrome.cookieBannerStyle = "bar";
  saveConsentCategoriesMock.mockClear();
});

afterEach(() => {
  cleanup();
});

// ── ?showbanner override parsing ──────────────────────────────────────────────

describe("parseShowBannerParam", () => {
  it("returns no override when the param is absent", () => {
    expect(parseShowBannerParam("")).toEqual({ force: false, style: null });
    expect(parseShowBannerParam("?foo=1")).toEqual({
      force: false,
      style: null,
    });
  });

  it("forces the banner with no style when ?showbanner has no value", () => {
    expect(parseShowBannerParam("?showbanner")).toEqual({
      force: true,
      style: null,
    });
  });

  it("forces a specific layout for ?showbanner=bar|card", () => {
    expect(parseShowBannerParam("?showbanner=bar")).toEqual({
      force: true,
      style: "bar",
    });
    expect(parseShowBannerParam("?showbanner=card")).toEqual({
      force: true,
      style: "card",
    });
  });

  it("ignores an unrecognized ?showbanner value (style falls back to config)", () => {
    expect(parseShowBannerParam("?showbanner=full")).toEqual({
      force: true,
      style: null,
    });
  });
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

  it("renders the slim-bar shape when cookieBannerStyle is 'bar' (default)", () => {
    mockFeatures.cookieConsent = "on";
    mockAnalytics.consent = null;
    mockChrome.cookieBannerStyle = "bar";
    render(<CookieConsentBanner />);

    // Labelled region for a11y (role=dialog with an aria-label).
    const banner = screen.getByTestId(BANNER);
    expect(banner).toHaveAttribute("role", "dialog");
    expect(banner).toHaveAttribute("aria-label");

    // Full-width bar pinned to the bottom edge (not the bottom-left card).
    expect(banner.className).toContain("fixed");
    expect(banner.className).toContain("inset-x-0");
    expect(banner.className).toContain("bottom-0");
    // Distinguisher: the bar spans the width; it is NOT the max-w-md card.
    expect(banner.className).not.toContain("max-w-md");

    // Policy link + both action buttons are present.
    expect(screen.getByTestId(POLICY_LINK)).toBeInTheDocument();
    expect(screen.getByTestId(DECLINE)).toBeInTheDocument();
    const accept = screen.getByTestId(ACCEPT);
    expect(accept).toBeInTheDocument();
    // Accept is the primary (accessible action) button; Decline is ghost/outline.
    expect(accept.className).toContain("bg-primary");
    expect(screen.getByTestId(DECLINE).className).toContain("border");
  });

  it("renders the bottom-left card shape when cookieBannerStyle is 'card'", () => {
    mockFeatures.cookieConsent = "on";
    mockAnalytics.consent = null;
    mockChrome.cookieBannerStyle = "card";
    render(<CookieConsentBanner />);

    // Same labelled dialog + testids as the bar (E2E contract preserved).
    const banner = screen.getByTestId(BANNER);
    expect(banner).toHaveAttribute("role", "dialog");
    expect(banner).toHaveAttribute("aria-label");

    // Distinguisher: a compact bottom-left floating card (max-w-md, bottom-6),
    // NOT the full-width bar (no inset-x-0 / bottom-0 span).
    expect(banner.className).toContain("max-w-md");
    expect(banner.className).toContain("sm:bottom-6");
    expect(banner.className).not.toContain("inset-x-0");

    // Same policy link + both actions, same primary Accept / ghost Decline.
    expect(screen.getByTestId(POLICY_LINK)).toBeInTheDocument();
    expect(screen.getByTestId(DECLINE)).toBeInTheDocument();
    const accept = screen.getByTestId(ACCEPT);
    expect(accept).toBeInTheDocument();
    expect(accept.className).toContain("bg-primary");
    expect(screen.getByTestId(DECLINE).className).toContain("border");
  });

  it("renders the terminal card shape when cookieBannerStyle is 'terminal'", () => {
    mockFeatures.cookieConsent = "on";
    mockAnalytics.consent = null;
    mockChrome.cookieBannerStyle = "terminal";
    render(<CookieConsentBanner />);

    // Same labelled dialog + testids as the other layouts (E2E contract).
    const banner = screen.getByTestId(BANNER);
    expect(banner).toHaveAttribute("role", "dialog");
    expect(banner).toHaveAttribute("aria-label");

    // Distinguishers: square corners (terminal surface) + width-capped card,
    // NOT the full-width bar.
    expect(banner.className).toContain("rounded-none");
    expect(banner.className).toContain("sm:max-w-sm");
    expect(banner.className).not.toContain("inset-x-0");

    // Same policy link + all three actions.
    expect(screen.getByTestId(POLICY_LINK)).toBeInTheDocument();
    expect(screen.getByTestId(MANAGE)).toBeInTheDocument();
    expect(screen.getByTestId(DECLINE)).toBeInTheDocument();
    expect(screen.getByTestId(ACCEPT)).toBeInTheDocument();
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

// ── Manage settings / granular preferences modal ──────────────────────────────
//
// Every layout exposes a "Manage settings" control that opens the shared
// preferences MODAL (Necessary locked-on + Analytics + Marketing toggles +
// Save). These behaviors are asserted against EVERY cookieBannerStyle value so
// no layout regresses.

const MANAGE = "cookie-consent-manage";
const DIALOG = "cookie-consent-dialog";
const PREFERENCES = "cookie-consent-preferences";
const SAVE = "cookie-consent-save";
const NECESSARY = "cookie-consent-pref-necessary";
const PREF_ANALYTICS = "cookie-consent-pref-analytics";
const PREF_MARKETING = "cookie-consent-pref-marketing";

describe.each(["bar", "card", "terminal"] as const)(
  "CookieConsentBanner manage settings (%s layout)",
  (style) => {
    function renderOpen() {
      mockFeatures.cookieConsent = "on";
      mockAnalytics.consent = null;
      mockChrome.cookieBannerStyle = style;
      render(<CookieConsentBanner />);
    }

    it("shows a Manage control but no dialog initially", () => {
      renderOpen();
      expect(screen.getByTestId(MANAGE)).toBeInTheDocument();
      expect(screen.queryByTestId(DIALOG)).not.toBeInTheDocument();
    });

    it("opens the preferences dialog on Manage", () => {
      renderOpen();
      fireEvent.click(screen.getByTestId(MANAGE));

      expect(screen.getByTestId(DIALOG)).toBeInTheDocument();
      expect(screen.getByTestId(PREFERENCES)).toBeInTheDocument();
      // Necessary is present and locked on (disabled checkbox, checked).
      const necessary = screen
        .getByTestId(NECESSARY)
        .querySelector("input") as HTMLInputElement;
      expect(necessary.checked).toBe(true);
      expect(necessary.disabled).toBe(true);
      // Analytics + Marketing are toggleable.
      expect(screen.getByTestId(PREF_ANALYTICS)).toBeInTheDocument();
      expect(screen.getByTestId(PREF_MARKETING)).toBeInTheDocument();
    });

    it("Save persists the chosen categories and dismisses the dialog + banner", () => {
      renderOpen();
      fireEvent.click(screen.getByTestId(MANAGE));

      // Turn analytics on, leave marketing off.
      const analytics = screen
        .getByTestId(PREF_ANALYTICS)
        .querySelector("input") as HTMLInputElement;
      fireEvent.click(analytics);

      fireEvent.click(screen.getByTestId(SAVE));

      expect(saveConsentCategoriesMock).toHaveBeenCalledTimes(1);
      expect(saveConsentCategoriesMock).toHaveBeenCalledWith(
        expect.objectContaining({ analytics: true, marketing: false }),
      );
      // Dialog AND banner are dismissed after saving preferences.
      expect(screen.queryByTestId(DIALOG)).not.toBeInTheDocument();
      expect(screen.queryByTestId(BANNER)).not.toBeInTheDocument();
    });

    it("closing the dialog without saving keeps the banner visible", () => {
      renderOpen();
      fireEvent.click(screen.getByTestId(MANAGE));
      expect(screen.getByTestId(DIALOG)).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("cookie-consent-dialog-close"));

      expect(screen.queryByTestId(DIALOG)).not.toBeInTheDocument();
      expect(screen.getByTestId(BANNER)).toBeInTheDocument();
    });
  },
);
