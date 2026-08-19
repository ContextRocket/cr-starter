/**
 * Tests for lib/safe-href.ts -- the central URL scheme guard for
 * metadata-supplied links.
 */

import { safeHref } from "@/lib/safe-href";

describe("safeHref()", () => {
  it("allows https URLs", () => {
    expect(safeHref("https://example.com/page")).toBe(
      "https://example.com/page",
    );
  });

  it("allows http URLs", () => {
    expect(safeHref("http://example.com")).toBe("http://example.com");
  });

  it("rejects javascript: URLs", () => {
    expect(safeHref("javascript:alert(1)")).toBeNull();
  });

  it("rejects javascript: URLs with mixed casing", () => {
    expect(safeHref("JaVaScRiPt:alert(1)")).toBeNull();
  });

  it("rejects data: URLs", () => {
    expect(safeHref("data:text/html,<script>alert(1)</script>")).toBeNull();
  });

  it("rejects vbscript: URLs", () => {
    expect(safeHref("vbscript:msgbox(1)")).toBeNull();
  });

  it("rejects blob: URLs", () => {
    expect(safeHref("blob:https://example.com/uuid")).toBeNull();
  });

  it("rejects file: URLs", () => {
    expect(safeHref("file:///etc/passwd")).toBeNull();
  });

  it("rejects relative paths (no absolute target)", () => {
    expect(safeHref("/relative/path")).toBeNull();
    expect(safeHref("relative")).toBeNull();
  });

  it("rejects empty, null, and undefined", () => {
    expect(safeHref("")).toBeNull();
    expect(safeHref(null)).toBeNull();
    expect(safeHref(undefined)).toBeNull();
  });

  it("rejects malformed URLs", () => {
    expect(safeHref("http://")).toBeNull();
  });
});
