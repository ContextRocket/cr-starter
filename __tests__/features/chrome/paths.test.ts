/**
 * CHROME-001 — locale-aware public paths.
 */
import { expect, it } from "vitest";
import {
  blogIndexHref,
  blogPostHref,
  homeHref,
  localizedHref,
  withAssetBase,
} from "@/lib/paths";
import { scenario, thenStep } from "../../support/bdd";

scenario("CHROME-001 locale-aware public paths", () => {
  it("prefixes locale on localized hrefs", async () => {
    await thenStep(
      "home and blog paths include locale and trailing slash",
      () => {
        expect(homeHref("en")).toMatch(/\/en\/?$/);
        expect(blogIndexHref("en")).toContain("/en/");
        expect(blogPostHref("en", "getting-started")).toContain("/en/");
        expect(blogPostHref("en", "getting-started")).toContain(
          "getting-started",
        );
        expect(localizedHref("de", "/contact")).toBe("/de/contact/");
      },
    );
  });
});

it("CHROME-001: keeps default website assets unchanged and prefixes container assets exactly once", () => {
  expect(withAssetBase("/embed/widget.js", "/")).toBe("/embed/widget.js");
  expect(withAssetBase("/embed/widget.js", "/p/workshop/")).toBe(
    "/p/workshop/embed/widget.js",
  );
  expect(withAssetBase("/p/workshop/embed/widget.js", "/p/workshop/")).toBe(
    "/p/workshop/embed/widget.js",
  );
  expect(withAssetBase("https://example.test/image.svg", "/p/workshop/")).toBe(
    "https://example.test/image.svg",
  );
  expect(withAssetBase("//example.test/image.svg", "/p/workshop/")).toBe(
    "//example.test/image.svg",
  );
});
