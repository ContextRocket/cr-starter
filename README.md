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
PUBLIC_CONTEXTROCKET_API_KEY=your-publishable-api-key
```

## What you customize in a fork

- `config/site.json` -- brand, theme, nav, locales, public routes, features
- `src/i18n/messages/site/` -- site copy
- `src/pages/[locale]/index.astro` -- home / landing composition
- `content/posts/` -- Markdown blog posts
- `public/` -- assets

Use `draft: true` in a post's Markdown frontmatter while preparing it. Drafts
appear in local development for review, but production builds omit their pages
and exclude them from the blog listing, feed, and sitemap.

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

Refresh both the chat widget and the standalone SDK contact-form bridge with:

```bash
pnpm run build:embeds
```

The starter's `/contact/` example runs safely in demo mode by default. To send
contact form submissions to an organization, set
`PUBLIC_CR_CONTACT_FORM_MODE=live` and `PUBLIC_CONTEXTROCKET_HANDLE` after the
ContextRocket contact endpoint is enabled for the deployment origin.

This optional contributor command rebuilds the widget from a sibling
`../cr-sdk` checkout. The checked-in `public/embed/widget.js` is used by normal
standalone builds and does not need to be rebuilt by a fork.
Set `PUBLIC_CONTEXTROCKET_CHAT_WIDGET_URL` to a published, version-pinned CDN
URL to load a shared widget instead; by default the site uses the checked-in
local artifact. The proposed CDN route is documented in
[`docs/embed-direction.md`](docs/embed-direction.md) and is not published yet.

```html
<script
  src="/embed/widget.js"
  defer
  data-contextrocket-handle="your-handle"
  data-contextrocket-api-key="your-publishable-key"
></script>
```

## More

See [AGENTS.md](AGENTS.md), [docs/fork-evolution.md](docs/fork-evolution.md),
and [docs/site-integrations.md](docs/site-integrations.md).
