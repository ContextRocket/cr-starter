import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom/vitest";

// The home page renders <MarketingSections /> (from company.config), a blog
// teaser (only when posts exist), and a newsletter CTA. Mock the blog adapter
// to an empty list so the test is hermetic and the FeaturedArticles teaser is
// deterministically absent -- keeping the single-h1 assertion clean.
//
// NOTE: vi.mock is hoisted; use the relative path from this test file. The page
// imports via @/lib/blog which Vitest resolves to the same module.
vi.mock("../../lib/blog", () => ({
  fileBlogAdapter: {
    list: () => [],
    get: () => null,
  },
  FileBlogAdapter: vi.fn(),
  parseBlogPost: vi.fn(),
}));

import Home from "@/app/[locale]/page";
import { company } from "@/company.config";

/** Render the home page for a given URL locale (defaults to en). */
async function renderHome(locale = "en") {
  return Home({ params: Promise.resolve({ locale }) });
}

describe("Home Page", () => {
  it("renders a single h1 from the company hero headline", async () => {
    render(await renderHome());

    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(company.hero!.headline);
  });

  it("renders the hero subhead", async () => {
    render(await renderHome());

    // The hero subhead comes from company.config, not the old minimal home.
    expect(screen.getByText(company.hero!.subhead!)).toBeInTheDocument();
  });

  it("renders the newsletter subscribe form", async () => {
    render(await renderHome());

    // The subscribe CTA lives on the home page (formKey="subscribe"); its email
    // input is the deterministic anchor.
    const email = screen
      .getAllByRole("textbox")
      .find((el) => el.getAttribute("type") === "email");
    expect(email).toBeInTheDocument();
  });

  it("renders JSON-LD script tags for Organization and WebSite", async () => {
    const { container } = render(await renderHome());

    const scripts = container.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    expect(scripts.length).toBeGreaterThanOrEqual(2);

    const contents = Array.from(scripts).map((s) => s.innerHTML);
    const types = contents.map((c) => {
      const parsed = JSON.parse(c.replaceAll("\\u003c", "<")) as {
        "@type"?: string;
      };
      return parsed["@type"];
    });

    expect(types).toContain("Organization");
    expect(types).toContain("WebSite");
  });
});
