"use client";

/**
 * LocaleSwitcher -- Globe icon + locale code trigger with a language dropdown.
 *
 * Adopted from context-rocket/frontend/i18n/locale-switcher.tsx (the exact
 * URL-segment pattern the starter follows). The dropdown uses FIXED
 * positioning computed from the trigger's viewport rect and opens BELOW the
 * button, so it can never float out of view (the previous `absolute
 * bottom-full` version opened upward and escaped the top of the viewport).
 *
 * Menu order follows SUPPORTED_LOCALES in i18n/messages/index.ts (en, es,
 * de). Switching navigates to the same page under the new locale prefix via
 * the LocaleProvider (next-intl router).
 */

import { Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useLocale } from "./locale-provider";
import { t } from "./keys";
import { SUPPORTED_LOCALES, ACTIVE_LOCALES, type SupportedLocale } from "./messages";

/** Dot-path to the label string for each locale code. */
const LOCALE_LABEL_PATHS: Record<SupportedLocale, string> = {
  en: "locale.labelEnglish",
  es: "locale.labelSpanish",
  de: "locale.labelGerman",
};

interface LocaleSwitcherProps {
  className?: string;
  /** Called when the dropdown opens or closes (e.g. close mobile nav). */
  onDropdownToggle?: (isOpen: boolean) => void;
}

export function LocaleSwitcher({
  className,
  onDropdownToggle,
}: LocaleSwitcherProps) {
  const { locale, changeLocale } = useLocale();

  // No-op for single-language sites — render nothing.
  if (ACTIVE_LOCALES.length < 2) return null;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    right: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
        onDropdownToggle?.(false);
      }
    }

    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDropdownOpen(false);
        onDropdownToggle?.(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onDropdownToggle]);

  function setOpen(next: boolean) {
    setDropdownOpen(next);
    onDropdownToggle?.(next);
    if (buttonRef.current && next) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
  }

  function handleSelect(code: SupportedLocale) {
    setOpen(false);
    changeLocale(code);
  }

  return (
    <div ref={containerRef} className={cn("relative z-[70]", className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
        aria-haspopup="menu"
        aria-label={t("locale.changeLanguage")}
        title={t("locale.changeLanguage")}
        data-testid="locale-switcher"
        className="flex h-9 min-w-[3rem] items-center gap-1 rounded px-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <Globe aria-hidden="true" className="h-4 w-4 shrink-0" />
        <span className="text-xs font-medium uppercase">{locale}</span>
      </button>

      {dropdownOpen ? (
        <div
          role="menu"
          data-testid="locale-switcher-menu"
          className="fixed z-[9999] w-40 rounded border border-border bg-card py-1 shadow-lg"
          style={{
            top: dropdownPosition.top,
            right: dropdownPosition.right,
          }}
        >
          {SUPPORTED_LOCALES.map((code) => (
            <button
              key={code}
              type="button"
              role="menuitem"
              onClick={() => handleSelect(code)}
              data-testid={`locale-switcher-option-${code}`}
              className={cn(
                "block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-foreground/5",
                code === locale
                  ? "font-medium text-primary"
                  : "text-foreground",
              )}
            >
              {t(LOCALE_LABEL_PATHS[code])}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
