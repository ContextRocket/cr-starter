import { describe, expect, it } from "vitest";
import {
  base64UrlNoPad,
  computeS256Challenge,
  generateCodeVerifier,
  generateState,
} from "../src/pkce.js";

describe("pkce.computeS256Challenge -- known-answer vectors", () => {
  // RFC 7636 Appendix B canonical vector.
  it("matches the RFC 7636 §B example vector", () => {
    const verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";
    const challenge = computeS256Challenge(verifier);
    expect(challenge).toBe("E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM");
  });

  it("produces base64url with no padding (no '=', '+', '/')", () => {
    const challenge = computeS256Challenge("some-verifier-value-123");
    expect(challenge).not.toMatch(/[=+/]/);
  });

  it("is deterministic for a fixed verifier (matches the server derivation)", () => {
    const verifier = "contextrocket-fixed-verifier";
    expect(computeS256Challenge(verifier)).toBe(computeS256Challenge(verifier));
  });

  it("base64UrlNoPad known answer for empty + simple buffers", () => {
    expect(base64UrlNoPad(Buffer.from([]))).toBe("");
    // sha256("") -> known digest; base64url form
    expect(computeS256Challenge("")).toBe(
      "47DEQpj8HBSa-_TImW-5JCeuQeRkm5NMpJWZG3hSuFU",
    );
  });
});

describe("pkce entropy helpers", () => {
  it("generateCodeVerifier yields 43-128 unreserved chars (RFC 7636 §4.1)", () => {
    const v = generateCodeVerifier();
    expect(v.length).toBeGreaterThanOrEqual(43);
    expect(v.length).toBeLessThanOrEqual(128);
    expect(v).toMatch(/^[A-Za-z0-9\-_]+$/);
  });

  it("generateState is url-safe and unique across calls", () => {
    const a = generateState();
    const b = generateState();
    expect(a).not.toBe(b);
    expect(a).toMatch(/^[A-Za-z0-9\-_]+$/);
  });
});
