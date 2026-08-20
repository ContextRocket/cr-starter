/**
 * Theme init script -- the no-flash theme bootstrap string.
 *
 * Rendered by the ROOT layout (app/layout.tsx) as a `next/script`
 * `beforeInteractive` script, injected once into the initial HTML <head> and
 * never re-rendered on client navigation -- so a language switch (which
 * re-renders the [locale] layout) cannot re-create it and trip React 19's
 * "Encountered a script tag while rendering React component" warning.
 *
 * It sets the `.dark`/`.light` class + color-scheme from localStorage /
 * prefers-color-scheme before first paint, exactly what next-themes' own script
 * did -- but owned here, at the document level, so it does not warn.
 *
 * next-themes is kept purely for the runtime toggle/state (useTheme/setTheme in
 * theme-toggle.tsx); its redundant body <script> is neutralized to a
 * non-executable data block in theme-provider.tsx.
 *
 * MUST stay byte-compatible with the ThemeProvider config (theme-provider.tsx):
 *   - storageKey "theme"      -> next-themes' default localStorage key.
 *   - attribute "class"       -> adds "light"/"dark" as a class on <html>.
 *   - defaultTheme             -> first visit uses the configured default;
 *                                "system" follows prefers-color-scheme.
 *   - enableColorScheme       -> also sets <html>.style.colorScheme.
 * If any of those props change, update the constants below in the same edit.
 */

// Keep in sync with theme-provider.tsx (next-themes defaults / our props).
export const THEME_STORAGE_KEY = "theme";

export type ThemeDefault = "system" | "light" | "dark";

// Self-invoking, dependency-free, and defensive (try/catch): a throw here would
// block first paint. Mirrors next-themes' attribute="class" + enableColorScheme
// behavior: resolve stored theme (or the configured default, where "system"
// follows prefers-color-scheme), then swap the class before the body renders.
export function createNoFlashScript(
  defaultTheme: ThemeDefault = "system",
): string {
  return `(function(){try{var k=${JSON.stringify(
    THEME_STORAGE_KEY,
  )};var d=document.documentElement;var t=null;try{t=localStorage.getItem(k)}catch(e){}if(!t){t=${JSON.stringify(
    defaultTheme,
  )}}if(t==="system"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}d.classList.remove("light","dark");d.classList.add(t);d.style.colorScheme=t}catch(e){}})();`;
}

/** Backwards-compatible system-default script for callers outside the layout. */
export const NO_FLASH_SCRIPT = createNoFlashScript();
