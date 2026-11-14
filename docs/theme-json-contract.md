# Applying a crawled ContextRocket theme

The brand crawl pipeline publishes one `cr.theme.v1` `theme.json` document for
each brand. It records the captured evidence, semantic light and dark variants,
the site's `site_mode`, marks, icons, and provenance. The artifact describes a
brand identity; it is not a copy of the source site's layout system.

When building that brand's site, use the variant named by `site_mode`; if the
document has no such variant, use its `default` variant. ContextRocket
generated surfaces use `default`. Keep one selected palette in
`config/site.json`; the public starter does not add a light/dark switch or a
second token vocabulary.

Import a published theme with `pnpm run theme:import`:

```bash
pnpm run theme:import --org <handle>            # https://<handle>.cdn.contextrocket.com/theme/
pnpm run theme:import --from <bundle-dir|theme.json>
pnpm run theme:import --org <handle> --dry-run  # print the changes only
```

The import refuses any document that is not `cr.theme.v1`. It merges the site
variant's `tokens` and `radius` into `theme` in `config/site.json`: document
tokens replace the same keys, and tokens the document does not carry stay as
the fork set them. It copies the site's logo and wordmark marks (observed
colours: the `trimmed` file, else `saved`) and the bundle's icon set to
`public/theme/`, and points `assets.logo`, `assets.wordmark` and the icon
fields (`faviconIco`, `icon16`, `icon32`, `appleTouchIcon`, `icon192`,
`icon512`, `icon192Maskable`, `icon512Maskable`) at them. An icon size the
bundle does not provide is set to `""`, so the layout omits its link tag. The
import owns `public/theme/` and removes files there that the new theme no
longer uses. Every other field stays fork-owned. The candidate config must pass
`scripts/validate-theme.mjs` before anything is written; a theme that fails the
contrast check is reported and nothing changes. Running the import again with
the same theme changes nothing. Use `--config` and `--public` to target another
fork layout.

The document's semantic roles include `--nav-surface`, `--nav-ink`,
`--nav-muted`, and `--nav-line`. Shared headers use those nav roles and fall
back to the page's semantic surface, foreground, muted, and border tokens when
roles are absent. Do not infer missing brand colors or fetch customer fonts
from their site. Use included licensed fonts or the shared ContextRocket font
kit. The import prints the theme's warnings, such as fonts the crawl could not
load. Keep source evidence and warnings with the fork so future refinements can
be checked against what the crawl actually observed.

See [`customizing-design.md`](customizing-design.md) for the site's
configuration workflow.
