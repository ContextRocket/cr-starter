# Brand capture principles

Goal: from any marketing homepage, produce the **most compelling light
nav+hero landing** we can justify from evidence — not from invented defaults
or portfolio-specific patches.

## Layers (keep them separate)

| Layer | Job | Must not |
| --- | --- | --- |
| **Observe** (`crawl-brand.mjs`) | Record everything useful about the live page | Assign `primary` / pick “the” logo; hardcode vendor names |
| **Rank** (`derive-colors.mjs`, pack scoring) | Score candidates for a *light nav+hero* use case | Invent hex values; special-case known brands |
| **Assign** (`pack-from-crawl.mjs`) | Write role tokens + keep the evidence trail | Hide rejected candidates; silent blue/grey defaults |

The pack always keeps **`colors.observed`**, **`colors.provenance`**, and
**`assets.candidates`** so a human (or later LLM) can see what was measured
versus what was chosen.

## What we try to capture (maximum useful signal)

1. **Identity** — title, `og:site_name`, final URL  
2. **Surfaces** — body background + ink, h1 color, `theme-color`  
3. **Chrome marks** — header/nav images + inline SVGs, favicon, apple-touch, og:image  
4. **Filled controls** — opaque button/link fills with geometry + text (CTA pool)  
5. **Link accents** — frequent non-ink link colors (skip UA default blue)  
6. **Type** — body + heading font stacks  
7. **Screenshots** — viewport (+ full page when cheap) for human review  

Universal noise only (not brand lists): transparent/1×1 trackers, `data:` URIs,
elements inside consent chrome. Consent dismissal itself is a **separate**
portable module — see [`CONSENT-CHROME.md`](./CONSENT-CHROME.md) (CMP vendor
selectors are appropriate there; they are not brand exceptions).

## Ranking for a light nav+hero

### Palette
1. Prefer a **light page surface** when the body is already light.  
2. If the body is dark, keep white as an *explicit assumed canvas* and promote
   the dark surface color to brand ink/primary (documented in provenance).  
3. **Primary** = best filled control color in/near the first screen, else ink.  
4. **Accent** = a second *distinct* observed hue (CTA / theme / link), else
   mirror primary — never invent a stock blue.  
5. Every assigned role cites its source.

### Logo / mark portfolio
1. Prefer marks discovered in **header/nav** (or logo/brand-labeled controls).  
2. Prefer **wordmark geometry** (wider than tall, nav-scale height) over large
   photographs.  
3. Prefer SVG/PNG marks over hero JPEGs; reject tiny UI SVGs (phone, dots, ≤48px).  
4. Prefer marks whose **alt/aria/class** share tokens with the site host or short
   title (boost, not a partner blocklist). Do **not** treat CDN host paths as a
   brand hit (`assets.example.com/.../google-play.svg` is not the brand mark).  
5. Hard-reject **store install badges** and **certification seals** from alt/src
   patterns (App Store / Google Play / B Corp / “powered by”, multilingual).  
6. Analyze each mark: light/dark fit, plate, and a **logo chromatic palette**
   (brand hues often live only in the mark — e.g. yellow→orange gradients).  
   For SVGs, run structured deconstruction (`scripts/lib/inspect-svg.mjs`):
   role guess, `<text>`, gradients, fills; optional `--svg-llm` / CLI `--llm`
   for a Gemini reading of complex path wordmarks.  
7. When ranking is ambiguous (footer winner, close scores, favicon-as-logo),
   optional Gemini **mark disambiguation** (`--mark-llm` or with `--svg-llm`)
   reorders observed candidates only — never invents colors or assets.  
8. When the captured mark is light-ink on transparency, **adapt** it for the
   light canvas (`logo-light.*`): remap near-white ink to foreground while
   keeping chromatic hues. Source mark stays in `assets.logo` for evidence.  
9. When chromatic vs light-ink mass is *spatially separated* (general lockup
   geometry — symbol left/wordmark right, etc.), optionally emit
   `logo-symbol` + `logo-wordmark(-light)` crops (`scripts/decompose-logo.py`).
   No brand-name exceptions.  
10. Prefer adapted / wordmark-light assets on light landings and PDFs; only
    fall back to a dark navbar plate when adaptation cannot fit light.  
11. Capture **stack signals**: CMP vendor and CMS / platform fingerprints
    (`scripts/lib/detect-platform.mjs`). Prefer generator meta, DOM roots,
    runtime globals, and asset-path / CDN patterns (incl. `og:image`) — never
    brand-name exceptions. Examples of reusable fingerprints: Webflow
    (`data-wf-site`, `website-files.com`), Lovable (`lovable-uploads`),
    WordPress (`/wp-content/`), Framer, Shopify, Squarespace, Wix, plus
    headless/asset CDNs (Contentful, Sanity) and frameworks (Next.js, Nuxt).
    Fixture lists: `examples/CMP-COVERAGE.md`, `examples/PLATFORM-COVERAGE.md`.

### Controls (CTAs)
1. Rank by: above-the-fold / header proximity, fill saturation, readable size.  
2. Deprioritize consent-chrome ancestors and consent/cookie copy (generic
   GDPR pattern — not a Cookiebot SDK list).  
3. Soft-prefer short labels (real buttons are usually short); do **not**
   maintain an English marketing verb lexicon.

## Anti-goals

- Portfolio-specific URL/host blocklists (Claude, CookieYes, …)  
- Invented accent blues that look “extracted”  
- Overfitting geometry thresholds to one site’s hero  
- Optimizing copy — boilerplate stays shared; style recognition is the product  

When a site still looks wrong in Brand Lab, add a **general** signal or
ranking weight, then re-run the portfolio — do not add a named exception.

## Learnings folded into general rules

| Failure mode | General rule (not a brand exception) |
| --- | --- |
| Cookie “Accept” stolen as CTA | Soft-dismiss consent overlays; downrank consent chrome / copy |
| Partner grid `alt="Logo 0"` | Score by zone + brand-token + wordmark geometry; keep portfolio small |
| Store badges as “logo” (Play / App Store) | Hard-reject multilingual store/cert alt+path patterns; brandHit from labels only |
| CDN host mistaken for brandHit | Match host/title tokens in alt/aria/class — never the asset URL host |
| Dark site remapped silently | White canvas is **assumed** and written into provenance |
| Invented accent blue | Never invent hues; missing accent mirrors primary or stays blank |
| Ambiguous mark ranking | Optional Gemini mark disambiguation among observed candidates |
| Mega-menu feature art as logo | Hard-reject feature-nav path/class tokens (`allFeaturesNav`, `mega-menu`, `feature-icon`, …); soft-penalize tall unlabeled header cards; prefer wordmark-class SVGs; scan decoded `?url=` image-proxy paths |
| SVG wordmark marked ui-icon | Size from root `<svg>` / viewBox only — ignore nested `<mask width>`; `wordmark` class clears tiny |
