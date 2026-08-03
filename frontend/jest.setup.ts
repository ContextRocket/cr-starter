// Global test setup for the frontend test suite.
import "@testing-library/jest-dom";

// ---------------------------------------------------------------------------
// @/i18n/navigation -> test stub (global)
//
// next-intl's createNavigation helpers (Link/usePathname/useRouter) need a
// Next.js request or router context that jest cannot provide. Every test
// renders against the stub in __tests__/__mocks__/navigation.tsx (see that
// file for the contract, including the mutable mockPathname/mockRouter).
//
// Note: the Next SWC transformer rewrites `@/` aliases to relative paths at
// transform time, so a moduleNameMapper regex never matches this specifier,
// and jest.mock("@/...") paths cannot be resolved by jest's resolver. Use a
// relative path here: it resolves to the same absolute module the (rewritten)
// source imports resolve to, so the mock applies everywhere.
jest.mock(
  "./i18n/navigation",
  () => jest.requireActual("./__tests__/__mocks__/navigation"),
);

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
