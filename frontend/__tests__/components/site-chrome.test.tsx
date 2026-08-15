import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom/vitest";

import { SiteChrome } from "@/components/sections/site-chrome";
import { isChromeLinkVisible } from "@/lib/nav-visibility";
import type { NavLinkConfig } from "@/company.config";
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
    // isChromeLinkVisible (used by the guest/auth nav-resolution tests below)
    // reads siteConfig.features for the featureFlag gate.
    features: { blog: true },
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

// End-to-end nav-resolution → render: the [locale] layout filters config links
// through isChromeLinkVisible(link, isGuest, showAppLinks) before handing them
// to SiteChrome. These tests reproduce that resolution for a guest vs an
// authenticated viewer and assert the rendered chrome, in BOTH header variants,
// so the Dashboard app link never leaks into the public/guest nav.
describe("SiteChrome — appOnly (Dashboard) auth-gating end-to-end", () => {
  const CONFIG_LINKS: NavLinkConfig[] = [
    { labelKey: "Blog", href: "/blog", featureFlag: "blog" },
    { labelKey: "Dashboard", href: "/dashboard", appOnly: true },
  ];

  function resolveNavLinks(isGuest: boolean, showAppLinks = true) {
    return CONFIG_LINKS.filter((l) =>
      isChromeLinkVisible(l, isGuest, showAppLinks),
    ).map((l) => ({ label: l.labelKey, href: `/en${l.href}` }));
  }

  beforeEach(() => {
    mockPathname.value = "/";
    mockChrome.header = "marketing";
    mockChrome.footer = "full";
  });

  it("guest sees NO Dashboard link in the marketing header", () => {
    renderChrome({ links: resolveNavLinks(/* isGuest */ true) });
    expect(screen.queryByRole("link", { name: "Dashboard" })).toBeNull();
    expect(screen.getByRole("link", { name: "Blog" })).toBeInTheDocument();
  });

  it("guest sees NO Dashboard link in the minimal header", () => {
    mockChrome.header = "minimal";
    renderChrome({ links: resolveNavLinks(/* isGuest */ true) });
    expect(screen.queryByRole("link", { name: "Dashboard" })).toBeNull();
    expect(screen.getByRole("link", { name: "Blog" })).toBeInTheDocument();
  });

  it("authenticated viewer sees the Dashboard link in the marketing header", () => {
    renderChrome({ links: resolveNavLinks(/* isGuest */ false) });
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/en/dashboard",
    );
  });

  it("authenticated viewer sees the Dashboard link in the minimal header", () => {
    mockChrome.header = "minimal";
    renderChrome({ links: resolveNavLinks(/* isGuest */ false) });
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/en/dashboard",
    );
  });
});
