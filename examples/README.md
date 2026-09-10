# Brand landing experiments (`examples/`)

**Style only:** name, logo, colors, font.  
**Copy:** shared boilerplate in `landing-boilerplate.mjs` (identical on every brand).  
Real content stays in ContextRocket.

See [`PRODUCT.md`](./PRODUCT.md), [`CAPTURE.md`](./CAPTURE.md),
[`CONSENT-CHROME.md`](./CONSENT-CHROME.md), [`CMP-COVERAGE.md`](./CMP-COVERAGE.md),
and [`PLATFORM-COVERAGE.md`](./PLATFORM-COVERAGE.md) (CMS / builders + fixtures).
Gallery: `pnpm brand:lab:serve` → http://127.0.0.1:3199/

## SVG inspection

```bash
node scripts/lib/inspect-svg.mjs path/to/logo.svg
node scripts/lib/inspect-svg.mjs path/to/logo.svg --llm   # optional Gemini
pnpm brand:pack -- scratchpad/brand-crawls/<host> --id mybrand --svg-llm
# --svg-llm also enables mark disambiguation when ranking is ambiguous;
# force with --mark-llm (needs GEMINI_API_KEY)
```

## Pipeline

```
Playwright observe → crawl.json + assets
  → rank/assign (derive-colors + pack-from-crawl)
  → examples/<brand>/brand-pack.json
  → pnpm brand:lab → examples/lab/dist/index.html
```

Roles always cite provenance. Missing signals stay blank — we do not invent
brand hues.

## Kleos note (logo plates)

The live header logo is a **yellow mark on transparent** (`fitsLightBackground:
true`). The apple-touch / favicon is the same mark on a **navy plate**
(`#082444`, `fitsLightBackground: false`). Brand Lab prefers the transparent
logo for light landings and still lists the plate variant under assets for
later post-processing.


| Field | Why |
| --- | --- |
| `identity.name` | Nav label |
| `colors.*` | Theme tokens |
| `typography.fontFamily` | Type (Google Fonts when available) |
| `assets.logo` / `favicon` | Nav mark |

## ContextRocket portfolio (source of truth)

Brand Lab’s primary set is the ContextRocket probe-gate portfolio:

- Manifest: `examples/portfolio-sites.json` (mirrors
  `context-rocket/backend/tests/fixtures/probe_gate_sites.py`)
- Sync crawl + pack + lab rebuild:

```bash
pnpm brand:portfolio:routine   # small/medium only (recommended first)
pnpm brand:portfolio           # includes stress hosts (posthog, systra, …)
pnpm brand:portfolio -- --id zartis,grandpal
pnpm brand:lab:serve
```

Experimental non-portfolio packs (e.g. Stripe) may remain under `examples/`
for comparison; portfolio sync is what we treat as the product test set.
