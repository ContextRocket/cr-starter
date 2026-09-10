# ContextRocket Starter

Public **Astro** starter for branded static websites that connect to ContextRocket
via an embeddable chat snippet. Builds to `dist/` for any CDN.

## Quick start

```bash
pnpm install
pnpm dev   # http://localhost:3100 (starter; forks use 3101+)
```

Demo chat mode is the default. For live chat, set in `.env`:

```bash
PUBLIC_CR_CHAT_MODE=live
PUBLIC_CR_AGENT_URL=https://app-api.contextrocket.com
PUBLIC_CONTEXTROCKET_HANDLE=your-handle
PUBLIC_CONTEXTROCKET_API_KEY=your-publishable-api-key
```

## What you customize in a fork

- `config/site.json` -- brand, theme, nav, locales, public routes, features
- `src/i18n/messages/site/` -- site copy
- `src/pages/[locale]/index.astro` -- home / landing composition
- `content/posts/` -- Markdown blog posts
- `public/` -- assets

Shared layout, i18n runtime, blog engine, hygiene routes, and embed widget are
starter-owned.

**Default pages:** home + blog + legal/hygiene (privacy, terms, cookies,
impressum) + attribution. No FAQ / About / gallery / Features pages.

## Build and deploy

```bash
pnpm run build
# optional: single-locale URL flatten
node scripts/flatten-single-locale.mjs
# upload dist/ to Cloudflare Pages, CloudFront, S3, …
```

## Embed widget

```bash
pnpm run build:widget
```

```html
<script
  src="/embed/widget.js"
  defer
  data-contextrocket-handle="your-handle"
  data-contextrocket-api-key="your-publishable-key"
></script>
```

## More

See [AGENTS.md](AGENTS.md) and [docs/fork-evolution.md](docs/fork-evolution.md).
