// Global test setup for the frontend test suite.
import "@testing-library/jest-dom/vitest";

// ---------------------------------------------------------------------------
// @/i18n/navigation -> test stub (global)
//
// The locale-aware navigation helpers (Link/usePathname/useRouter) need a
// Next.js request or router context that the jsdom test environment cannot
// provide. Every test renders against the stub in
// __tests__/__mocks__/navigation.tsx (see that file for the contract,
// including the mutable mockPathname/mockRouter).
//
// Note: relative paths are used because vi.mock factories are hoisted before
// the module resolver runs; the relative specifier resolves to the same
// absolute module the (aliased) source imports resolve to, so the mock
// applies everywhere.
vi.mock("./i18n/navigation", async () => {
  return await vi.importActual("./__tests__/__mocks__/navigation");
});

// Polyfill TextEncoder / TextDecoder for jsdom (missing from older jsdom versions).
// Required by the A2A streaming client and any test that creates ReadableStreams.
import { TextEncoder, TextDecoder } from "util";
import { ReadableStream as NodeReadableStream } from "stream/web";

if (typeof globalThis.TextEncoder === "undefined") {
  Object.defineProperty(globalThis, "TextEncoder", {
    writable: true,
    value: TextEncoder,
  });
}
if (typeof globalThis.TextDecoder === "undefined") {
  Object.defineProperty(globalThis, "TextDecoder", {
    writable: true,
    value: TextDecoder,
  });
}

// Polyfill ReadableStream for jsdom environments that lack it.
if (typeof globalThis.ReadableStream === "undefined") {
  Object.defineProperty(globalThis, "ReadableStream", {
    writable: true,
    value: NodeReadableStream,
  });
}

// ---------------------------------------------------------------------------
// Browser API polyfills jsdom lacks. Components that animate on scroll
// (StatsSection, ScrollReveal, HeroInsights) and the cookie-consent banner
// (matchMedia) need these in the test environment.
// ---------------------------------------------------------------------------

// IntersectionObserver: no-op that reports nothing intersecting; components
// that animate on view degrade gracefully (no observed entries -> static).
if (typeof globalThis.IntersectionObserver === "undefined") {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds: ReadonlyArray<number> = [];
    disconnect(): void {}
    observe(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
    unobserve(): void {}
  }
  Object.defineProperty(globalThis, "IntersectionObserver", {
    writable: true,
    value: MockIntersectionObserver,
  });
}

// matchMedia: a minimal stub returning a non-matching MediaQueryList so
// prefers-reduced-motion / prefers-color-scheme checks fall back to defaults.
if (typeof globalThis.matchMedia === "undefined") {
  Object.defineProperty(globalThis, "matchMedia", {
    writable: true,
    value: (query: string): MediaQueryList =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList,
  });
}

// ---------------------------------------------------------------------------
// Network guard: unit tests are hermetic. Replace global fetch with a
// throwing stub before each test so an unexpected network call fails loudly
// instead of silently hitting a real socket. Tests that exercise a real
// transport either inject the owning port (e.g. createFormSubmissionPort(fetch))
// or stub global fetch in their own beforeEach (which runs after this hook and
// overrides it). See docs/testing-strategy.md.
// ---------------------------------------------------------------------------
beforeEach(() => {
  globalThis.fetch = (() => {
    throw new Error(
      "Network access forbidden in unit tests -- inject the owning port or stub fetch.",
    );
  }) as unknown as typeof fetch;
});
