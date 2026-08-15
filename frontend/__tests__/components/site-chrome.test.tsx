import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom/vitest";

import { SiteChrome } from "@/components/sections/site-chrome";
import { mockPathname } from "../__mocks__/navigation";

// SiteChrome reads siteConfig.chrome directly to pick the header/footer variant.
// Mock the config with a MUTABLE chrome holder so a single test file can drive
// both the default (marketing) and the configured (minimal) variant. Only the
// fields SiteChrome touches are stubbed.
const { mockChrome } = vi.hoisted(() => ({
  mockChrome: { header: "marketing", footer: "full" } as {
    header: "marketing" | "minimal";
    footer: "full" | "minimal";
  },
}));
vi.mock("@/site.config", () => ({
  siteConfig: {
    get chrome() {
      return mockChrome;
    },
  },
}));

const LOGO = { src: "/icon-192.png", alt: "Acme", width: 120, height: 24 };

function renderChrome(
  props: Partial<React.ComponentProps<typeof SiteChrome>> = {},
) {
  return render(
    <SiteChrome
      links={[{ label: "Blog", href: "/en/blog" }]}
      logo={LOGO}
      footerLinks={[{ label: "Privacy", href: "/en/privacy" }]}
      companyName="Acme"
      navLabel="Primary"
      {...props}
    >
      <main>page content</main>
    </SiteChrome>,
  );
}

describe("SiteChrome", () => {
  beforeEach(() => {
    mockPathname.value = "/";
    mockChrome.header = "marketing";
    mockChrome.footer = "full";
  });

  it("renders the marketing header (full Navbar) by default", () => {
    renderChrome();
    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(nav).toBeInTheDocument();
    // The marketing Navbar exposes a mobile hamburger toggle; the minimal
    // header does not — this distinguishes the two variants.
    expect(screen.getByRole("button")).toBeInTheDocument();
    // Nav links come from config (passed in), not hardcoded.
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute(
      "href",
      "/en/blog",
    );
    expect(screen.getByText("page content")).toBeInTheDocument();
  });

  it("renders the minimal header when configured, with links from config", () => {
    mockChrome.header = "minimal";
    renderChrome();
    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(nav).toBeInTheDocument();
    // Minimal header has NO mobile hamburger button (marketing-only affordance).
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    // Link set is exactly what config supplied — nothing hardcoded.
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute(
      "href",
      "/en/blog",
    );
  });

  it("shows NO Dashboard/app link in the minimal case when config omits it", () => {
    mockChrome.header = "minimal";
    renderChrome({ links: [{ label: "About", href: "/en/about" }] });
    expect(screen.queryByRole("link", { name: "Dashboard" })).toBeNull();
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
  });

  it("renders an empty minimal header when config supplies no links", () => {
    mockChrome.header = "minimal";
    renderChrome({ links: [], footerLinks: [] });
    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(nav).toBeInTheDocument();
    // Only the brand link (home) is present; no nav or footer links.
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "/");
  });

  it("renders the minimal footer variant when configured", () => {
    mockChrome.footer = "minimal";
    renderChrome();
    // Footer link still comes from config.
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute(
      "href",
      "/en/privacy",
    );
    expect(
      screen.getByText(new RegExp(`${new Date().getFullYear()} Acme`)),
    ).toBeInTheDocument();
  });

  it("renders nothing but children on a chrome-exempt (dashboard) path", () => {
    mockPathname.value = "/dashboard";
    renderChrome();
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
    expect(screen.getByText("page content")).toBeInTheDocument();
  });
});
