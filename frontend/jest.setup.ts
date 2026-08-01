// Global test setup for the frontend test suite.
import "@testing-library/jest-dom";

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
