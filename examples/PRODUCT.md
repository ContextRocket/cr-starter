# Product direction (ContextRocket)

Lab for a later ContextRocket feature: crawl a **brand** site → style pack →
simple nav+hero landing that matches their look.

## What we optimize for

The useful question is not “does this look like Kleos?” — it is:

> What is the **most we can capture** so a generated light landing is
> compelling and *plausible* for this brand?

Read [`CAPTURE.md`](./CAPTURE.md) for the observe → rank → assign contract.
Do not add named brand exceptions to the scripts; improve general signals.

| In (style) | Out (not this lab) |
| --- | --- |
| Brand name in nav | Marketing headlines / CTAs |
| Logo portfolio + favicon | Personal photo layout systems |
| Observed palette + provenance | Invented stock blues |
| Font family (when we can load it) | Multi-section recreations |

Hero text is always the same boilerplate (`examples/landing-boilerplate.mjs`).
Real content is owned by ContextRocket.

## Loop

1. Observe → `crawl.json` + assets (maximum useful signal)  
2. Rank / assign → `brand-pack.json` (roles + evidence)  
3. Brand Lab preview  
4. Expand sections later once style recognition is good  

## Commands

```bash
pnpm brand:crawl -- https://example.com
pnpm brand:pack -- scratchpad/brand-crawls/<host> --id mybrand
pnpm brand:portfolio:routine
pnpm brand:lab:serve   # http://127.0.0.1:3199/
```
