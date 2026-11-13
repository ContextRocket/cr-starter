# ContextRocket Starter

Public **Astro** starter for branded static websites that connect to ContextRocket
through embeddable chat and contact-form SDK artifacts. Builds to `dist/` for any CDN.

## Quick start

```bash
pnpm install
pnpm dev   # http://localhost:3100 (starter; forks use 3101+)
```

Demo chat mode is the default. For live chat, set in `.env`:

```bash
PUBLIC_CR_CHAT_MODE=live
PUBLIC_CR_AGENT_URL=https://api.contextrocket.com
PUBLIC_CONTEXTROCKET_HANDLE=your-handle
# Optional: choose "person" for a Personal Brand identity (defaults to company).
PUBLIC_CONTEXTROCKET_SUBJECT_KIND=company
PUBLIC_CONTEXTROCKET_API_KEY=your-publishable-api-key
```

## What you customize in a fork

- `config/site.json` -- brand, theme, nav, locales, public routes, features
- `src/i18n/messages/site/` -- site copy
- `src/pages/[locale]/index.astro` -- home / landing composition
- `content/posts/` -- Markdown blog posts
- `content/topics/` -- optional evergreen references when `features.topics` is enabled
- `public/` -- assets

Use `draft: true` in a post's Markdown frontmatter while preparing it. Drafts
appear in local development for review, but production builds omit their pages
and exclude them from the blog listing, feed, and sitemap.

Use `date: "YYYY-MM-DD"` for the displayed publication date. Add an optional
ISO `publishedAt` timestamp on that same date when several posts need a precise
order; otherwise same-day posts use a stable slug order.

Blog frontmatter also supports optional `author`, `authorAffiliation`, and
`authorDetail` strings. Use the latter two for a company or other affiliation
and a short role/byline, then render them in a fork's blog composition where
they belong. The shared content loader validates and exposes them without
forcing a particular author-card layout on every site.

Posts with four or more section headings automatically get a localized
contents panel above the article on mobile and a sticky reading rail on wider
screens. Heading fragment IDs are generated at build time while preserving
explicit IDs from authored HTML.

Evergreen topics are optional. Enable `features.topics` in `config/site.json`;
published topic pages join the sitemap and `llms.txt`, but stay out of the dated
post listing and RSS feed.
Topic frontmatter may also include up to five `chatSuggestions`. The topic page
passes those prompts to the shared chat widget, so its opening questions can
match the guide being read; omit them to keep site-level or Agent Card prompts.

`chat.launcherColor` in `config/site.json` controls the SDK launcher. It defaults
to `pink`; use `ink` or a site brand hex color to match a fork. Custom colors
select a white or Ink rocket only when it meets 3:1 contrast, otherwise the
launcher falls back to Ink.
The chat header and welcome state use the ContextRocket spark by default. Set
`chat.agentIdentity` to `probe` only for a ContextRocket product surface. A
configured `chat.agentAvatar` portrait takes precedence for a site-specific
assistant identity.

```yaml
title: Digital nomad residency
description: A guide to remote work residency options.
updated: "2026-11-12"
chatSuggestions:
  - What documents does this guide mention?
  - How can I check whether this route fits me?
```

Shared layout, i18n runtime, blog engine, discovery routes, and the built embed
widget are starter-owned. The checked-in widget keeps a standalone clone
installable without sibling repositories.

**Default surface:** home, configurable Markdown blog, and a localized
contact-form example that runs in safe demo mode by default. There are no generated
legal pages; add the pages your site needs. Cookie consent is optional and off
by default. No FAQ / About / gallery / Features pages are required.

## Build and deploy

```bash
pnpm run build
# The build runs single-locale URL flattening and emits static redirects.
# Upload dist/ to Cloudflare Pages, CloudFront, S3, …
```

## Embed widget

```bash
pnpm run build:widget
```

Refresh the chat widget, contact-form bridge, and shared site behaviors with:

```bash
pnpm run build:embeds
```

The starter's `/contact/` example runs safely in demo mode by default. To send
contact form submissions to an organization, add the exact deployed website
origins in ContextRocket under **Settings → Organization → General → Contact
form websites**, then set `PUBLIC_CR_CONTACT_FORM_MODE=live` and
`PUBLIC_CONTEXTROCKET_HANDLE`. Add each hostname visitors use, including both
the apex and `www` versions when both are active. Contact submissions resolve
the organization from its handle and do not require a chat API key.

This optional contributor command rebuilds the widget from a sibling
`../cr-sdk` checkout. The checked-in `public/embed/widget.js` is used by normal
standalone builds and does not need to be rebuilt by a fork.
Set `PUBLIC_CONTEXTROCKET_CHAT_WIDGET_URL` to a published, version-pinned CDN
URL to load a shared widget instead; by default the site uses the checked-in
local artifact. The ContextRocket CDN currently serves chat `v0.0.2` and
contact-form bridge `v0.1.1`. The checked-in chat artifact is built from the
unpublished `@contextrocket/embed-chat@0.0.1` development source. Use the CDN
URL for `v0.0.2` when loading a published artifact. SDK `0.1.2` adds typed custom-answer mapping to
the local contact-form bridge; its CDN release is pending, so keep the local
artifact when using that feature. Site behaviors default to the checked-in local
bundle and can be pinned with `PUBLIC_CONTEXTROCKET_SITE_BEHAVIORS_URL` at
version `v0.1.1`.
See
[`docs/embed-direction.md`](docs/embed-direction.md) for their URLs and the
operator release workflow. Keep the local artifacts for offline demos.

```html
<script
  src="/embed/widget.js"
  defer
  data-contextrocket-handle="your-handle"
  data-contextrocket-subject-kind="company"
  data-contextrocket-api-key="your-publishable-key"
></script>
```

## More

See [AGENTS.md](AGENTS.md), [docs/fork-evolution.md](docs/fork-evolution.md),
and [docs/site-integrations.md](docs/site-integrations.md).
