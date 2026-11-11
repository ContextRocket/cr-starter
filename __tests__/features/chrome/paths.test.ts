/**
 * CHROME-001 — locale-aware public paths.
 */
import { expect, it } from "vitest";
import {
  blogIndexHref,
  blogPostHref,
  homeHref,
  localizedHref,
} from "@/lib/paths";
import { scenario, thenStep } from "../../support/bdd";

scenario("CHROME-001 locale-aware public paths", () => {
  it("prefixes locale on localized hrefs", async () => {
    await thenStep("home and blog paths include locale and trailing slash", () => {
      expect(homeHref("en")).toMatch(/\/en\/?$/);
      expect(blogIndexHref("en")).toContain("/en/");
      expect(blogPostHref("en", "getting-started")).toContain(
        "/en/",
      );
      expect(blogPostHref("en", "getting-started")).toContain(
        "getting-started",
      );
      expect(localizedHref("de", "/contact")).toBe("/de/contact/");
    });
  });
});
