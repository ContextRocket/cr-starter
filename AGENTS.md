# ContextRocket Starter -- Developer Guide

This is the public, **Astro/static-first** starter. Astro generates the pages
at build time into a `dist/` tree for any CDN (Cloudflare Pages, CloudFront,
S3, Netlify, etc.). Generated sites do not require server-side rendering, a
local backend, a database, or auth.

AI chat for customer sites is the **embed widget** from the public `cr-sdk`
repo (`@contextrocket/embed-chat`), copied to `public/embed/widget.js` for
local demos. Typed browser access uses `@contextrocket/sdk` (A2A +
`createCRClient`). See `docs/embed-direction.md`.

## Configuration ownership

1. `config/site.json` -- fork-owned identity, navigation, one semantic theme,
   assets, chrome,
   feature switches, locales, and `publicRoutes`.
2. `src/i18n/messages/site/*.ts` -- fork-owned copy for the locales the site
   serves.
3. `blog.config.mjs` -- public blog path/title, Markdown post directory, and
   optional topic directory.
4. `src/config/site.config.ts` -- starter-owned typed seam and defaults.
5. `.env` / `PUBLIC_*` variables -- optional overrides (see `.env.example`).

`publicRoutes` is the explicit allowlist for sitemap, robots, and llms.txt.
For the `blog` entry, it controls publication and sitemap metadata; the public
URL itself comes from `blog.config.mjs` so generated links cannot drift from
the emitted Astro routes.

## Default surface (keep minimal)

**In by default**

- Home (landing) -- fork-owned composition under `src/pages/[locale]/index.astro`
- Blog (path from `blog.config.mjs`)
- Optional evergreen topics (only when `features.topics` is enabled)
- Contact (localized SDK contact-form example; demo mode by default)
- Website discovery: `sitemap.xml`, `robots.txt`, `llms.txt`, `feed.xml`,
  `.well-known/security.txt`
- Optional cookie consent banner (off unless explicitly enabled)
- Multi-locale support (same convention as before). A fork may set
  `locales: ["en"]` only.

Theme tokens define one brand palette in `theme.tokens`; use semantic roles for
different page surfaces. The starter does not require paired light/dark themes
or an appearance toggle.

**Out by default (do not reintroduce as required pages)**

- Privacy, terms, cookies, impressum, attribution, FAQ, About,
  Features-as-a-page, gallery/portfolio demos, auth/dashboard, testimonials

Forks add brand-specific pages under `src/pages/` or `src/components/custom/`
when needed. Do not force FAQ/About onto every port.

Brand crawl / Brand Lab tooling is **internal** and lives in the sibling
`cr-labs` repo (`cr-labs/docs/brand-lab.md`), not in this public starter.

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

In `cr-starter`, `pnpm run verify` checks behavior IDs, theme, i18n, lint,
types, unit behavior tests, the static build, and smoke routes. Brand forks have their
own `verify` scripts; check their `package.json` before relying on the same
gates. For routine copy, config, or page regeneration, run `pnpm run build` and
add only a focused check when the changed behavior needs it. Use `verify` for
shared starter contracts or release checks, not every fork edit. Keep shared
components and their broad validation in `cr-sdk` or `cr-starter`; keep brand
fork changes small. Playwright belongs to ContextRocket's browser crawl/probe
worker, not the Astro build path. Do not run the test suite unless asked.

## Architecture and testing

- `src/ARCHITECTURE.md` — state kinds and ownership seams for this static site.
- `docs/testing-doctrine.md` — behavior-first Vitest rules (from cr-landing,
  adapted; no Cucumber).
- `features/*/BEHAVIOR.md` — starter contracts with stable IDs.
- `__tests__/features/` — starter Given/When/Then tests via
  `__tests__/support/bdd.ts`. Forks can add checks for their own behavior.

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
pnpm run build:embeds
```

This optional contributor command expects a sibling `../cr-sdk` checkout and
refreshes both the chat widget and contact-form bridge. Normal starter builds
use the checked-in assets and do not need that checkout.

For a local or self-hosted install, use the checked-in artifact:

```html
<script
  src="/embed/widget.js"
  defer
  data-contextrocket-handle="your-handle"
  data-contextrocket-api-key="your-publishable-key"
></script>
```

The chat script is served from `public/embed/widget.js`; the contact example
loads `public/embed/contact-form.js`. The SDK build command also refreshes
`src/types/contextrocket-contact-form.d.ts` from the SDK contract. A published
chat artifact can be selected with `PUBLIC_CONTEXTROCKET_CHAT_WIDGET_URL`; the
contact-form bridge can use `PUBLIC_CONTEXTROCKET_CONTACT_FORM_SCRIPT_URL` or
`contactForm.scriptSrc` in `config/site.json`. Both default to local files for
offline demos. The chat and contact-form bridge `v0.1.0` URLs in
`docs/embed-direction.md` are published. Pin those URLs when a site should
load the shared CDN artifact; keep the local default for offline demos. New
releases use a new versioned prefix and the operator workflow in `cr-sdk`.
