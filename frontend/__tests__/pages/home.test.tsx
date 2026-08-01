import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom";

import Home from "@/app/page";
import { siteConfig } from "@/site.config";

describe("Home Page", () => {
  it("renders a single h1 from site.config tagline", () => {
    render(<Home />);

    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(siteConfig.tagline);
  });

  it("renders a link to the dashboard", () => {
    render(<Home />);

    const dashboardLink = screen.getByRole("link", {
      name: /go to dashboard/i,
    });
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute("href", "/dashboard");
  });

  it("renders the description text from i18n keys", () => {
    render(<Home />);

    // The phrase appears in the tagline (h1) and in the subtitle paragraph.
    const matches = screen.getAllByText(/Build products on ContextRocket/i);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("renders footer links to impressum and privacy", () => {
    render(<Home />);

    const impressumLink = screen.getByRole("link", { name: /impressum/i });
    expect(impressumLink).toHaveAttribute("href", "/impressum");

    const privacyLink = screen.getByRole("link", { name: /privacy/i });
    expect(privacyLink).toHaveAttribute("href", "/privacy");
  });

  it("renders JSON-LD script tags for Organization and WebSite", () => {
    const { container } = render(<Home />);

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
