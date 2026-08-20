"use client";

/**
 * ThemeToggle -- accessible two-state light ↔ dark toggle button.
 *
 * The visible counterpart to the ThemeProvider (components/ui/theme-provider.tsx):
 * a single icon button in the site chrome that flips between light and dark.
 * One click flips: Sun shows in light mode (click → dark), Moon shows in dark
 * mode (click → light). next-themes flips the `.dark` class on <html>
 * (attribute="class"), which drives the `.dark {}` token block in globals.css.
 *
 * The ThemeProvider keeps `enableSystem` so a FIRST visit follows the OS
 * preference; this toggle then resolves that to a concrete light/dark choice --
 * there is no explicit "system" state exposed to the user (no Monitor icon).
 *
 * Token-styled only (no hardcoded hex) so it inherits the fork's theme, and the
 * aria-label / title are i18n-resolved via t() -- mirroring the LocaleSwitcher
 * primitive next to it in the header.
 *
 * SSR-MISMATCH GUARD: next-themes only knows the resolved theme AFTER mount
 * (the server can't read `localStorage` / the OS preference). Rendering the
 * theme-specific icon before mount would desync server vs. client markup, so we
 * render a neutral placeholder of the same size until `mounted` is true.
 */

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/i18n/locale-provider";


interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const t = useTranslations();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Same-size neutral placeholder before mount -- prevents an SSR/client icon
  // mismatch and keeps the header from shifting when the real icon appears.
  if (!mounted) {
    return (
      <span
        aria-hidden="true"
        className={cn("inline-flex h-9 w-9 shrink-0", className)}
      />
    );
  }

  // resolvedTheme collapses "system" to the concrete light/dark the user is
  // actually seeing, so the binary toggle always flips to the opposite of what
  // is on screen.
  const isDark = resolvedTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";
  const current = isDark ? "dark" : "light";

  const Icon = isDark ? Moon : Sun;
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
