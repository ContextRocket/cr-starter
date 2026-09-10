---
title: "Getting started with ContextRocket Starter"
author: "CR Team"
date: "2026-08-19"
image: "/images/blog/contextrocket-intro.jpg"
excerpt: "Set up the site, customize brand identity, and publish your first Markdown post — including a cover image."
featured: true
---

The starter is a static Astro site with a Markdown blog, legal pages, and an optional ContextRocket chat widget. Edit configuration and content; rebuild to publish.

## Quick start

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3100` (this starter). Forks often use nearby ports such as 3101+.

## Customize your brand

Edit `config/site.json`:

- `company.name` — display name in the chrome
- `company.legalName` — footer and legal pages
- `company.tagline` / `company.description` — home and SEO
- `company.siteUrl` — canonical URLs and structured data
- `legal` — entity, address, register, VAT, privacy contact
- `theme` — color tokens for light and dark mode

Site copy for marketing pages lives in `src/i18n/messages/site/`.

## Add a blog post

Create a Markdown file under `content/posts/`. Frontmatter drives the listing, cover image, and SEO:

```yaml
---
title: "Your post title"
author: "Author Name"
date: "2026-09-01"
image: "/images/blog/programming-setup.jpg"
excerpt: "A short description for cards and meta tags."
featured: false
---
```

The body is normal Markdown. Put cover assets in `public/` (this starter keeps examples under `public/images/blog/`) and reference them with a root-relative path in `image`.

You can also embed images in the body:

![A laptop on a desk used as an in-post example](/images/blog/programming-setup.jpg)

## Locales

- Shared post for every language: `my-post.md`
- Locale-specific copy: `my-post.en.md`, `my-post.es.md`, `my-post.de.md`

A locale-specific file wins over a shared file with the same slug. Keep translations in Markdown — not in the UI message bundles.

## Connect ContextRocket (optional)

For live chat, set the public ContextRocket env vars in `.env` (see `.env.example`). Demo mode works offline for static exports.

## What you get

- Astro static export with locale-aware routes
- Markdown blog with cover images, excerpts, and featured posts
- Privacy, terms, cookies, and impressum from site config
- SEO helpers: sitemap, robots, feed, Open Graph, JSON-LD
- Embeddable chat widget under `public/embed/`
