---
title: "Deploying your site"
author: "The Team"
date: "2026-07-10"
image: "/images/blog/ai-robot-hands.jpg"
excerpt: "A short checklist for taking the starter from local development to a static production deploy."
---

## Build a static export

```bash
pnpm run build
```

Astro writes a fully static `dist/`. There is no app server to run — upload the folder to any static host or CDN.

## Run through the checklist

Before you ship:

1. Replace brand fields in `config/site.json` with your real details.
2. Set `company.siteUrl` so canonical links, sitemap, and structured data point at production.
3. Swap logos and favicons under `public/`.
4. Review privacy, terms, cookies, and impressum — several are expected in the EU.
5. Confirm blog covers and attributions if you use stock photography.

## Publish the output

Deploy `dist/` to Cloudflare Pages, Netlify, S3 + CloudFront, or any static host. Because pages are pre-rendered, a publish is a file sync: no runtime database and no cold starts.

## Iterate on content

New posts are Markdown files in `content/posts/`. Add a file, rebuild, and redeploy. Keep writing in git so every release is reviewable.
