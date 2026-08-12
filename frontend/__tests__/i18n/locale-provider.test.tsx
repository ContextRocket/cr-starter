/**
 * Tests for LocaleProvider and locale switching behaviour.
 *
 * Per CR test doctrine: assert behaviours and key resolution, not
 * literal translated copy values (en strings differ from es/de).
 */

import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import React from "react";

import { LocaleProvider, useLocale } from "@/i18n/locale-provider";
import { getCurrentLocale, t, setLocale } from "@/i18n/keys";
import { SUPPORTED_LOCALES } from "@/i18n/messages";
import type { MockInstance } from "vitest";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Minimal consumer that shows the active locale and a button to switch it. */
function LocaleConsumer({
  targetLocale,
}: {
  targetLocale: (typeof SUPPORTED_LOCALES)[number];
}) {
  const { locale, changeLocale } = useLocale();
  return (
    <div>
      <span data-testid="active-locale">{locale}</span>
      <button
        type="button"
        onClick={() => changeLocale(targetLocale)}
        data-testid="change-locale-btn"
      >
        Switch to {targetLocale}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LocaleProvider: defaults
// ---------------------------------------------------------------------------

describe("LocaleProvider", () => {
  // Clear NEXT_LOCALE cookie between tests to avoid cross-test pollution.
  beforeEach(() => {
    document.cookie = "NEXT_LOCALE=;path=/;max-age=0";
  });

  // Reset locale module state to "en" after each test so shared module
  // variable (_clientLocale) does not leak into co-located test workers
  // that assert English copy values.
  afterEach(() => {
    setLocale("en");
  });

  describe("defaults", () => {
    it("renders with the given initialLocale", () => {
      render(
        <LocaleProvider initialLocale="en">
          <LocaleConsumer targetLocale="es" />
        </LocaleProvider>,
      );
      expect(screen.getByTestId("active-locale")).toHaveTextContent("en");
    });

    it("exposes locale and changeLocale via useLocale hook", () => {
      render(
        <LocaleProvider initialLocale="en">
          <LocaleConsumer targetLocale="de" />
        </LocaleProvider>,
      );
      expect(screen.getByTestId("active-locale")).toBeInTheDocument();
      expect(screen.getByTestId("change-locale-btn")).toBeInTheDocument();
    });
  });

  describe("useLocale outside provider", () => {
    // Suppress the expected error output in this test.
    let consoleError: MockInstance;
    beforeEach(() => {
      consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    });
    afterEach(() => {
      consoleError.mockRestore();
    });

    it("throws when used outside LocaleProvider", () => {
      function Bare() {
        useLocale();
        return null;
      }
      expect(() => render(<Bare />)).toThrow(
        "useLocale must be used within a LocaleProvider",
      );
    });
  });

  describe("supported locales list", () => {
    it("includes en, es, de", () => {
      expect(SUPPORTED_LOCALES).toContain("en");
      expect(SUPPORTED_LOCALES).toContain("es");
      expect(SUPPORTED_LOCALES).toContain("de");
    });
  });

  describe("changeLocale", () => {
    it("updates the active locale on click", async () => {
      const user = userEvent.setup();
      render(
        <LocaleProvider initialLocale="en">
          <LocaleConsumer targetLocale="de" />
        </LocaleProvider>,
      );

      expect(screen.getByTestId("active-locale")).toHaveTextContent("en");

      await act(async () => {
        await user.click(screen.getByTestId("change-locale-btn"));
      });

      // After switching to "de" the state updates.
      // Note: loading the de module is async (dynamic import); under Vitest it
      // resolves outside the click's act() window, so wait for the state
      // change without asserting copy.
      await waitFor(() => {
        expect(screen.getByTestId("active-locale")).toHaveTextContent("de");
      });
    });

    it("is a no-op when switching to the same locale", async () => {
      const user = userEvent.setup();
      render(
        <LocaleProvider initialLocale="en">
          <LocaleConsumer targetLocale="en" />
        </LocaleProvider>,
      );

      await act(async () => {
        await user.click(screen.getByTestId("change-locale-btn"));
      });

      // Should still be "en" -- no re-render triggered.
      expect(screen.getByTestId("active-locale")).toHaveTextContent("en");
    });
  });

  describe("cookie persistence", () => {
    it("writes NEXT_LOCALE cookie when locale changes", async () => {
      const user = userEvent.setup();
      render(
        <LocaleProvider initialLocale="en">
          <LocaleConsumer targetLocale="es" />
        </LocaleProvider>,
      );

      await act(async () => {
        await user.click(screen.getByTestId("change-locale-btn"));
      });

      // Cookie should contain the new locale (async module load: waitFor).
      await waitFor(() => {
        expect(document.cookie).toContain("NEXT_LOCALE=es");
      });
    });
  });

  describe("getCurrentLocale", () => {
    it("returns the initialLocale immediately after render", () => {
      render(
        <LocaleProvider initialLocale="en">
          <div />
        </LocaleProvider>,
      );
      // After render, setLocale("en") has been called synchronously.
      expect(getCurrentLocale()).toBe("en");
    });
  });

  describe("t() with active locale", () => {
    it("resolves AUTH_LOGIN_TITLE key without throwing", () => {
      render(
        <LocaleProvider initialLocale="en">
          <div />
        </LocaleProvider>,
      );
      expect(() => t("auth.login.title")).not.toThrow();
      const value = t("auth.login.title");
      expect(typeof value).toBe("string");
      expect(value.length).toBeGreaterThan(0);
    });

    it("resolves locale.changeLanguage dot-path without throwing", () => {
      render(
        <LocaleProvider initialLocale="en">
          <div />
        </LocaleProvider>,
      );
      expect(() => t("locale.changeLanguage")).not.toThrow();
      const value = t("locale.changeLanguage");
      expect(value.length).toBeGreaterThan(0);
    });

    it("throws for a completely unknown key", () => {
      render(
        <LocaleProvider initialLocale="en">
          <div />
        </LocaleProvider>,
      );
      expect(() => t("NONEXISTENT_KEY_XYZ_999" as never)).toThrow(
        /Missing key/,
      );
    });
  });
});
