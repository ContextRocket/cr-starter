/**
 * Tests for app/[locale]/attribution/page.tsx and the footer-link gate.
 *
 * Covers:
 *   - When features.attribution is ON, the page renders image + library
 *     credits (photographer -> author link, source link, library name/license).
 *   - When features.attribution is OFF, the page calls notFound() (no dead
 *     page).
 *   - The footer "Attribution" link is shown/hidden by the same flag via
 *     isChromeLinkVisible (no dead footer link when the surface is off).
 *
 * Per CR test doctrine: assert testids/behavior + that credit DATA and i18n
 * resolve, never assert literal translated chrome copy.
 *
 * The page is a Server Component that reads content/attributions.json via
 * loadAttributions(). We mock that loader to stay hermetic (no FS), and mock
 * siteConfig so we can toggle features.attribution per test.
 */

import { render } from "@testing-library/react";
import { screen, within } from "@testing-library/dom";
import "@testing-library/jest-dom/vitest";

import { notFound } from "next/navigation";
import { isChromeLinkVisible } from "@/lib/nav-visibility";
import type { NavLinkConfig } from "@/company.config";

// Mutable feature flags so each test can flip attribution on/off. Only
// siteConfig.features + siteConfig.siteUrl are read by the page under test.
const features = { attribution: true, blog: true };

vi.mock("@/site.config", () => ({
  siteConfig: {
    get features() {
      return features;
    },
    siteUrl: "https://example.com",
    defaultLocale: "en",
  },
}));

vi.mock("next/navigation", async () => ({
  ...(await vi.importActual("next/navigation")),
  notFound: vi.fn(),
}));

// Hermetic credit data — a single image + a single library credit.
vi.mock("../../lib/attributions", () => ({
  loadAttributions: () => ({
    images: [
      {
        filename: "ai-brain-future.jpg",
        thumbnail: "/images/blog/ai-brain-future.jpg",
        author: { name: "Growtika", url: "https://unsplash.com/@growtika" },
        source: {
          name: "Unsplash",
          url: "https://unsplash.com/photos/3wXVwtdaESA",
        },
        url: "https://unsplash.com/photos/3wXVwtdaESA",
      },
    ],
    libraries: [
      {
        name: "Next.js",
        url: "https://nextjs.org/",
        license: "MIT",
        note: "React framework for production.",
      },
    ],
  }),
}));

import AttributionPage from "@/app/[locale]/attribution/page";

async function renderAttribution(locale = "en") {
  const el = await AttributionPage({ params: Promise.resolve({ locale }) });
  return render(el);
}

describe("Attribution Page — flag ON (default)", () => {
  beforeEach(() => {
    features.attribution = true;
    vi.clearAllMocks();
  });

  it("renders the page shell with a single h1", async () => {
    await renderAttribution();
    expect(screen.getByTestId("attribution-page")).toBeInTheDocument();
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0].textContent?.trim()).not.toBe("");
  });

  it("renders an image credit with photographer and source links", async () => {
    await renderAttribution();
    const images = screen.getByTestId("attribution-images");
    expect(images).toHaveTextContent("ai-brain-future.jpg");

    // Scope link lookups to the images section: the page also renders a
    // general-note "Unsplash" link at the bottom, so a global query is ambiguous.
    const author = within(images).getByRole("link", { name: "Growtika" });
    expect(author).toHaveAttribute("href", "https://unsplash.com/@growtika");
    expect(author).toHaveAttribute("target", "_blank");
    expect(author).toHaveAttribute("rel", "noopener noreferrer");

    const source = within(images).getByRole("link", { name: "Unsplash" });
    expect(source).toHaveAttribute(
      "href",
      "https://unsplash.com/photos/3wXVwtdaESA",
    );
  });

  it("renders a library credit with name and license", async () => {
    await renderAttribution();
    const libs = screen.getByTestId("attribution-libraries");
    expect(libs).toHaveTextContent("Next.js");
    expect(libs).toHaveTextContent("MIT");

    const libLink = screen.getByRole("link", { name: "Next.js" });
    expect(libLink).toHaveAttribute("href", "https://nextjs.org/");
  });

  it("does not call notFound when the feature is enabled", async () => {
    await renderAttribution();
    expect(notFound).not.toHaveBeenCalled();
  });
});

describe("Attribution Page — flag OFF (opt-out)", () => {
  beforeEach(() => {
    features.attribution = false;
    vi.clearAllMocks();
  });

  it("calls notFound() so the route does not exist", async () => {
    // notFound is mocked (does not throw), so the render still returns; the
    // contract we assert is that the gate fired.
    await renderAttribution();
    expect(notFound).toHaveBeenCalled();
  });
});

describe("Footer Attribution link — gated by the same flag", () => {
  const ATTRIBUTION_LINK: NavLinkConfig = {
    labelKey: "footer.attribution",
    href: "/attribution",
    featureFlag: "attribution",
  };

  it("is shown when features.attribution is true", () => {
    features.attribution = true;
    expect(isChromeLinkVisible(ATTRIBUTION_LINK, /* isGuest */ true)).toBe(true);
  });

  it("is hidden when features.attribution is false (no dead footer link)", () => {
    features.attribution = false;
    expect(isChromeLinkVisible(ATTRIBUTION_LINK, /* isGuest */ true)).toBe(
      false,
    );
  });
});
