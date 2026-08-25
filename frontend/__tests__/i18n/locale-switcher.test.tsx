/**
 * LocaleSwitcher render contract: the trigger is always visible in
 * multi-language mode, and renders nothing in single-language mode.
 * Structural assertions only - never literal copy.
 */
import { fireEvent, render, screen } from "@testing-library/react";

import { LocaleSwitcher } from "@/i18n/locale-switcher";
import { LocaleProvider } from "@/i18n/locale-provider";
import { en } from "@/i18n/messages/en";
import { ACTIVE_LOCALES, SUPPORTED_LOCALES } from "@/i18n/messages";

function withLocale(ui: React.ReactElement) {
  return (
    <LocaleProvider
      initialLocale="en"
      messages={en as unknown as Record<string, unknown>}
    >
      {ui}
    </LocaleProvider>
  );
}

describe("LocaleSwitcher", () => {
  if (ACTIVE_LOCALES.length < 2) {
    it("renders nothing for a single-language site", () => {
      render(withLocale(<LocaleSwitcher />));
      expect(screen.queryByTestId("locale-switcher")).not.toBeInTheDocument();
    });
  } else {
    it("renders the trigger with a change-language label", () => {
      render(withLocale(<LocaleSwitcher />));

      const trigger = screen.getByTestId("locale-switcher");
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute(
        "aria-label",
        expect.stringMatching(/.+/),
      );
    });

    it("opens a menu listing every supported locale", () => {
      render(withLocale(<LocaleSwitcher />));

      fireEvent.click(screen.getByTestId("locale-switcher"));

      const menu = screen.getByTestId("locale-switcher-menu");
      expect(menu).toBeInTheDocument();
      for (const code of SUPPORTED_LOCALES) {
        expect(
          screen.getByTestId(`locale-switcher-option-${code}`),
        ).toBeInTheDocument();
      }
    });

    it("marks the active locale as selected", () => {
      render(withLocale(<LocaleSwitcher />));

      fireEvent.click(screen.getByTestId("locale-switcher"));

      expect(screen.getByTestId("locale-switcher-option-en")).toHaveClass(
        "font-medium",
      );
    });

    it("closes the menu when a locale option is chosen", () => {
      render(withLocale(<LocaleSwitcher />));

      fireEvent.click(screen.getByTestId("locale-switcher"));
      fireEvent.click(screen.getByTestId("locale-switcher-option-es"));

      expect(
        screen.queryByTestId("locale-switcher-menu"),
      ).not.toBeInTheDocument();
    });
  }
});
