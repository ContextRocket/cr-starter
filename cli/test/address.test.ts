import { describe, expect, it } from "vitest";
import {
  ContentAddressError,
  normalizeContentFolderPath,
  parseContentAddress,
} from "../src/address.js";

describe("parseContentAddress -- S3-analogous grammar", () => {
  it("parses bucket/folder/filename", () => {
    expect(parseContentAddress("cr://acme/gtm/positioning.md")).toEqual({
      bucket: "acme",
      folderPath: "gtm",
      filename: "positioning.md",
    });
  });

  it("trailing slash => folder prefix, no filename", () => {
    expect(parseContentAddress("cr://acme/gtm/")).toEqual({
      bucket: "acme",
      folderPath: "gtm",
      filename: null,
    });
  });

  it("bare filename at bucket root", () => {
    expect(parseContentAddress("cr://acme/report.md")).toEqual({
      bucket: "acme",
      folderPath: "",
      filename: "report.md",
    });
  });

  it("bucket only => root prefix", () => {
    expect(parseContentAddress("cr://acme")).toEqual({
      bucket: "acme",
      folderPath: "",
      filename: null,
    });
  });

  it("collapses repeated slashes in the folder path", () => {
    expect(parseContentAddress("cr://acme/a//b/c.txt")).toEqual({
      bucket: "acme",
      folderPath: "a/b",
      filename: "c.txt",
    });
  });
});

describe("parseContentAddress -- fail-closed on traversal / bad input", () => {
  it("rejects a missing cr:// scheme", () => {
    expect(() => parseContentAddress("s3://acme/x")).toThrow(ContentAddressError);
  });

  it("rejects a '..' filename (traversal)", () => {
    expect(() => parseContentAddress("cr://acme/gtm/..")).toThrow(ContentAddressError);
  });

  it("rejects a '..' folder segment (traversal)", () => {
    expect(() => parseContentAddress("cr://acme/../secret.md")).toThrow(ContentAddressError);
  });

  it("rejects a backslash in a filename", () => {
    expect(() => parseContentAddress("cr://acme/a\\b.md")).toThrow(ContentAddressError);
  });

  it("rejects a NUL byte anywhere", () => {
    expect(() => parseContentAddress("cr://acme/a\x00b.md")).toThrow(ContentAddressError);
  });

  it("rejects an empty address", () => {
    expect(() => parseContentAddress("   ")).toThrow(ContentAddressError);
  });
});

describe("normalizeContentFolderPath", () => {
  it("normalizes and preserves internal spaces", () => {
    expect(normalizeContentFolderPath("  /a/ my folder /b/  ")).toBe("a/my folder/b");
  });
  it("empty/null => root", () => {
    expect(normalizeContentFolderPath("")).toBe("");
    expect(normalizeContentFolderPath(null)).toBe("");
  });
});
