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
  // showThemeToggle is false here so these variant-selection tests stay focused
  // on the header/footer STYLE (the hamburger affordance distinguishes the two
  // headers). The theme toggle itself is covered in theme-toggle.test.tsx.
  mockChrome: {
    header: "marketing",
    footer: "full",
    showThemeToggle: false,
  } as {
    header: "marketing" | "minimal";
    footer: "full" | "minimal";
    showThemeToggle: boolean;
  },
}));
vi.mock("@/site.config", () => ({
  siteConfig: {
    get chrome() {
      return mockChrome;
    },
    // isChromeLinkVisible (used by the guest/auth nav-resolution tests below)
    features: { blog: true, languageSelector: false },
  },
}));

// Mock LocaleSwitcher because it requires LocaleProvider context
vi.mock("@/i18n/locale-switcher", () => ({
  LocaleSwitcher: () => <div data-testid="locale-switcher-mock" />,
}));

const LOGO = {
  src: "/icon-192.png",
  alt: "Acme",
  variant: "icon" as const,
  width: 120,
  height: 24,
};

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
    mockChrome.footer = "minimal";
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

  it("marketing header falls back to the brand NAME when no logo is supplied", () => {
    // A fork with chrome.showBrandLogo === false hands SiteChrome no logo; the
    // marketing Navbar then renders the brand NAME (companyName) as a wordmark.
    renderChrome({ logo: undefined });
    const brandLink = screen.getByRole("link", { name: "Acme" });
    expect(brandLink).toHaveAttribute("href", "/");
    // Only the footer powered-by images should be rendered
    const images = screen.queryAllByRole("img");
    expect(images.every(img => img.getAttribute("alt") === "ContextRocket")).toBe(true);
  });

  it("minimal header shows the brand NAME when showBrandLogo is false (no logo)", () => {
    mockChrome.header = "minimal";
    renderChrome({ logo: undefined });
    const brandLink = screen.getByRole("link", { name: "Acme" });
    expect(brandLink).toHaveAttribute("href", "/");
    // Only the footer powered-by images should be rendered
    const images = screen.queryAllByRole("img");
    expect(images.every(img => img.getAttribute("alt") === "ContextRocket")).toBe(true);
  });

  it("renders the brand NAME beside the icon logo in the marketing header", () => {
    // logoVariant "icon" carries no wordmark, so the header pairs the icon
    // glyph with the companyName as a text mark: `[icon]  Acme`. The brand link
    // is still accessible by the name, and the icon IMAGE is still present.
    renderChrome();
    const brandLink = screen.getByRole("link", { name: /Acme/ });
    expect(brandLink).toHaveAttribute("href", "/");
    // Both the icon image AND the visible name text render.
    expect(screen.getAllByRole("img", { name: "Acme" }).length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByText("Acme").length).toBeGreaterThan(0);
  });

  it("renders the brand NAME beside the icon logo in the minimal header", () => {
    mockChrome.header = "minimal";
    renderChrome();
    const brandLink = screen.getByRole("link", { name: /Acme/ });
    expect(brandLink).toHaveAttribute("href", "/");
    expect(screen.getAllByRole("img", { name: "Acme" }).length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByText("Acme").length).toBeGreaterThan(0);
  });

  it("does NOT render a separate name label for the wordmark logo variant", () => {
    // The wordmark image already contains the name, so no extra text mark is
    // rendered beside it — only the (name-alt'd) image.
    renderChrome({
      logo: {
        src: "/wordmark.svg",
        alt: "Acme",
        variant: "wordmark" as const,
        width: 178,
        height: 24,
      },
    });
    const brandLink = screen.getByRole("link", { name: "Acme" });
    expect(brandLink).toHaveAttribute("href", "/");
    // The name is only present as the image alt, not as a separate text node.
    expect(screen.queryByText("Acme")).toBeNull();
    expect(screen.getAllByRole("img", { name: "Acme" }).length).toBeGreaterThan(
      0,
    );
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
