# Fork customization (Astro static starter)

Forks change data, copy, theme, assets, and home composition. Shared behavior
stays in the parent starter.

## Ownership

Fork-owned:

- `config/site.json` (including `publicRoutes` and `locales`)
- `blog.config.mjs`
- `src/i18n/messages/site/<locale>.ts`
- Markdown under `content/`
- `src/pages/[locale]/index.astro` and other product-specific routes
- `src/components/custom/`
- `public/` assets

Parent-owned:

- `src/layouts/`, `src/components/chrome/`, `src/lib/`
- `src/config/site.config.ts`
- `src/i18n/keys.ts`, `translator.ts`, `messages/shared/`, `messages/app/`
- Hygiene endpoints (`sitemap.xml`, `robots.txt`, `llms.txt`, `feed.xml`,
  security.txt)
- `cli/`

Browser SDK and embeds: public sibling **`cr-sdk`** (pnpm `file:` dependency).

## Default surface

Keep forks close to: **home + blog + legal/hygiene**. Do not require FAQ,
About, or Features pages. Add brand pages only when the product needs them.

## Locales

The starter supports multiple locales. An English-only fork sets
`locales: ["en"]` and keeps only `en.ts` in each message slice. After build,
`scripts/flatten-single-locale.mjs` promotes `/en/` to `/` for clean URLs.

## Sync note

This Astro starter is **not** synchronized into `cr-auth-starter` or Luna.
Those remain on a separate Next + API line. Brand forks of this starter may
use a future copy-policy if needed; prefer pulling parent-owned paths
deliberately rather than a repository-wide merge.

## Promoting reusable behavior

1. Prototype in the fork.
2. Move generic behavior into this parent.
3. Add a typed config/variant seam and a test when practical.
4. Update the fork to consume the seam; delete the duplicate.
