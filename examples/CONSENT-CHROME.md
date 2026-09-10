# Consent chrome (portable)

Clean screenshots and text extraction require removing CMP / cookie-consent
overlays before capture. This is **infrastructure knowledge** (OneTrust,
Cookiebot, CookieYes, Usercentrics, …), not brand-specific overfitting.

## Where it lives

| Artifact | Role |
| --- | --- |
| `scripts/lib/consent-chrome.mjs` | Playwright dismiss + hide + text strip |
| Brand crawl | Calls `dismissConsentChrome(page)` before observe/screenshot |
| `cr-frontend` `CookieBannerDetector` | Original Python implementation this ports |
| `context-rocket` screenshot capture | **Should** call the same algorithm before `page.screenshot()` |
| `context-rocket` `cleaning.py` / `chunk_drop.py` | Text second-pass for vector store |

## Algorithm (observe → act → hide)

1. **Fingerprint** HTML + runtime APIs (`UC_UI`, `OneTrust`, `Cookiebot`, …).
2. **CMP JavaScript APIs** when available (deny / necessary-only first).
3. **Click** framework strategies: prefer **reject / necessary-only**, then accept.
4. **Usercentrics two-step**: many EU sites use `dialog.cmp-container` where
   "Ablehnen oder Einstellungen" (`#ucButtonSecondLayer`) opens preferences;
   the real deny is `#ucButtonSaveServices`. Treat compound reject+settings
   labels as a **settings** intent, not a final dismiss.
5. **Fallback** generic cookie/consent containers + multilingual button phrases
   (en / de / es / fr / pt).
6. **Accept API fallback** for Usercentrics if reject path stalls (clean
   screenshot beats a stuck modal).
7. **Hide** remaining fixed/sticky consent layers + `dialog.cmp-container` +
   dim overlays so screenshots and DOM sampling stay clean.
8. **Text hygiene** — `stripConsentTextBlocks()` drops consent boilerplate from
   plain/markdown blocks (vector-store / sample safety net).

Retries (default 3) cover late-injected CMP scripts.

## Why vendor selectors are OK here

Brand palette/logo ranking must stay general. Consent chrome is the opposite:
a small set of third-party CMP platforms power most of the web. Encoding their
selectors and public APIs is the same idea as knowing `favicon.ico` exists —
domain knowledge, not overfitting to zartis/kleos.

## Porting to ContextRocket

`context-rocket` `backend/app/modules/crawl/screenshot/capture.py` currently
navigates and screenshots with **no** consent step. Recommended:

1. Port `dismissConsentChrome` semantics into a small Python helper (or share
   patterns with `CookieBannerDetector` from cr-frontend).
2. Call it in `_run_browser_pass` **before** `page.screenshot()` and appearance
   sampling.
3. Keep `strip_cookie_boilerplate_paragraphs` / chunk drop as the text net.
4. Mirror the Usercentrics two-step + `UC_UI` accept/deny fallbacks.

Brand Lab is the fast place to regression-test the JS module against the
portfolio (`pnpm brand:crawl -- https://www.billiger-mietwagen.de` should log
Usercentrics closed).

CMP product coverage (which live sites exercise which vendor) lives in
[`examples/CMP-COVERAGE.md`](CMP-COVERAGE.md). Probe with:

```bash
pnpm brand:cmp:probe
pnpm brand:portfolio:cmp   # crawl+pack cmp-fixture sites only
```

## Still porting from cr-frontend

Worth carrying over next if crawl markdown quality matters:

1. `indexpage_extraction_hook` DOM **remove** of leftover overlays (we hide; they remove).
2. `markdown_generator._filter_cookie_banners` content-based HTML strip.
3. PatternLibrary locales beyond en/de/es/fr/pt when we add more markets.

## API

```js
import {
  dismissConsentChrome,
  stripConsentTextBlocks,
  classifyConsentButton,
} from "./lib/consent-chrome.mjs";

const result = await dismissConsentChrome(page, { waitMs: 1800, retries: 3 });
// { detected, closed, hidden, framework, strategy, action, clickedText, notes }
// classifyConsentButton(text) → "reject" | "accept" | "settings" | null
```
