# ContextRocket Starter -- Developer Guide

This is the public, Next.js/static-first starter. The frontend is the product. It has no local backend, database, auth, passwordless account flow, or dashboard. AI capabilities delegate directly to ContextRocket over browser A2A when live mode is enabled.

## Configuration ownership

The starter separates data, language, and behavior:

1. `frontend/config/site.json` -- fork-owned identity, navigation, theme, assets, legal data, chrome settings, feature switches, and the explicit `publicRoutes` discovery list.
2. `frontend/i18n/messages/site/*.ts` -- fork-owned copy for the locales the site actually serves.
3. `frontend/config/site.config.ts` -- starter-owned typed configuration seam and sensible defaults.
4. `frontend/config/.env.example` -- optional environment overrides for site toggles and ContextRocket connection settings.

Basic forks edit `site.json` and the `site/` message files. Advanced forks may add components under `frontend/components/custom/` and compose their own home page.

`publicRoutes` is the fork-owned list of pages intended for public discovery.
The starter-owned route registry and builders use it for `sitemap.xml`,
`robots.txt`, `llms.txt`, and shared URL metadata. Keep it explicit: do not
publish demo, dashboard, preview, or product-only routes just because a route
file exists. A custom blog path or product route is declared here while its
page and content remain fork-owned.

## Hard rules

1. Keep the public starter self-contained; never import from a sibling repository.
2. Put temporary files only in `frontend/scratchpad/` (git-ignored).
3. Never add LLM keys. Live chat goes directly to ContextRocket A2A.
4. Demo mode must remain usable without a network connection so static exports work.
5. Do not hardcode UI copy; use `i18n/keys.ts` and `t()`.
6. Use organization handle terminology in public code and docs. The canonical fields are `handle`, `metadata.handle`, `CONTEXTROCKET_HANDLE`, and `data-contextrocket-handle`.
7. Use `apiKey`, `api-key`, `NEXT_PUBLIC_CONTEXTROCKET_API_KEY`, and `data-contextrocket-api-key` for browser credentials. These are publishable, origin-bound credentials, not server secrets.
8. Keep general functionality in the starter. Forks should change configuration, content, theme, and narrowly scoped page composition--not copy shared transport or UI code.

## i18n structure

Messages are split into ownership slices:

| Slice  | Path                             | Purpose                                                               | Owner   |
| ------ | -------------------------------- | --------------------------------------------------------------------- | ------- |
| shared | `frontend/i18n/messages/shared/` | Cross-cutting UI such as forms, nav, errors, cookies, and breadcrumbs | Starter |
| app    | `frontend/i18n/messages/app/`    | Chat, embed, and development/demo UI                                  | Starter |
| site   | `frontend/i18n/messages/site/`   | Home, blog, FAQ, footer, legal pages, and testimonials                | Fork    |

Each locale barrel merges the three slices. Keep only the locale files the fork
serves; an English-only fork needs only en.ts in each slice. Run
pnpm --dir frontend i18n:generate after changing message files; do not
hand-edit generated wiring.

The public API is in `frontend/i18n/keys.ts`:

- server components use `setLocale(locale); t("KEY")`;
- client components use `useLocale()` plus `t()` from `keys.ts`.

## Toolchain

- Frontend: pnpm, Next.js App Router, TypeScript, Vitest.
- Widget: standalone TypeScript/esbuild bundle in `clients/embed-widget/`.
- CLI: standalone TypeScript package in `cli/`; this checked-in directory is
  the only customer distribution home. Do not reintroduce a CDN installer or a
  sibling-repo copy.
- Before Node commands: `source ~/.zshrc && nvm use --silent`.
- All make commands run from the repository root.

Useful commands:

```bash
make test-frontend
make test-cli
make build-static
make build-widget
make verify
```

## ContextRocket integration

The default chat mode is canned demo data. Live mode uses direct browser A2A and requires `NEXT_PUBLIC_CR_CHAT_MODE=live`, `NEXT_PUBLIC_CR_AGENT_URL`, `NEXT_PUBLIC_CONTEXTROCKET_HANDLE`, and a publishable `NEXT_PUBLIC_CONTEXTROCKET_API_KEY` where the ContextRocket deployment requires one.

The browser must never mint or hold a server-side machine credential. ContextRocket is responsible for validating the API key, binding it to the organization handle, checking the request `Origin` against the key/agent allowlist, applying rate limits, and failing closed before agent execution.

The widget contract is the same as the app contract. Do not introduce a Next.js API proxy merely to make a demo work; canned mode exists for static-only demos.

## Fork workflow

The public starter is the base for sites that need only Next/static functionality. The private `cr-auth-starter` contains FastAPI, passwordless auth, and dashboard functionality. `cr-luna` is based on that private starter.

Fork-owned files:

| Category         | Files                                                           | Rule                                                  |
| ---------------- | --------------------------------------------------------------- | ----------------------------------------------------- |
| Content/data     | `frontend/config/site.json`, `frontend/i18n/messages/site/*.ts` | Customize freely                                      |
| Site composition | `frontend/app/[locale]/page.tsx`, optional site pages           | Preserve the starter seams; keep brand content/design |
| Assets           | `frontend/public/`                                              | Keep only fork-owned assets                           |
| Custom design    | `frontend/components/custom/`                                   | Use for genuinely fork-specific components            |

Starter-owned files should be pulled from `cr-starter`: `components/shared/`,
`lib/` (including `public-route-registry.ts` and `public-site.ts`),
`config/site.config.ts`, `i18n/messages/shared/`, `i18n/messages/app/`,
`clients/embed-widget/`, `cli/`, the public discovery route wrappers
(`app/sitemap.ts`, `app/robots.ts`, and `app/llms.txt/route.ts`), and the
shared public-site contract test.

When rebuilding an existing fork, inventory and preserve its content, assets, custom page composition, and theme before replacing starter-owned infrastructure. Never overwrite a ported site with the starter placeholder site.

## Mandatory fork-evolution contract

Read [docs/fork-evolution.md](docs/fork-evolution.md) before changing a fork.
The short version is mandatory:

- Forks may change `site.json` (including `chrome.defaultTheme`), documented environment values, `site/` messages,
  Markdown content, public assets, site routes, and `components/custom/`.
- Forks must not edit `components/shared/`, `lib/`, `site.config.ts`, shared/app
  messages, generated i18n wiring, the ChatFab, gallery, widget, CLI, or the
  public discovery route wrappers.
- Use theme tokens, chrome settings, exposed variants, or custom wrappers for
  visual changes. Do not override shared internals with fragile CSS selectors.
- If a fork prototype is reusable, move only the generic behavior here, add a
  typed configuration/variant seam and tests, synchronize the fork, then delete
  the fork duplicate in a separate cleanup commit.
- After every parent change, use the fork's `.fork-sync.json` policy from a
  clean worktree: run `make sync-parent-check`, then `make sync-parent`, review
  the staged parent-owned update, run the checks, and commit it. Never use a
  repository-wide merge to synchronize a project-type fork. Preserve the
  fork-owned content/config/assets and update the policy when a new typed seam
  is introduced.

Auth, passwordless, and dashboard copy overrides belong to `cr-auth-starter`,
not this public repository. Auth forks must use its typed partial
`frontend/i18n/messages/overrides/<locale>.ts` layer rather than editing auth
message modules directly.
