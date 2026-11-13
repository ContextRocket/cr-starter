# Crawl-derived brand themes

The starter's `theme.tokens` is the rendering contract: one curated palette of
semantic CSS values for a particular site. It can describe a light, dark, or
mixed-surface design without maintaining paired light and dark modes.

Crawler output is evidence, not a ready-made theme. A crawl can observe colors,
font families, logo candidates, and screenshots, but those observations do not
by themselves say which color should be page background, body text, a CTA, or a
focus ring. Review the evidence and map it into the semantic tokens in
`config/site.json`.

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
- Keep observed font names in the receipt. Add a font to the site only when the
  asset is licensed and included locally; a name alone is not a deployable
  font.
- Review the page composition separately. A palette cannot reproduce spacing,
  typography hierarchy, imagery, or source-specific content structure.

`pnpm run theme:check` evaluates configured semantic text pairs at WCAG AA's
4.5:1 normal-text threshold and focus-ring pairs at 3:1. Pass
`--config <site.json>` to audit a fork's theme with the same validator. It
supports hex, RGB(A), and HSL(A) token values and fails when a configured pair
cannot be measured. This guards selected token combinations; it does not
replace checking actual component states and screenshots.

The normalized palette is intentionally small and maintainable. The receipt
retains the richer crawl context without making the public site's runtime
depend on internal crawl tools or a sibling repository.
