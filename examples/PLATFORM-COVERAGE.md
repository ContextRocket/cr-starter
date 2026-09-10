# Publishing / CMS platform coverage

Platform detection (`scripts/lib/detect-platform.mjs`) is stack context for Brand
Lab and sales — same idea as CMP coverage, but for **how the site is built and
hosted**, not the cookie banner.

Signals are reusable fingerprints only (generator meta, DOM roots, CDN / asset
paths, runtime globals). No brand-name exceptions.

## Why this matters

| Signal | Sales / product read |
| --- | --- |
| WordPress + Complianz/CookieYes | SMB / agency; plugin economics |
| Webflow / Framer | Design-led marketing site; agency or in-house design ops |
| Wix / Squarespace | Hosted SMB builder; lower eng spend |
| Shopify (+ optional headless front) | Commerce-first budget |
| Lovable / Bolt / v0-style | AI-generated app or MVP; often React export |
| Next.js / Nuxt + Contentful / Sanity | Eng-owned marketing; headless CMS spend |
| HubSpot CMS | Marketing cloud already in stack |

Many serious brands are **hybrids** (Framer + Shopify, Webflow + Shopify,
Next + Contentful). Packs keep `tech.platform` (primary) plus `tech.platforms`
(candidates) so hybrids stay visible.

## Market map (2026, indicative)

