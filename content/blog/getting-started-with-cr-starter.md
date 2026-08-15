---
title: "Getting Started with ContextRocket Starter"
author: "CR Team"
date: "2026-07-01"
image: "/images/blog/contextrocket-intro.jpg"
excerpt: "A quick guide to setting up your ContextRocket-powered site, customizing the brand, and publishing your first content."
---

## What is the cr-starter?

The cr-starter is a production-ready Next.js template that gives you a branded website, authentication, a chat interface powered by ContextRocket, and a blog — all in one repo. Edit one file to set your brand, and you're ready to go.

## Quick start

```bash
git clone https://github.com/ContextRocket/cr-starter
cd cr-starter
pnpm install
pnpm dev
```

Visit `http://localhost:3100` and you'll see your site running.

## Customize your brand

Open `frontend/site.config.ts` and replace the default values:

- `companyName` — your company name
- `tagline` — your headline
- `description` — your meta description
- `siteUrl` — your production domain
- `legal` — your legal entity details

All pages, SEO metadata, and structured data read from this one file.

## Add blog posts

Create a `.md` file in `content/blog/` with YAML frontmatter:

```yaml
---
title: "Your Post Title"
author: "Author Name"
date: "2026-07-15"
excerpt: "A brief description for the listing page."
---
```

The body is standard Markdown. Posts appear on `/blog`, newest first.

## Connect ContextRocket

Set `NEXT_PUBLIC_CR_AGENT_URL` in `.env.local` to your ContextRocket agent URL. The chat FAB appears automatically.

## What's included

- Next.js 16 App Router with URL-segment locale routing (/en, /es, /de)
- Tri-locale UI with hand-translated messages
- Authentication (login, register, password reset)
- Dashboard
- FAQ page (content-driven from markdown)
- Blog (content-driven from markdown)
- Privacy policy and Impressum (generated from site.config)
- SEO: JSON-LD structured data, sitemap, robots.txt, Open Graph
- Cookie consent (GDPR-ready)
- Embeddable chat widget
