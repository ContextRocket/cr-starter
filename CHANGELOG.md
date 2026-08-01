# Changelog

All notable changes to cr-starter are documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-08-01

### Added

- `site.config.ts` at the frontend root: single typed source of identity
  (companyName, legalName, tagline, description, siteUrl, contactEmail,
  locale, asset paths, social links, and full legal/Impressum fields).
  Every SEO and AEO signal in the repo reads from this object -- no
  hardcoded company identity anywhere else.
- Next.js Metadata API wired from `site.config`: title template, description,
  OG/Twitter cards, canonical URL, and robots meta in `app/layout.tsx`.
- `app/manifest.ts`: web app manifest route reading from `site.config`.
- `app/robots.ts`: tiered robots policy classifying AI crawlers (GPTBot,
  ClaudeBot, PerplexityBot, etc.), search crawlers, and social crawlers.
  AI crawlers receive an explicit Allow list including `/llms.txt` -- a
  high-value AEO signal ContextRocket's taxonomy reads.
- `app/sitemap.ts`: canonical sitemap listing public pages with priorities
  and change frequencies.
- `app/llms.txt/route.ts` and `app/llms-full.txt/route.ts`: AI-readable
  site context generated from `site.config` following the llmstxt.org
  convention.
- `lib/structured-data.ts`: JSON-LD builders for Organization and WebSite
  entities. Organization JSON-LD with `sameAs` and `contactPoint` is the
  primary signal ContextRocket's taxonomy reads to assess AI-readiness.
- `components/seo/structured-data-scripts.tsx`: Server Component that injects
  JSON-LD script tags; used on the home page.
- `app/page.tsx`: updated with semantic structure (single h1 from
  `site.config.tagline`, main landmark, footer with legal links),
  Organization + WebSite JSON-LD, and a footer linking to Impressum and
  Privacy pages.
- `app/impressum/page.tsx`: Impressum page rendered from `site.config.legal`
  with a developer-visible placeholder warning. Impressum is legally required
  for DE/EU commercial sites.
- `app/privacy/page.tsx`: Privacy policy placeholder page with contact info
  from `site.config.legal`.
- Favicon and icon set copied from ContextRocket into `public/`: favicon.ico,
  favicon-16x16.png, favicon-32x32.png, apple-icon-180x180.png, icon-192.png,
  icon-512.png, icon-192-maskable.png, icon-512-maskable.png. README notes to
  replace these with your own brand assets.
- `CONTRIBUTING.md`: dev setup (Path A/B), Beads workflow, PR expectations,
  and what belongs upstream vs. in forks.
- `SECURITY.md`: responsible disclosure via GitHub Security Advisories.
- `.github/ISSUE_TEMPLATE/bug_report.yml` and `feature_request.yml`: YAML
  issue forms with scope guardrails.
- `.github/PULL_REQUEST_TEMPLATE.md`: updated checklist aligned with
  `AGENTS.md` hard rules.
- `.editorconfig`: consistent indent, line ending, and whitespace settings.
- `.nvmrc`: pins Node 22.
- `i18n/keys.ts`: new keys for footer (FOOTER_IMPRESSUM, FOOTER_PRIVACY),
  Impressum page fields, and Privacy page fields.

### Changed

- `app/layout.tsx`: metadata now reads from `site.config`; html lang uses
  `site.config.locale`.
- `README.md`: added "Replace-me checklist" section with the first-30-minutes
  fork steps.

