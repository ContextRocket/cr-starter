# Extension and ownership guide

The starter is intentionally small. General behavior belongs here; a fork should normally supply data, copy, theme, assets, and a site-specific page composition.

## Fork-owned

| Area | Location |
|---|---|
| Brand identity, navigation, theme, assets, legal data | `config/site.json` |
| Site language and content | `src/i18n/messages/site/*.ts` |
| Home page composition | `src/pages/[locale]/index.astro` (and flat `src/pages/index.astro` for single-locale) |
| Optional site-specific pages | `src/pages/` and `src/components/custom/` |
| Fork-owned images and public files | `public/` |
| Truly bespoke components | `src/components/custom/` |

## Starter-owned

Pull these from `cr-starter` rather than copying fork logic into them (see `.fork-sync.json`):

- `src/components/chrome/`, `src/components/gallery/`, shared page shells under `src/components/pages/`;
- `src/lib/`;
- `src/config/site.config.ts`;
- `src/i18n/messages/shared/` and `src/i18n/messages/app/`;
- public discovery routes (`sitemap`, `robots`, `llms`, `feed`, `.well-known`);
- `cli/`.

Browser SDK and embeds live in the sibling public repo **`cr-sdk`**
(`@contextrocket/sdk`, `@contextrocket/embed-chat`), not in this starter.

## Adding a feature

1. Decide whether it is general functionality or brand content.
2. Put general behavior in a shared component, library, config seam, or i18n app/shared slice.
3. Put site-specific copy in the fork's `site/` messages.
4. Keep static builds usable offline; live ContextRocket access stays browser-direct via the embed widget.
5. Run `make verify` (theme, i18n, typecheck, build, smoke).

Auth, passwordless accounts, dashboards, and FastAPI are deliberately outside this public repo. Use the private `cr-auth-starter` for those concerns.
