"use client";

/**
 * LocaleSwitcher -- Globe icon + locale code trigger with a language dropdown.
 *
 * Adapted from context-rocket/frontend/i18n/locale-switcher.tsx.
 * Simplified for the starter: no portal/fixed positioning, inline dropdown.
 *
 * Mount this in app/layout.tsx (or the footer / header) to surface locale
 * switching to users. The active locale is persisted via cookie by LocaleProvider.
 */

import { Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useLocale } from "./locale-provider";
import { t } from "./keys";
import { SUPPORTED_LOCALES, type SupportedLocale } from "./messages";

/** Dot-path to the label string for each locale code. */
const LOCALE_LABEL_PATHS: Record<SupportedLocale, string> = {
  en: "locale.labelEnglish",
  es: "locale.labelSpanish",
  de: "locale.labelGerman",
};

interface LocaleSwitcherProps {
  className?: string;
}

export function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const { locale, changeLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape.
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t("locale.changeLanguage")}
        title={t("locale.changeLanguage")}
        data-testid="locale-switcher"
        className="flex h-9 min-w-[3rem] items-center gap-1 rounded px-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <Globe aria-hidden="true" className="h-4 w-4 shrink-0" />
        <span className="text-xs font-medium uppercase">{locale}</span>
      </button>

      {open && (
        <div
          role="menu"
          data-testid="locale-switcher-menu"
          className="absolute bottom-full mb-1 right-0 z-50 w-36 rounded border border-border bg-card py-1 shadow-lg"
        >
          {SUPPORTED_LOCALES.map((code) => (
            <button
              key={code}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                changeLocale(code);
              }}
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
      )}
    </div>
  );
}
