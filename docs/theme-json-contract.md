# Applying a crawled ContextRocket theme

The brand crawl pipeline publishes one `cr.theme.v1` `theme.json` document for
each brand. It records the captured evidence, semantic light and dark variants,
the site's `site_mode`, marks, icons, and provenance. The artifact describes a
brand identity; it is not a copy of the source site's layout system.

When building that brand's site, use the variant named by `site_mode`. For
ContextRocket generated surfaces, use the document's `default` variant. Keep
one selected palette in `config/site.json`; the public starter does not add a
light/dark switch or a second token vocabulary. The starter currently requires
an explicit mapping from `theme.json` into `config/site.json`; it does not yet
import a published theme bundle automatically.

Map the document's semantic roles directly, including `--nav-surface`,
`--nav-ink`, `--nav-muted`, and `--nav-line`. Shared headers use those nav roles
and fall back to the page's semantic surface, foreground, muted, and border
tokens when roles are absent. Do not infer missing brand colors or fetch
customer fonts from their site. Use included licensed fonts or the shared
ContextRocket font kit. Keep source evidence and warnings with the fork so
future refinements can be checked against what the crawl actually observed.

See [`customizing-design.md`](customizing-design.md) for the site's
configuration workflow.
