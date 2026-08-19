/**
 * ThemeStyle -- injects the site design tokens into :root / .dark.
 *
 * `siteConfig.theme` (config/site.config.ts) is the single source of truth for
 * the design tokens; this Server Component renders a <style> tag that maps the
 * `light`/`dark` token objects onto `:root` / `.dark`. A fork re-themes the
 * entire site by editing `siteConfig.theme` alone -- no globals.css edits.
 *
 * globals.css :root/.dark remain as the FALLBACK for any token a fork omits,
 * so an empty/partial theme still renders the shipped defaults. Values are
 * author-controlled (trusted), hence dangerouslySetInnerHTML.
 */

import { siteConfig } from "@/config/site.config";

function cssBlock(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n");
}

export function ThemeStyle() {
  const { radius, light, dark } = siteConfig.theme;
  const css = [
    ":root {",
    `  --radius: ${radius};`,
    cssBlock(light),
    "}",
    ".dark {",
    cssBlock(dark),
    "}",
  ].join("\n");

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
