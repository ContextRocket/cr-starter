import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * E2E: Accessibility (axe-core).
 *
 * Runs axe against a representative set of public pages and fails on any
 * `serious` / `critical` WCAG 2 A/AA violation. `minor` / `moderate` findings
 * are logged (not failed) to avoid flaky noise from third-party chrome while
 * still surfacing them to operators.
 *
 * Deterministic + cross-OS: no screenshots, no DB. Runs against the served
 * build via Playwright's webServer.
 */

const PAGES = [
  { name: "home", path: "/en" },
  { name: "faq", path: "/en/faq" },
  { name: "blog", path: "/en/blog" },
  { name: "privacy", path: "/en/privacy" },
];

const BLOCKING_IMPACTS = new Set(["serious", "critical"]);

for (const { name, path } of PAGES) {
  test(`a11y: ${name} has no serious/critical WCAG 2 A/AA violations`, async ({
    page,
  }) => {
    await page.goto(path, { waitUntil: "networkidle" });

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const blocking = results.violations.filter(
      (v) => v.impact && BLOCKING_IMPACTS.has(v.impact),
    );
    const nonBlocking = results.violations.filter(
      (v) => !v.impact || !BLOCKING_IMPACTS.has(v.impact),
    );

    if (nonBlocking.length > 0) {
      // Log minor/moderate findings for operator visibility without failing.
      console.log(
        `[a11y:${name}] ${nonBlocking.length} minor/moderate finding(s):`,
        nonBlocking.map((v) => `${v.id} (${v.impact ?? "unknown"})`).join(", "),
      );
    }

    expect(
      blocking,
      blocking
        .map((v) => `${v.id} [${v.impact}]: ${v.help} (${v.nodes.length} node(s))`)
        .join("\n"),
    ).toEqual([]);
  });
}
