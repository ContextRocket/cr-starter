# ContextRocket Starter -- Developer Guide

This is the public, **Astro/static-first** starter. The product is a branded
website that builds to a flat `dist/` tree for any CDN (Cloudflare Pages,
CloudFront, S3, Netlify, etc.). There is no local backend, database, or auth.

AI chat for customer sites is the **embed widget** from the public `cr-sdk`
repo (`@contextrocket/embed-chat`), copied to `public/embed/widget.js` for
local demos. Typed browser access uses `@contextrocket/sdk` (A2A +
`createCRClient`). See `docs/embed-direction.md`.

## Configuration ownership

1. `config/site.json` -- fork-owned identity, navigation, theme, assets, legal
   data, chrome, feature switches, locales, and `publicRoutes`.
2. `src/i18n/messages/site/*.ts` -- fork-owned copy for the locales the site
   serves.
3. `blog.config.mjs` -- public blog path/title and Markdown collection directory.
4. `src/config/site.config.ts` -- starter-owned typed seam and defaults.
5. `.env` / `PUBLIC_*` variables -- optional overrides (see `.env.example`).

`publicRoutes` is the explicit allowlist for sitemap, robots, and llms.txt.

## Default surface (keep minimal)

**In by default**

- Home (landing) -- fork-owned composition under `src/pages/[locale]/index.astro`
- Blog (path from `blog.config.mjs`)
- Website hygiene: privacy, terms, cookies, impressum (feature-flagged),
  cookie banner, `sitemap.xml`, `robots.txt`, `llms.txt`, `feed.xml`,
  `.well-known/security.txt`
- Multi-locale support (same convention as before). A fork may set
  `locales: ["en"]` only.

**Out by default (do not reintroduce as required pages)**

- FAQ, About, Features-as-a-page, gallery/portfolio demos, auth/dashboard

Forks add brand-specific pages under `src/pages/` or `src/components/custom/`
when needed. Do not force FAQ/About onto every port.

Brand → one light landing experiments live under `examples/` (see
`examples/README.md` and `scripts/apply-brand-pack.mjs`).

## Hard rules

1. Self-contained product code; do not import from sibling *app* repos.
   Browser SDK/embeds come only from published `@contextrocket/*` packages
   (local `file:` checkout of `cr-sdk` during development).
2. Temporary files only in `scratchpad/` (git-ignored).
3. Never add LLM keys. Live chat uses the embed widget + publishable API key.
4. Static builds must work offline in demo mode.
5. No hardcoded UI copy; use `src/i18n/keys.ts` (`createT(locale)`) and `t()`.
6. Organization handle: `handle`, `PUBLIC_CONTEXTROCKET_HANDLE`,
   `data-contextrocket-handle`.
7. Browser credentials: `apiKey`, `PUBLIC_CONTEXTROCKET_API_KEY`,
   `data-contextrocket-api-key` (origin-bound, not server secrets).

## Local development

Dev / preview ports (avoid ContextRocket on 3000 / 3003):

| Site | Port |
| --- | --- |
| `cr-starter` | 3100 |
| `cr-kleos` | 3101 |
| `cr-markmacmahon` | 3102 |

New brand forks should take the next free `31xx` port in `astro.config.mjs`.

```bash
source ~/.zshrc && nvm use --silent
pnpm install
pnpm dev   # http://localhost:3100
```

Before committing: `pnpm run verify` (behavior IDs, theme, i18n, typecheck,
unit behavior tests, build, smoke routes).

## Architecture and testing

- `src/ARCHITECTURE.md` — state kinds and ownership seams for this static site.
- `docs/testing-doctrine.md` — behavior-first Vitest rules (from cr-landing,
  adapted; no Cucumber).
- `features/*/BEHAVIOR.md` — owner-readable contracts with stable IDs.
- `__tests__/features/` — Given/When/Then tests via `__tests__/support/bdd.ts`.

Do not assert exact marketing copy. Prefer pure helpers and observable outcomes.
Product-app state (Query / Zustand / nuqs / XState) belongs in `cr-auth-starter`
/ `cr-landing`, not here.

## Relationship to other repos

- **cr-auth-starter / Luna** -- Next.js + API line. Tracks `cr-landing`
  architecture (Query / Zustand / nuqs / XState, behavior contracts). This
  Astro starter shares testing *ideas*, not that state stack.
- **ContextRocket product / cr-landing** -- separate. Learn from this starter's
  publish contract; do not fork or depend on this repo from the product.
- **Brand forks (kleos, markmacmahon, …)** -- Astro config + content + home
  override; stay on the static path.

## Embed widget

```bash
pnpm run build:widget
```

Install on any site:

```html
<script
  src="https://your-cdn.example/embed/widget.js"
  defer
  data-contextrocket-handle="your-handle"
  data-contextrocket-api-key="your-publishable-key"
></script>
```

Local builds copy the script to `public/embed/widget.js`.
