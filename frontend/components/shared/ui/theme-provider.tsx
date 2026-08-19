"use client";

/**
 * ThemeProvider -- next-themes wrapper that drives light/dark mode for the
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
 *
 * NO-FLASH / REACT-19 NOTE: the initial-paint theme class is owned by
 * <ThemeInitScript> in the RSC <head> (components/ui/theme-init-script.tsx), NOT
 * by next-themes' own inline script. next-themes still renders that script as a
 * child of this CLIENT provider, and in React 19 a client-rendered inline
 * <script> (no non-executable `type`) trips the dev-console warning "Encountered
 * a script tag while rendering React component". We neutralize it with
 * `scriptProps={{ type: "text/x-theme-noop" }}`: an unrecognized (non-JS) type
 * makes React treat the tag as an inert data block -- so it no longer warns AND
 * no longer executes (the head script already did the real work). next-themes is
 * kept purely for the runtime toggle/state (useTheme/setTheme). scriptProps is
 * spread first, so next-themes' own `suppressHydrationWarning` /
 * `dangerouslySetInnerHTML` still win -- only the (unused) type is added.
 */

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      scriptProps={{ type: "text/x-theme-noop" }}
    >
      {children}
    </NextThemesProvider>
  );
}
