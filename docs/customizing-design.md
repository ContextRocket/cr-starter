# Customizing the design

Use [`style-and-structure-guide.md`](style-and-structure-guide.md) as the
required checkpoint for preserving a fork's visual language, content, voice,
and baseline during synchronization.

For a crawl-derived starting point, see [`brand-evidence.md`](brand-evidence.md).
Keep the evidence receipt with the fork so later design changes can be reviewed
against what the crawl actually observed.

Fork design is data-first. Start with `config/site.json`:

- `theme.tokens` contains one curated set of CSS variable values for the site's
  brand. Use semantic roles consistently across page surfaces;
- `theme.radius` controls the component radius system;
- `assets` points at fork-owned logos and images;
- `chrome` controls the header/footer presentation, including
  `poweredByTone` (`ink` for light surfaces, `white` for dark surfaces); and
- `nav` controls links and public feature flags.

Typography uses the same theme seam: set `--font-sans`, `--font-mono`, or
`--font-editorial` in `theme.tokens`. ContextRocket's Inter Tight, Geist Mono,
and Newsreader Italic are served from the shared ContextRocket CDN brand kit.
For a customer-specific font, self-host its licensed WOFF2 files and declare
`@font-face` in the fork's `src/styles/global.css` with `font-display: swap`.

Keep site-specific photos in `public/` so their URLs stay stable. Resize them
for their largest rendered use before adding them: the starter's blog images
are at most 1800 pixels on the long edge and use JPEG quality 82, which keeps
retina article covers sharp without shipping camera-resolution originals.
Shared ContextRocket logos and fonts belong in the product CDN; client photos
remain with the site that owns them.

`PoweredBy.astro` and the default ContextRocket logo load from the stable
`https://contextrocket.cdn.contextrocket.com/brand/` asset namespace. The
starter fonts use that same published kit. Internal operators publish updates
from ContextRocket main; org container pages use the same URLs so every
ContextRocket surface shares one release.

Use these published assets directly; do not copy shared brand files into each
site's `public/` directory:

| Asset | URL | Use |
| --- | --- | --- |
| Ink horizontal wordmark | `https://contextrocket.cdn.contextrocket.com/brand/logo-h-spark-ink.svg` | Light backgrounds |
| White horizontal wordmark | `https://contextrocket.cdn.contextrocket.com/brand/logo-h-spark-white.svg` | Dark backgrounds |
| Ink vertical wordmark | `https://contextrocket.cdn.contextrocket.com/brand/logo-v-spark-ink.svg` | Narrow light surfaces |
| White vertical wordmark | `https://contextrocket.cdn.contextrocket.com/brand/logo-v-spark-white.svg` | Narrow dark surfaces |
| Ink icon | `https://contextrocket.cdn.contextrocket.com/brand/icon-spark-ink.svg` | Light-background icon |
| White icon | `https://contextrocket.cdn.contextrocket.com/brand/icon-spark-white.svg` | Dark-background icon |
| Ink icon tile | `https://contextrocket.cdn.contextrocket.com/brand/icon-tile-ink.svg` | Square logo, such as the header mark |
| Inter Tight variable | `https://contextrocket.cdn.contextrocket.com/brand/fonts/InterTight-Variable.woff2` | Marketing sans |
| Newsreader Italic | `https://contextrocket.cdn.contextrocket.com/brand/fonts/Newsreader-Italic.woff2` | Editorial emphasis |
| Geist Mono variable | `https://contextrocket.cdn.contextrocket.com/brand/fonts/GeistMonoVF.woff` | Code and monospace text |

The shared font paths return `Access-Control-Allow-Origin: *` for cross-origin
font loading. Keep site-specific images and fonts local; only shared
ContextRocket brand assets use this CDN kit.

Site copy belongs in `src/i18n/messages/site/<locale>.ts` for the locales
the fork serves. An English-only fork should keep only en.ts in each message
slice. Shared and app messages are starter-owned. Keep all visible strings
behind the i18n API (`createT(locale)` / `t()`).

For a genuinely different home page, edit `src/pages/[locale]/index.astro`
(and the unprefixed home when single-locale) while preserving shared sections
and config seams. Add fork-specific components under `src/components/custom/`.

## Review checklist

- Check mobile and desktop layouts.
- Check the chosen brand palette across all page surfaces.
- Check every locale listed in `config/site.json`.
- Check focus states, keyboard navigation, and reduced motion.
- Run the static build so the design works without a server.

```bash
pnpm run build
```
