# Crawl-derived brand themes

The ContextRocket crawl pipeline's canonical published artifact is
`theme.json` (`cr.theme.v1`). It carries captured evidence, semantic light and
dark variants, a `site_mode`, marks, icons, and provenance. The starter's
`config/site.json` remains the fork-owned runtime configuration and contains
one selected semantic palette; it does not yet import or resolve a published
`theme.json` automatically.

The theme document is a reviewed, publishable projection of crawl evidence,
not a reproduction of the source site's layout engine. When applying it to a
matching site, use the `site_mode` variant; use the document's `default`
variant for ContextRocket-generated surfaces. Map its shared semantic token
vocabulary into `config/site.json` without inventing a second token language.
The starter currently requires that mapping to be done explicitly.

When a theme is generated from a brand pack, keep its compact design receipt in
`docs/brand-evidence/`. The receipt records the selected values, observed color
samples, provenance, typography notes, and source references. Treat it as
review and synchronization material; page rendering reads `theme.tokens`, not
the receipt. Preserve both the evidence and the selected tokens so a later
brand adjustment does not erase why the original choices were made.
When source screenshots are available, keep copies alongside the receipt and
use relative paths so the evidence remains useful after the source pack moves.

Before accepting generated tokens:

- Compare the selected background and foreground with the source screenshots.
- Confirm accent and CTA roles from observed controls, rather than assigning
  every prominent color the same role.
- Check text and control contrast, including the focus ring.
- Keep observed font names and evidence in the receipt. Never fetch or hotlink
  a customer's font. Use an included, licensed local font or a shared
  ContextRocket font; names alone do not make a font available to the site.
- Preserve the theme's `--nav-*` roles separately from page surfaces. Shared
  starter headers consume these roles, with semantic page tokens as fallback.
- Review the page composition separately. A palette cannot reproduce spacing,
  typography hierarchy, imagery, or source-specific content structure.

`pnpm run theme:check` evaluates configured semantic text pairs at WCAG AA's
4.5:1 normal-text threshold and focus-ring pairs at 3:1. Pass
`--config <site.json>` to audit a fork's theme with the same validator. It
supports hex, RGB(A), and HSL(A) token values and fails when a configured pair
cannot be measured. This guards selected token combinations; it does not
replace checking actual component states and screenshots.

The normalized palette is intentionally small and maintainable. The published
theme bundle retains richer crawl context without making a public site's
runtime depend on internal crawl tools or a sibling repository.
