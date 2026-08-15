"use client";

/**
 * ThemeProvider — next-themes wrapper that drives light/dark mode for the
 * whole cr-starter surface.
 *
 * Config contract (do not weaken without a reason):
 *   - attribute="class"        → toggles the `.dark` class on <html>, matching
 *                                the `@custom-variant dark (&:is(.dark, .dark *))`
 *                                and the `.dark {}` token block in globals.css.
 *   - defaultTheme="system"    → first-visit users follow their OS preference.
 *   - enableSystem             → keep tracking the OS "system" choice.
 *   - disableTransitionOnChange→ no color-transition flash when the class flips.
 *
 * The [locale] layout already sets `<html suppressHydrationWarning>`, which is
 * required so the server-rendered (no class) markup can be reconciled with the
 * theme class next-themes injects before hydration without a warning.
 */

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
