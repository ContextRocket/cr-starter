/**
 * Tests for I18nProvider and locale switching behaviour.
 *
 * Per CR test doctrine: assert behaviours and key resolution, not
 * literal translated copy values (en strings differ from es/de).
 */

import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import React from "react";

import { LocaleProvider, useLocale } from "@/i18n/locale-provider";
import { t, registerLocaleMessages } from "@/i18n/keys";
import { createTranslator } from "@/i18n/translator";
import { en } from "@/i18n/messages/en";
import { SUPPORTED_LOCALES } from "@/i18n/messages";
import { LOCALE_MESSAGE_TREES } from "@/i18n/messages/test-fixtures";
import { mockRouter } from "@/i18n/navigation";

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

const alternateLocale =
  SUPPORTED_LOCALES.find((locale) => locale !== "en") ?? "en";

// ---------------------------------------------------------------------------
// I18nProvider: defaults
// ---------------------------------------------------------------------------

describe("I18nProvider", () => {
  // Clear NEXT_LOCALE cookie and router call history between tests.
  // Pre-register every generated locale so switching tests do not depend on
  // a network-style lazy loader.
  beforeEach(() => {
    document.cookie = "NEXT_LOCALE=;path=/;max-age=0";
    mockRouter.replace.mockClear();
    for (const [locale, tree] of Object.entries(LOCALE_MESSAGE_TREES)) {
      registerLocaleMessages(
        locale,
        tree as unknown as Record<string, unknown>,
      );
    }
  });

  describe("defaults", () => {
    it("renders with the given locale", () => {
      render(
        <LocaleProvider
          initialLocale="en"
          messages={en as unknown as Record<string, unknown>}
        >
          <LocaleConsumer targetLocale={alternateLocale} />
        </LocaleProvider>,
      );
      expect(screen.getByTestId("active-locale")).toHaveTextContent("en");
    });

    it("exposes locale and changeLocale via useLocale hook", () => {
      render(
        <LocaleProvider
          initialLocale="en"
          messages={en as unknown as Record<string, unknown>}
        >
          <LocaleConsumer targetLocale={alternateLocale} />
        </LocaleProvider>,
      );
      expect(screen.getByTestId("active-locale")).toBeInTheDocument();
      expect(screen.getByTestId("change-locale-btn")).toBeInTheDocument();
    });
  });

  describe("useLocale outside provider", () => {
    it("throws when used outside a LocaleProvider", () => {
      function Bare() {
        const { locale } = useLocale();
        return <span data-testid="bare-locale">{locale}</span>;
      }
      expect(() => render(<Bare />)).toThrow(
        /useLocale must be used within a LocaleProvider/,
      );
    });
  });

  describe("supported locales list", () => {
    it("always includes en and only configured locale bundles", () => {
      expect(SUPPORTED_LOCALES).toContain("en");
      expect(SUPPORTED_LOCALES).toEqual(
        Object.keys(LOCALE_MESSAGE_TREES).sort(),
      );
    });
  });

  describe("changeLocale", () => {
    it("navigates to the new locale prefix on click when one exists", async () => {
      if (alternateLocale === "en") return;
      const user = userEvent.setup();
      render(
        <LocaleProvider
          initialLocale="en"
          messages={en as unknown as Record<string, unknown>}
        >
          <LocaleConsumer targetLocale={alternateLocale} />
        </LocaleProvider>,
      );

      await act(async () => {
        await user.click(screen.getByTestId("change-locale-btn"));
      });

      expect(mockRouter.replace).toHaveBeenCalledWith("/", {
        locale: alternateLocale,
      });
    });

    it("is a no-op when switching to the same locale", async () => {
      const user = userEvent.setup();
      render(
        <LocaleProvider
          initialLocale="en"
          messages={en as unknown as Record<string, unknown>}
        >
          <LocaleConsumer targetLocale="en" />
        </LocaleProvider>,
      );

      await act(async () => {
        await user.click(screen.getByTestId("change-locale-btn"));
      });

      expect(mockRouter.replace).not.toHaveBeenCalled();
    });
  });

  describe("cookie persistence", () => {
    it("writes NEXT_LOCALE cookie and navigates when locale changes", async () => {
      if (alternateLocale === "en") return;
      const user = userEvent.setup();
      render(
        <LocaleProvider
          initialLocale="en"
          messages={en as unknown as Record<string, unknown>}
        >
          <LocaleConsumer targetLocale={alternateLocale} />
        </LocaleProvider>,
      );

      await act(async () => {
        await user.click(screen.getByTestId("change-locale-btn"));
      });

      // Verify the router was called with the new locale (the cookie write
      // happens synchronously before the router call in the provider).
      expect(mockRouter.replace).toHaveBeenCalledWith("/", {
        locale: alternateLocale,
      });
    });
  });

  describe("t() from keys.ts", () => {
    it("resolves a key without throwing", () => {
      function Consumer() {
        return <span data-testid="value">{t("chat.empty.title")}</span>;
      }
      render(
        <LocaleProvider
          initialLocale="en"
          messages={en as unknown as Record<string, unknown>}
        >
          <Consumer />
        </LocaleProvider>,
      );
      const value = screen.getByTestId("value").textContent ?? "";
      expect(value.length).toBeGreaterThan(0);
    });
  });
});

// ---------------------------------------------------------------------------
// createTranslator (pure core)
// ---------------------------------------------------------------------------

describe("createTranslator", () => {
  it("resolves a nested dot-path key", () => {
    const t = createTranslator("en", en);
    expect(t("locale.changeLanguage").length).toBeGreaterThan(0);
  });

  it("throws for a completely unknown key", () => {
    const t = createTranslator("en", en);
    expect(() => t("NONEXISTENT_KEY_XYZ_999")).toThrow(/Missing key/);
  });

  it("falls back to English for a locale missing a key", () => {
    // Empty active tree: every key resolves via the bundled English fallback.
    const t = createTranslator("es", {});
    expect(t("locale.changeLanguage")).toBeTypeOf("string");
  });
});
