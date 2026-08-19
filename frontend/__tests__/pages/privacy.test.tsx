/**
 * Tests for app/[locale]/privacy/page.tsx
 *
 * Covers:
 *   - Controller section renders entity + address from siteConfig.legal
 *   - Contact section renders privacyContact from siteConfig.legal
 *   - Analytics section is absent when no keys are set (default test env)
 *   - Generated-from-config notice is present
 *   - i18n keys resolve (headings and labels appear in the page)
 *
 * Per CR test doctrine: assert testids/behavior + that i18n resolves,
 * never assert literal translated copy values.
 */

import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom/vitest";

import PrivacyPage from "@/app/[locale]/privacy/page";
import { siteConfig } from "@/config/site.config";

// Ensure analytics env vars are absent for the default test suite.
// (Next.js test env does not set these; we delete them explicitly to be safe.)
beforeAll(() => {
  delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  delete process.env.NEXT_PUBLIC_POSTHOG_KEY;
});

/** Render the privacy page for a given URL locale (defaults to en). */
async function renderPrivacy(locale = "en") {
  const el = await PrivacyPage({ params: Promise.resolve({ locale }) });
  return render(el);
}

describe("Privacy Page", () => {
  it("renders the privacy policy title heading", async () => {
    await renderPrivacy();

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    // The heading text comes from the i18n PRIVACY_TITLE key -- assert it resolves.
    expect(heading.textContent).toBeTruthy();
  });

  it("renders the generated-from-config notice", async () => {
    await renderPrivacy();

    const notice = screen.getByTestId("privacy-generated-notice");
    expect(notice).toBeInTheDocument();
    expect(notice.textContent).toBeTruthy();
  });

  it("renders the data controller section", async () => {
    await renderPrivacy();

    const section = screen.getByTestId("privacy-controller-section");
    expect(section).toBeInTheDocument();
  });

  it("renders legal entity name from siteConfig.legal", async () => {
    await renderPrivacy();

    const address = screen.getByTestId("privacy-controller-address");
    expect(address).toHaveTextContent(siteConfig.legal.entity);
  });

  it("renders address from siteConfig.legal", async () => {
    await renderPrivacy();

    const address = screen.getByTestId("privacy-controller-address");
    // Address may include line breaks; check partial content.
    expect(address.textContent).toContain(siteConfig.legal.address);
  });

  it("renders privacy contact section", async () => {
    await renderPrivacy();

    const section = screen.getByTestId("privacy-contact-section");
    expect(section).toBeInTheDocument();
  });

  it("renders privacy contact email from siteConfig.legal", async () => {
    await renderPrivacy();

    const emailLink = screen.getByTestId("privacy-contact-email");
    expect(emailLink).toHaveAttribute(
      "href",
      `mailto:${siteConfig.legal.privacyContact}`,
    );
    expect(emailLink).toHaveTextContent(siteConfig.legal.privacyContact);
  });

  it("does not render the analytics section when no analytics keys are set", async () => {
    await renderPrivacy();

    // Analytics section must be absent when neither GA nor PostHog key is set.
    const analyticsSection = screen.queryByTestId("privacy-analytics-section");
    expect(analyticsSection).not.toBeInTheDocument();
  });

  it("renders the user rights section with at least three listed rights", async () => {
    await renderPrivacy();

    // Rights list items: access, rectification, erasure, portability, complaint.
    // Assert there are multiple list items (keys resolve to non-empty strings).
    const listItems = screen.getAllByRole("listitem");
    expect(listItems.length).toBeGreaterThanOrEqual(3);
  });

  it("renders a link back to the home page", async () => {
    await renderPrivacy();

    const backLink = screen.getByRole("link", { name: /back to home/i });
    // The navigation stub renders Link hrefs as given (locale-stripped).
    expect(backLink).toHaveAttribute("href", "/");
  });

  it("renders the consent key name in the consent/withdrawal section", async () => {
    await renderPrivacy();

    // The CONSENT_STORAGE_KEY constant must appear on the page so users know
    // which browser storage entry to clear to reset consent.
    const page = screen.getByRole("main");
    expect(page.textContent).toContain("cr_analytics_consent");
  });
});
