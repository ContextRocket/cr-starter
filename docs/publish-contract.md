# Publish contract -- static landing pages

Learnings from the Astro `cr-starter` for ContextRocket (and any CDN host).

## Goal

Fast path from brand inputs to a static site on Cloudflare Pages, CloudFront,
S3, or any static host -- without forking a full Next app shell.

## Inputs (fork / client)

| Input | Example |
| --- | --- |
| Brand + theme | `config/site.json` |
| Copy | `src/i18n/messages/site/en.ts` (+ other locales if needed) |
| Home composition | `src/pages/[locale]/index.astro` |
| Posts | `content/posts/*.md` |
| Assets | `public/` |
| Chat | Embed snippet + handle + publishable API key |

## Outputs

- `dist/` -- static HTML/CSS/JS
- Optional `public/embed/widget.js` (or CDN URL for the same artifact)
- Hygiene files: sitemap, robots, llms.txt, feed.xml, security.txt

## Non-goals for this contract

- Auth, dashboard, server-rendered app shell
- FAQ / About / Features as mandatory pages
- Coupling ContextRocket product code to this repository

## Timing target

Wall clock to measure when porting a brand (Kleos / Mark MacMahon class):

1. Clone starter
2. Replace site.json, site messages, assets, home, posts
3. `pnpm install && pnpm build`
4. Deploy `dist/`

Observed on local ports of the golden pair (2026-09, warm `node_modules`):

| Site | `pnpm build` (approx) | Notes |
| --- | --- | --- |
| `cr-starter` | ~3s Astro + verify smoke | Multi-locale (`en`/`es`/`de`) |
| `cr-kleos` | ~3s | Single-locale; blog path alias |
| `cr-markmacmahon` | ~3.5s | Single-locale; `/posts` alias + flatten |

Cold `pnpm install` + first build is dominated by dependency install, not Astro.
Capture that full duration as the baseline for a future ContextRocket
"publish landing page" flow that emits the same artifact shape.
