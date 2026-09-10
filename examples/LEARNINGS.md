# Crawl → LLM → landing: learnings (2026-09-06)

Blind Playwright crawls of `kleosglobal.io` and `markmacmahon.com`, then
Gemini (`gemini-2.5-flash` via `GEMINI_API_KEY`) synthesis into brand packs.

## What worked without human help

| Signal | Kleos | Mark MacMahon |
| --- | --- | --- |
| Title / meta description | Strong | Strong |
| H1 | Exact live headline | Name-as-H1 (correct) |
| Logo download | Yes (Webflow CDN) | None (expected) |
| Profile / OG image | Marketing screenshot | Real headshot |
| Font family name | Lato | Avenir Next |
| Light surface color | N/A (site is dark) | `#f7f6f3` exact |
| Brand mode classification | `corporate-logo` | `personal-name` |

## Where the LLM / crawl needed correction

1. **Dark-site color inversion** — Kleos body bg is navy; Gemini put yellow
   button fill in `primary` and a mid blue in `accent`. For light landings we
   need navy → `primary`/`foreground`, yellow → `accent`. Fixed with a
   luminance heuristic in `synthesize-brand-pack.mjs` (and hand-corrected pack).
2. **CTA selection** — First button on Kleos is “Listen to the podcast”, not
   the commercial CTA. Product should rank mailto / “work with” / contact over
   content CTAs, or ask the user.
3. **Personal brand assets** — No logo candidates; apple-touch is a poor
   “logo”. Prefer `og:image` / largest face photo as `assets.profile`.
4. **Fonts** — Crawl returns family names; shipping the actual files is still
   manual. v0 keeps Geist so palette + logo/photo carry recognition.
5. **Layout personality** — A single light hero cannot reproduce Kleos’s stacked
   H2 narrative or Mark’s playlist composition. Pack `layoutHints` records what
   must stay; full parity needs fork-owned composition later.

## Recommended automated structure (product-facing)

```
crawl(url) → crawl.json + assets/
  → synthesize(crawl) → brand-pack.json   # Gemini + heuristics
  → apply(pack) → site.json + brand-landing.json + public assets
  → render LightBrandHome (corporate-logo | personal-name)
```

Keep the **brand pack** as the portable contract between ContextRocket crawl
and any generator (starter today; product packaging later).

## Commands used

```bash
node scripts/crawl-brand.mjs https://www.kleosglobal.io
node scripts/crawl-brand.mjs https://markmacmahon.com
node scripts/synthesize-brand-pack.mjs scratchpad/brand-crawls/kleosglobal-io --id kleos
node scripts/synthesize-brand-pack.mjs scratchpad/brand-crawls/markmacmahon-com --id markmacmahon
node scripts/apply-brand-pack.mjs examples/kleos/brand-pack.json
node scripts/apply-brand-pack.mjs examples/markmacmahon/brand-pack.json
```

Raw crawls and screenshots live under `scratchpad/brand-crawls/` (gitignored).
Curated packs live under `examples/{kleos,markmacmahon}/`.

## Portfolio sync (2026-09-06)

Source of truth: `examples/portfolio-sites.json` (18 sites from
`context-rocket` `PROBE_GATE_SITES`). Sync with `pnpm brand:portfolio`.

Operational notes:

1. **`networkidle` is unreliable** — marketing sites never idle (analytics,
   websockets). Crawl uses `load` then `domcontentloaded` fallback.
2. **Kleos apex SSL** — `kleosglobal.io` fails TLS SNI; use
   `https://www.kleosglobal.io` in the portfolio manifest.
3. **Display names** — Prefer short `og:site_name`; reject long SEO titles
   (e.g. Solar Path) and fall back to pack id title-case.
4. **Lab ordering** — Portfolio packs first (fixture order), experiments
   (Stripe/Linear/…) listed separately.

## Extraction fidelity (2026-09-06)

1. **No invented brand blues** — removed the `#2563eb` accent default.
   Missing roles stay null / reuse an observed role; packs now store
   `colors.provenance` + `colors.observed` so the lab can show what was
   actually extracted.
2. **Cookie CTAs** — Solar Path’s first filled button was CookieYes “Accept
   All” (blue). Crawl now strips consent chrome and ranks real CTAs
   (“Get a quote” → `#eb433d`).
3. **Partner / integration logos** — ContextRocket’s Claude/ChatGPT marks
   matched `alt*=logo`. Filter partner path/name noise, require brand-name
   hits for keyword logos, and keep the pack portfolio to
   header wordmark + favicon/apple-touch.
4. **Store install badges** — Doctolib footer App Store / Google Play SVGs
   outranked the real wordmark because (a) footer imgs were labeled
   `header-logo`, (b) CDN host `assets.doctolib.fr` counted as `brandHit`,
   and (c) Play’s chromatic fills fit a light canvas. General fix:
   hard-reject store/cert patterns (`scripts/lib/mark-noise.mjs`), label-only
   brand tokens, footer discovery role, plus optional Gemini
   `--mark-llm` / `--svg-llm` disambiguation among observed candidates.
5. **CMS / builder platforms** — Solar Path is Webflow (`cdn.prod.website-files.com`
   + `data-wf-site`); Grandpal is Lovable (`lovable-uploads` in og:image).
   Older detector only matched legacy `assets.website-files` and had no
   Lovable fingerprint; pack inference also skipped `og:image`. Expanded
   `detect-platform.mjs` + crawl asset bag (meta images, runtime globals).
   Portfolio re-pack now surfaces Webflow / Lovable / WordPress / Next.js /
   Contentful / Sanity where asset paths evidence them.