Sources: [W3Techs CMS overview](https://w3techs.com/technologies/overview/content_management/),
builder share roundups, B2B Webflow/Framer/Lovable comparison posts.

### Mass-market CMS / builders (share of the public web)

| Platform | Approx share (all sites) | In detector? | Notes |
| --- | --- | --- | --- |
| WordPress | ~41% | yes | Dominant; often + WooCommerce |
| Shopify | ~5% | yes | Commerce; often headless front elsewhere |
| Wix | ~4% | yes | Hosted SMB |
| Squarespace | ~2.5% | yes | Creative / boutique |
| Webflow | ~1–3% (fast growth in B2B SaaS) | yes | Design + CMS |
| Duda | ~0.7% | yes | Agency multi-site |
| Drupal / Joomla / TYPO3 | long tail | Drupal yes; others gap | Enterprise / EU |
| Tilda | ~0.8% | **no → add** | Strong RU/EU landing |
| Framer | ~0.2% web, large in design SaaS | yes | Marketing / motion |
| HubSpot CMS | small % | yes | Marketing suite |
| Ghost | small | yes | Publisher |

### Design / AI publishing tier (B2B marketing & startups)

| Platform | Role | In detector? | Reference sites (live fingerprints checked) |
| --- | --- | --- | --- |
| **Webflow** | Visual CMS, B2B marketing | yes | solarpath.ie, kleosglobal.io, groundcover.com, didomi.io, typeform.com, relume.io |
| **Framer** | Design-led marketing | yes | framer.com, **pitch.com**, **cal.com**, **legora.com**, **miro.com** |
| **Lovable** | AI full-stack / marketing MVPs | yes | grandpal.co (`lovable-uploads`), lovable.dev |
| **Wix** | Hosted SMB | yes | wix.com (`wixstatic` / `parastorage`) — need customer witness |
| **Squarespace** | Hosted creative | yes | squarespace.com — need customer witness |
| **Shopify** | Commerce | yes | allbirds.com, glossier.com, everlane.com |
| **Bubble / Softr** | No-code apps | yes | bubble.io — need customer witness |
| **Relume** | Webflow ecosystem (AI wireframes) | via Webflow | relume.io is Webflow-hosted |
| **Bolt.new / v0 / Durable** | AI builders | partial / gap | bolt.new, v0.dev (`/_next/`), durable.co — need distinct CDN paths |
| **Typedream / Super.so / Carrd** | Lightweight site builders | gap / Carrd add | typedream.com, super.so, carrd.co |
| **Unbounce** | Landing pages | **add** | unbounce.com |
| **Tilda** | Landing / brochure | **add** | tilda.cc (`tildacdn`) |

### Headless / framework (often co-detected)

| Signal | Meaning | Witnesses in our crawls / probes |
| --- | --- | --- |
| Next.js `/_next/` | Eng-owned React marketing | vercel.com, stripe.com, linear.app, notion |
| Contentful `ctfassets.net` | Headless CMS | notion.so, notion.com, pawpatrol.com |
| Sanity `cdn.sanity.io` | Headless CMS | loveandmoney.com, figma.com, sanity.io |
| Nuxt `/_nuxt/` | Vue eng stack | (resend.com showed Nuxt in probe) |
| Astro islands | Static-first | this starter |

## Portfolio coverage today

From Brand Lab crawls (`inferPlatformFromCrawl`), including 2026-09 research adds:

| Platform | Crawl witnesses |
| --- | --- |
| WordPress | adherent, complianz, cookiefirst, next-estate, sourcepoint, spainresidence, systra, trustarc, usercentrics, zartis, iubenda, consentmanager, mktoolboxsuite, theroadmap |
| Webflow | solarpath, kleos, groundcover, didomi |
| Framer | **pitch**, **cal**, **legora**, **thegenaicircle**, **limy** |
| Lovable | grandpal |
| Shopify | **allbirds**, **glossier** |
| HubSpot CMS | **axeptio** |
| Astro | **feverup** |
| Sanity | loveandmoney |
| Contentful | notion |
| Next.js | vercel, **holded**, **ketch**, **forbes** |

**Still thin / missing customer witnesses:** Wix, Squarespace, Duda, Bubble, Ghost, Drupal, Tilda, Carrd, Unbounce.

## Fingerprints (encode / keep general)

| Platform | Strong signals |
| --- | --- |
| Webflow | `data-wf-site`, `cdn.prod.website-files.com`, `meta generator=Webflow`, `window.Webflow` |
| Framer | `framerusercontent.com`, `[data-framer-page]` |
| Lovable | `lovable-uploads`, `lovable.dev` / `lovableusercontent` |
| Wix | `static.wixstatic.com`, `parastorage.com`, `#SITE_CONTAINER` |
| Squarespace | `squarespace-cdn`, `sqsp.net` |
| Shopify | `cdn.shopify.com`, `myshopify.com` |
| WordPress | `/wp-content/`, `/wp-includes/` |
| Tilda | `tildacdn.com`, `tilda.ws` |
| Carrd | `carrd.co` asset host / generator |
| Unbounce | `unbouncepages.com`, `ubembed.com` |
| Bubble | `cdn.bubble.io` |
| HubSpot | `js.hs-scripts.com`, `hs-sites.com` |
| Contentful / Sanity | `ctfassets.net`, `cdn.sanity.io` |
| Next.js | `/_next/` |

Caveat: marketing copy that *names* a competitor (vendor pages, comparison blogs)
can false-hit broad string patterns. Prefer CDN hosts + DOM roots over bare brand
words in HTML.

## Recommended platform fixtures (priority)

Added to `examples/portfolio-sites.json` (2026-09):

| Role | Sites |
| --- | --- |
| `platform-fixture` | pitch.com, cal.com, legora.com (Framer); allbirds.com, glossier.com (Shopify) |
| `cmp-fixture` (new) | ketch.com, forbes.com, iubenda.com, axeptio.eu, consentmanager.net |
| `research` | feverup.com, holded.com, thegenaicircle.com, limy.ai, mktoolboxsuite.com, theroadmap.co |

Still useful later:

1. Wix / Squarespace — clean *customer* sites (vendor pages are noisy)
2. Tilda / Carrd / Unbounce published customer pages
3. Bubble public app / agency showcase
4. More Lovable customers beyond grandpal; Bolt/Durable once CDN paths stabilize

```bash
pnpm brand:portfolio:platform
pnpm brand:portfolio:research
pnpm brand:portfolio -- --id pitch,cal,feverup
```

## Commands

```bash
# Infer platforms from existing crawls
node -e 'import("./scripts/lib/detect-platform.mjs").then(...)'

# Re-pack after fingerprint changes
node scripts/pack-from-crawl.mjs scratchpad/brand-crawls/<host> --id <id>
pnpm brand:lab
```

## Still worth researching

- GoDaddy / Hostinger / Jimdo builders (high volume SMB, weak B2B sales signal)
- Magento / Adobe Commerce vs Shopify for mid-market retail
- Distinct **Bolt.new / Durable / v0** asset hosts (today often look like Next.js)
- Editor X (Wix studio) vs classic Wix DOM
- Webstudio, Base44, and other AI builders as fingerprints stabilize
