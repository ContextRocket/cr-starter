# Front-end architecture (static starter)

Status: foundation for `cr-starter` (Astro + Tailwind static export).
Companion testing rules: [`../docs/testing-doctrine.md`](../docs/testing-doctrine.md).
Product-app rules (Query / Zustand / nuqs / XState) live in `cr-landing` and
are adopted by `cr-auth-starter` as authenticated surfaces grow — they are
**not** installed here.

## 0. Product shape

This starter ships a branded static website. There is no local backend, auth,
or dashboard. Chat is the embed widget. Completeness means: config + content +
observable chrome behavior, covered by behavior contracts where a wrong outcome
is expensive (legal identity, locale routing, public discovery, widget launch).

## 1. State kinds that apply here

Classify first. Mixing kinds is the usual source of coupling.

| Kind | What it is | Owner here |
| --- | --- | --- |
| Config / content | site identity, theme, posts, legal fields | `config/site.json`, Markdown, site messages |
| URL | locale segment, public path | Astro routes + `lib/paths.ts` |
| Browser preference | theme, cookie consent | localStorage / cookies via chrome islands |
| Local UI | open menus, lightbox index, form field | `useState` in a React island |

Decision rule: if it must survive reload and be shareable → URL. If several
components need it with no server → small shared module or storage helper. If
one component owns it → local state. Do **not** introduce TanStack Query,
Zustand, or XState for marketing chrome.

## 2. Ownership seams

1. **Config seam** — forks edit `site.json`, `blog.config.mjs`, `site/` messages,
   Markdown, and `public/` assets.
2. **Chrome seam** — shared Astro/React chrome under `src/components/`; forks do
   not fork transport or legal page machinery.
3. **Content seam** — Markdown posts and legal identity values; pages render them
   without inventing copy in components.
4. **Widget / SDK seam** — public `cr-sdk` (`@contextrocket/sdk`,
   `@contextrocket/embed-chat`). Do not grow a second A2A client in this app.

## 3. Feature folders and behavior contracts

Meaningful surfaces get an owner-readable contract:

```text
features/<name>/BEHAVIOR.md
```

Stable IDs (`BLOG-001`, `LEGAL-002`, …), Given / When / Then, and explicit
`Never:` lines. Tests live under `__tests__/features/<name>/` and reference the
ID. Change the contract before weakening an expectation in code.

## 4. Ports and purity

Prefer pure functions for decisions (`legal-completeness`, path builders, public
site builders). Effectful boundaries (filesystem Markdown load, theme storage)
stay thin adapters. Unit tests inject fakes or call pure helpers; they never hit
the network.

## 5. What we deliberately do not copy from cr-landing

- TanStack Query / Zustand / nuqs / XState stack (product-app state)
- FastAPI contract doubles and ScenarioRuntime
- Dashboard / probe / capability gating features

When a fork needs auth + dashboard, use `cr-auth-starter` and follow that repo’s
ARCHITECTURE, which tracks the landing foundation.
