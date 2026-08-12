// Global test setup for the frontend test suite.
import "@testing-library/jest-dom/vitest";

// ---------------------------------------------------------------------------
// @/i18n/navigation -> test stub (global)
//
// next-intl's createNavigation helpers (Link/usePathname/useRouter) need a
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
