/**
 * theme-toggle.test.tsx — light/dark primitive behavior.
 *
 * Covers the two halves of the theme primitive:
 *   1. ThemeToggle renders an accessible button (i18n aria-label) and, wrapped
 *      in the real ThemeProvider, actually flips the `.dark` class on <html>
 *      when clicked (light → dark) — the class next-themes drives via
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

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ThemeProvider } from "@/components/ui/theme-provider";

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
    // aria-label is i18n-resolved ("Toggle theme: <mode>") — no hardcoded copy.
    expect(button.getAttribute("aria-label")).toContain("Toggle theme");
  });

  it("flips the .dark class on <html> when cycling to dark", async () => {
    const user = userEvent.setup();
    renderToggle();
    const button = await screen.findByTestId("theme-toggle");

    // Force a known starting point: click until the current value is "light".
    await waitFor(() =>
      expect(button.getAttribute("data-theme-value")).toBeTruthy(),
    );

    // Cycle is light → dark → system. Click until dark is active and assert the
    // class landed on <html>.
    for (let i = 0; i < 3; i++) {
      if (button.getAttribute("data-theme-value") === "dark") break;
      await user.click(button);
      await waitFor(() =>
        expect(button.getAttribute("data-theme-value")).toBeTruthy(),
      );
    }

    await waitFor(() =>
      expect(document.documentElement.classList.contains("dark")).toBe(true),
    );
  });

  it("removes the .dark class when cycling back to light", async () => {
    const user = userEvent.setup();
    renderToggle();
    const button = await screen.findByTestId("theme-toggle");

    // Reach dark first.
    for (let i = 0; i < 3; i++) {
      if (button.getAttribute("data-theme-value") === "dark") break;
      await user.click(button);
    }
    await waitFor(() =>
      expect(document.documentElement.classList.contains("dark")).toBe(true),
    );

    // Then cycle around back to light (dark → system → light).
    for (let i = 0; i < 3; i++) {
      if (button.getAttribute("data-theme-value") === "light") break;
      await user.click(button);
    }
    await waitFor(() =>
      expect(document.documentElement.classList.contains("dark")).toBe(false),
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
});
