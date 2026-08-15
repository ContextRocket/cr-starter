/**
 * ThemeInitScript — the no-flash theme bootstrap, rendered the React-19-approved
 * way.
 *
 * WHY THIS EXISTS: next-themes (attribute="class") renders its own inline
 * no-flash <script> as a CHILD of the client-side ThemeProvider tree. In React
 * 19, an inline <script> (no non-executable `type`) that a *client* component
 * creates triggers the dev-console warning:
 *
 *   "Encountered a script tag while rendering React component. Scripts inside
 *    React components are never executed when rendering on the client."
 *
 * (React only executes scripts that arrive in the initial SSR HTML; one created
 * during a client render/transition is inert, hence the warning.) The theme and
 * the no-flash both actually work — it is a dev-console-only warning — but we
 * remove the cause: this script is rendered in the RSC <head> (a Server
 * Component), so React emits it in the initial HTML and never re-creates it on
 * the client. Placed before first paint, it sets the `.dark`/`.light` class and
 * `color-scheme` from localStorage / prefers-color-scheme with zero flash —
 * exactly what next-themes' own script did, now owned here.
 *
 * next-themes is kept purely for the runtime toggle/state (useTheme/setTheme in
 * theme-toggle.tsx); its redundant body <script> is neutralized to a
 * non-executable data block in theme-provider.tsx so it no longer warns and no
 * longer double-runs. See components/ui/theme-provider.tsx.
 *
 * MUST stay byte-compatible with the ThemeProvider config (theme-provider.tsx):
 *   - storageKey "theme"      → next-themes' default localStorage key.
 *   - attribute "class"       → adds "light"/"dark" as a class on <html>.
 *   - defaultTheme "system"   → first visit follows prefers-color-scheme.
 *   - enableColorScheme       → also sets <html>.style.colorScheme.
 * If any of those props change, update the constants below in the same edit.
 */

// Keep in sync with theme-provider.tsx (next-themes defaults / our props).
export const THEME_STORAGE_KEY = "theme";

// Self-invoking, dependency-free, and defensive (try/catch): a throw here would
// block first paint. Mirrors next-themes' attribute="class" + enableColorScheme
// behavior: resolve stored theme (or "system" → prefers-color-scheme), then
// swap the class and set color-scheme before the body renders.
const NO_FLASH_SCRIPT = `(function(){try{var k=${JSON.stringify(
  THEME_STORAGE_KEY,
)};var d=document.documentElement;var t=null;try{t=localStorage.getItem(k)}catch(e){}if(!t||t==="system"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}d.classList.remove("light","dark");d.classList.add(t);d.style.colorScheme=t}catch(e){}})();`;

/**
 * Rendered inside <head> of the [locale] layout (a Server Component). Because it
 * ships in the initial SSR HTML, the browser executes it before first paint and
 * React never re-creates it on the client — so no "script tag" warning.
 */
export function ThemeInitScript() {
  return (
    <script
      // suppressHydrationWarning: the class we set here diverges from the
      // server-rendered <html> (which has no theme class), same contract as the
      // <html suppressHydrationWarning> the layout already sets.
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }}
    />
  );
}
