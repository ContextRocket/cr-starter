/**
 * theme-toggle.test.tsx -- light/dark primitive behavior.
 *
 * Covers the two halves of the theme primitive:
 *   1. ThemeToggle renders an accessible button (i18n aria-label) and, wrapped
 *      in the real ThemeProvider, actually flips the `.dark` class on <html>
 *      when clicked (light → dark) -- the class next-themes drives via
 *      attribute="class", matching the `.dark {}` token block in globals.css.
 *   2. ThemeProvider mounts its children (the wrapper the [locale] layout uses).
 *
 * These render against the REAL next-themes provider, so a broken
 * attribute/class wiring would fail here rather than pass a stub.
 */

import { render } from "@testing-library/react";
import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";

import { ThemeToggle } from "@/components/shared/ui/theme-toggle";
import { ThemeProvider } from "@/components/shared/ui/theme-provider";
import { createNoFlashScript } from "@/components/shared/ui/theme-init-script";

// next-themes reads matchMedia to resolve the "system" preference; jsdom lacks
// it. Provide a stub that reports "light" so system resolves deterministically.
beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
});

beforeEach(() => {
  // Reset the html class + persisted choice between tests.
  document.documentElement.className = "";
  localStorage.clear();
});

function renderToggle() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  );
}

describe("ThemeToggle", () => {
  it("renders an accessible toggle button with the i18n aria-label", async () => {
    renderToggle();
    // Mounted-guard: the real button appears after the effect runs.
    const button = await screen.findByTestId("theme-toggle");
    expect(button).toBeInTheDocument();
    // aria-label is i18n-resolved ("Toggle theme: <mode>") -- no hardcoded copy.
    expect(button.getAttribute("aria-label")).toContain("Toggle theme");
  });

  it("flips light → dark in ONE click (binary toggle)", async () => {
    const user = userEvent.setup();
    renderToggle();
    const button = await screen.findByTestId("theme-toggle");

    // matchMedia stub reports light → resolvedTheme starts "light".
    await waitFor(() =>
      expect(button.getAttribute("data-theme-value")).toBe("light"),
    );

    // A single click flips to dark and lands the `.dark` class on <html>.
    await user.click(button);
    await waitFor(() =>
      expect(document.documentElement.classList.contains("dark")).toBe(true),
    );
    expect(button.getAttribute("data-theme-value")).toBe("dark");
  });

  it("flips dark → light in ONE click and never enters a system state", async () => {
    const user = userEvent.setup();
    renderToggle();
    const button = await screen.findByTestId("theme-toggle");

    // Click once to reach dark.
    await waitFor(() =>
      expect(button.getAttribute("data-theme-value")).toBe("light"),
    );
    await user.click(button);
    await waitFor(() =>
      expect(document.documentElement.classList.contains("dark")).toBe(true),
    );

    // A single click flips straight back to light -- no intermediate "system".
    await user.click(button);
    await waitFor(() =>
      expect(document.documentElement.classList.contains("dark")).toBe(false),
    );
    expect(button.getAttribute("data-theme-value")).toBe("light");
    // The toggle only ever exposes the two concrete states.
    expect(["light", "dark"]).toContain(
      button.getAttribute("data-theme-value"),
    );
  });
});

describe("ThemeProvider", () => {
  it("renders its children", () => {
    render(
      <ThemeProvider>
        <span data-testid="child">content</span>
      </ThemeProvider>,
    );
    expect(screen.getByTestId("child")).toHaveTextContent("content");
  });

  it("respects a configured dark first-visit theme", async () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <ThemeToggle />
      </ThemeProvider>,
    );
    const button = await screen.findByTestId("theme-toggle");

    await waitFor(() =>
      expect(button.getAttribute("data-theme-value")).toBe("dark"),
    );
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("generates a no-flash script for the configured first-visit theme", () => {
    expect(createNoFlashScript("dark")).toContain('if(!t){t="dark"}');
    expect(createNoFlashScript("system")).toContain("prefers-color-scheme");
  });
});
