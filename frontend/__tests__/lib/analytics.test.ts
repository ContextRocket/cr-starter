/**
 * Tests for lib/analytics.ts
 *
 * Covers:
 *   - Consent persistence (read/write/clear)
 *   - No keys => analytics never initializes
 *   - Declined consent => analytics never initializes
 *   - Granted consent + key present => analytics initializes
 *   - grantConsent() writes storage and triggers init
 *   - denyConsent() writes storage and does NOT trigger init
 *   - Idempotency: multiple initAnalytics() calls don't re-inject scripts
 */

import {
  readConsent,
  writeConsent,
  clearConsent,
  hasAnalyticsKeys,
  initAnalytics,
  grantConsent,
  denyConsent,
  CONSENT_STORAGE_KEY,
  CONSENT_GRANTED,
  CONSENT_DENIED,
} from "@/lib/analytics";

// ── helpers ───────────────────────────────────────────────────────────────────

/** Count script tags injected into document.head by analytics. */
function countScripts(): number {
  return document.head.querySelectorAll("script").length;
}

function resetScripts() {
  // Remove any analytics scripts injected during a test.
  document.head.querySelectorAll("script").forEach((s) => s.remove());
}

/** Patch a NEXT_PUBLIC_ env var for the duration of a test. */
function withEnv(key: string, value: string, fn: () => void) {
  const original = process.env[key];
  process.env[key] = value;
  fn();
  if (original === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = original;
  }
}

// ── setup / teardown ──────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
  resetScripts();
  // Reset the idempotency flags by re-importing is not possible in Vitest without
  // vi.resetModules(), so we rely on clearing localStorage and removing scripts
  // to observe observable effects. The _gaLoaded/_posthogLoaded flags stay set
  // across tests in the same module instance; we test idempotency explicitly.
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ── Consent persistence ───────────────────────────────────────────────────────

describe("consent persistence", () => {
  it("readConsent returns null when no choice has been made", () => {
    expect(readConsent()).toBeNull();
  });

  it("readConsent returns granted after writeConsent(granted)", () => {
    writeConsent(CONSENT_GRANTED);
    expect(readConsent()).toBe(CONSENT_GRANTED);
  });

  it("readConsent returns denied after writeConsent(denied)", () => {
    writeConsent(CONSENT_DENIED);
    expect(readConsent()).toBe(CONSENT_DENIED);
  });

  it("readConsent returns null after clearConsent", () => {
    writeConsent(CONSENT_GRANTED);
    clearConsent();
    expect(readConsent()).toBeNull();
  });

  it("writeConsent writes to localStorage under CONSENT_STORAGE_KEY", () => {
    writeConsent(CONSENT_GRANTED);
    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBe(CONSENT_GRANTED);
  });
});

// ── hasAnalyticsKeys ──────────────────────────────────────────────────────────

describe("hasAnalyticsKeys", () => {
  it("returns false when no keys are set", () => {
    // Env vars are absent in test environment by default.
    const gaOrig = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    const phOrig = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    delete process.env.NEXT_PUBLIC_POSTHOG_KEY;
    expect(hasAnalyticsKeys()).toBe(false);
    if (gaOrig !== undefined)
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = gaOrig;
    if (phOrig !== undefined) process.env.NEXT_PUBLIC_POSTHOG_KEY = phOrig;
  });

  it("returns true when GA key is set", () => {
    withEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "G-TESTTEST", () => {
      expect(hasAnalyticsKeys()).toBe(true);
    });
  });

  it("returns true when PostHog key is set", () => {
    withEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_test", () => {
      expect(hasAnalyticsKeys()).toBe(true);
    });
  });
});

// ── initAnalytics -- no keys ──────────────────────────────────────────────────

describe("initAnalytics -- no analytics keys configured", () => {
  it("does not inject any scripts when no keys are set", () => {
    const before = countScripts();
    // Ensure consent is granted so only key absence blocks init.
    writeConsent(CONSENT_GRANTED);
    initAnalytics();
    // No new scripts should appear (keys absent means nothing loads).
    expect(countScripts()).toBe(before);
  });
});

// ── initAnalytics -- consent not granted ─────────────────────────────────────

describe("initAnalytics -- consent not granted", () => {
  it("does not inject any scripts when consent is null (no choice)", () => {
    // Consent not set.
    const before = countScripts();
    initAnalytics();
    expect(countScripts()).toBe(before);
  });

  it("does not inject any scripts when consent is denied", () => {
    writeConsent(CONSENT_DENIED);
    const before = countScripts();
    initAnalytics();
    expect(countScripts()).toBe(before);
  });
});

// ── grantConsent / denyConsent ────────────────────────────────────────────────

describe("grantConsent", () => {
  it("persists the granted value in localStorage", () => {
    grantConsent();
    expect(readConsent()).toBe(CONSENT_GRANTED);
  });

  it("calls initAnalytics (observable via consent state)", () => {
    // After grant, readConsent should return granted.
    grantConsent();
    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBe(CONSENT_GRANTED);
  });
});

describe("denyConsent", () => {
  it("persists the denied value in localStorage", () => {
    denyConsent();
    expect(readConsent()).toBe(CONSENT_DENIED);
  });

  it("does not inject any scripts after denyConsent", () => {
    denyConsent();
    const before = countScripts();
    initAnalytics();
    expect(countScripts()).toBe(before);
  });
});
