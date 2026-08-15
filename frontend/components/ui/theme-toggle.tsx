"use client";

/**
 * ThemeToggle — accessible light/dark/system cycle button.
 *
 * The visible counterpart to the ThemeProvider (components/ui/theme-provider.tsx):
 * a single icon button in the site chrome that cycles the active theme
 * light → dark → system → light. next-themes flips the `.dark` class on <html>
 * (attribute="class"), which drives the `.dark {}` token block in globals.css.
 *
 * Token-styled only (no hardcoded hex) so it inherits the fork's theme, and the
 * aria-label / title are i18n-resolved via t() — mirroring the LocaleSwitcher
 * primitive next to it in the header.
 *
 * SSR-MISMATCH GUARD: next-themes only knows the resolved theme AFTER mount
 * (the server can't read `localStorage` / the OS preference). Rendering the
 * theme-specific icon before mount would desync server vs. client markup, so we
 * render a neutral placeholder of the same size until `mounted` is true.
 */

import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { t } from "@/i18n/keys";

/** Ordered cycle: light → dark → system → light. */
const THEME_CYCLE = ["light", "dark", "system"] as const;
type ThemeName = (typeof THEME_CYCLE)[number];

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Same-size neutral placeholder before mount — prevents an SSR/client icon
  // mismatch and keeps the header from shifting when the real icon appears.
  if (!mounted) {
    return (
      <span
        aria-hidden="true"
        className={cn("inline-flex h-9 w-9 shrink-0", className)}
      />
    );
  }

  const current = (theme ?? "system") as ThemeName;
  const nextTheme =
    THEME_CYCLE[(THEME_CYCLE.indexOf(current) + 1) % THEME_CYCLE.length] ??
    "light";

  const Icon = current === "dark" ? Moon : current === "system" ? Monitor : Sun;
  const label = `${t("theme.toggle")}: ${t(`theme.${current}`)}`;

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      aria-label={label}
      title={label}
      data-testid="theme-toggle"
      data-theme-value={current}
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
    >
      <Icon aria-hidden="true" className="h-4 w-4" />
    </button>
  );
}
