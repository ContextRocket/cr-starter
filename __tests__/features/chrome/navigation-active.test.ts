/**
 * CHROME-003 — current navigation follows route hierarchy.
 */
import { describe, expect, it } from "vitest";
import { isCurrentNavigationLink } from "@/lib/navigation";
import { scenario, thenStep } from "../../support/bdd";

scenario("CHROME-003 current navigation follows route hierarchy", () => {
  it("marks exact and nested local routes current", async () => {
    await thenStep("a section remains current on its article pages", () => {
      expect(isCurrentNavigationLink("/posts/", "/posts")).toBe(true);
      expect(isCurrentNavigationLink("/posts/my-article/", "/posts/")).toBe(true);
      expect(isCurrentNavigationLink("/podcasts", "/podcasts/")).toBe(true);
    });
  });

  it("does not confuse home, fragment, or external links", async () => {
    await thenStep("only route links matching the current route are current", () => {
      expect(isCurrentNavigationLink("/posts/", "/")).toBe(false);
      expect(isCurrentNavigationLink("/", "/#contact")).toBe(false);
      expect(isCurrentNavigationLink("/", "https://example.com")).toBe(false);
      expect(isCurrentNavigationLink("/", "mailto:hello@example.com")).toBe(false);
    });
  });
});
