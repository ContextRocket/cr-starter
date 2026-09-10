# CMP coverage matrix

Consent chrome (`scripts/lib/consent-chrome.mjs`) is infrastructure knowledge —
the same idea as `cr-frontend` `CookieBannerDetector` + PatternLibrary, made
portable for Brand Lab / crawl / screenshot capture.

## Lineage (what we ported)

| Source | What matters |
| --- | --- |
| `cr-frontend/.../cookie_banner_detector.py` | Framework strategies, reject-then-accept, TrustArc iframe note |
| `cr-frontend/.../pattern_library.py` `COOKIE_BANNER_PATTERNS` | Multilingual button phrases (en/de/es/fr/pt) |
| `cr-frontend/.../indexpage_extraction_hook.py` | Dismiss **before** observe; remove leftover overlay nodes |
| `cr-frontend/.../markdown_generator.py` | Second-pass text/HTML strip after dismiss |
| `context-rocket/.../chunk_drop.py` | Provider fingerprints for vector-store hygiene |
| `cr-frontend` archived `debug_solarpath_cookie.py` | Live CookieYes regression (solarpath.ie) |
| DuckDuckGo autoconsent rules | Selector / API hints for Ketch, iubenda, Axeptio, Termly, … |

Unit tests in cr-frontend use **mock HTML**, not live vendors. Live coverage
here is the missing gate.

## Portfolio coverage

| CMP | Strategy status | Live witness(es) | Notes |
| --- | --- | --- | --- |
| CookieYes | strong | solarpath.ie, systra.com | Original cr-frontend debug target |
| Cookiebot | strong | next-estate.de, groundcover.com, adherent.com | Two DOM variants in detector |
| Usercentrics | strong | usercentrics.com, billiger-mietwagen.de, zalando.de (probe) | Prefer `UC_UI` API over HTML false-positives |
| Klaro | ok | wearemucho.com | Often off-canvas; hide path helps |
| Didomi | strong | didomi.io, doctolib.fr | Prefer `Didomi` JS API |
| OneTrust | strong | onetrust.com, otto.de | Prefer `OneTrust.RejectAll` API |
| Osano | strong | osano.com | Native `osano-cm-denyAll` |
| TrustArc | ok | trustarc.com | May use cross-origin iframe |
| CookieFirst | strong | cookiefirst.com | `dialog.cookiefirst-root` + Deny (text classify) |
| Complianz | ok | complianz.io | WordPress CMP |
| Sourcepoint | experimental | sourcepoint.com | Buttons in `sp_message_iframe_*` (iframe pierce) |
| **Ketch** | strong | ketch.com, **forbes.com**, **chipotle.com** | `global.ketchcdn.com`, `#ketch-banner`, `window.ketch` |
| **iubenda** | ok | iubenda.com | `cs.iubenda.com`, `#iubenda-cs-banner` (banner may be geo-gated) |
| **Axeptio** | ok | axeptio.eu | `.axeptio_widget` / `#axeptio_overlay` (detect; dismiss TBD on vendor page) |
| **Consentmanager** | strong | consentmanager.net | `__npcmp('reject')` / `#ncmp__tool` / `#cmpbox` |
| **Termly** | strong | termly.io | `#termly-code-snippet-support`, `[data-tid=banner-decline]` |
| **Cookie Information** | strong | cookieinformation.com | `CookieInformation.declineAllCategories` |
| **Transcend** | ok | transcend.io | `#transcend-consent-manager` / airgap (regime-gated UI) |
| **Borlabs** | strong | borlabs.io | `#BorlabsCookieBox`, essential-only button |
| HubSpot cookie | ok | (selectors ready) | `#hs-eu-cookie-confirmation` |
| Civic Cookie Control | ok | (selectors ready) | `#ccc-module` — need UK public witness |
| Quantcast | partial | (probe only) | Text-classify fallback |
| Tarteaucitron | partial | (vendor site often bannerless) | Need FR public witness |

**Caveat:** a CMP *vendor homepage* may run a different banner than its product
(marketing sites name competitors). Prefer CDN/DOM fingerprints over bare brand
words. Customer sites (Forbes / Chipotle for Ketch) are the stronger sales signal.

## Roles

- `routine` / `stress` — brand + style portfolio (ContextRocket probe gate)
- `cmp-fixture` — chosen for **CMP product coverage**, still packable as style packs
- `platform-fixture` / `research` — publishing-stack witnesses (see PLATFORM-COVERAGE.md)

## Commands

```bash
# Re-pack only CMP fixtures
pnpm brand:portfolio:cmp

# Probe every portfolio URL for CMP fingerprint + dismiss result
node scripts/probe-cmp-coverage.mjs

# Full brand sync including fixtures
pnpm brand:portfolio
```

## Still worth adding later

- A stable **Tarteaucitron** public FR site (government / commune)
- A pure **Quantcast Choice / InMobi CMP** publisher
- Civic Cookie Control UK public-sector customer
- Enzuzo / Securiti if they appear in customer crawls
- Improve Axeptio / Transcend / iubenda **dismiss** when banner is delayed or geo-gated

## Market leaders vs our coverage (2026-09)

Sources: Enzuzo / Consently / Ketch / Reflectiz roundups; Didomi↔Sourcepoint notes.

| Vendor | Segment | In detector? | Live witnesses |
| --- | --- | --- | --- |
| OneTrust | Enterprise suite | yes | onetrust.com, otto.de |
| Cookiebot (Usercentrics) | EU mid-market | yes | next-estate.de, groundcover.com |
| Usercentrics | EU / Google stack | yes | usercentrics.com, billiger-mietwagen.de |
| Didomi / Sourcepoint | Multi-brand / adtech | yes | didomi.io, doctolib.fr, sourcepoint.com |
| TrustArc | Enterprise governance | yes | trustarc.com |
| Osano | Mid-market suite | yes | osano.com |
| CookieYes | SMB / WP | yes | solarpath.ie, systra.com |
| **Ketch** | Enterprise / eng | **yes** | ketch.com, forbes.com, chipotle.com |
| **iubenda** | EU legal+CMP | **yes** | iubenda.com |
| **Axeptio** | FR mid-market | **yes** | axeptio.eu |
| **Consentmanager** | DE / adtech TCF | **yes** | consentmanager.net |
| **Termly** | SMB legal+CMP | **yes** | termly.io |
| **Cookie Information** | Nordics | **yes** | cookieinformation.com |
| **Transcend** | Dev-led / airgap | **yes** | transcend.io |
| **Borlabs** | DE WordPress | **yes** | borlabs.io |
| Civic / Enzuzo / InMobi | long tail | partial / selectors | need cleaner customer witnesses |

### Sales / context note

CMP detection is crawl hygiene **and** a budget/stack signal (OneTrust vs
CookieYes vs Ketch). Prefer customer sites over vendor homepages when the
vendor page also mentions competitors in marketing copy.
