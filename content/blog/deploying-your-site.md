---
title: "Deploying Your Site"
author: "The Team"
date: "2026-07-10"
image: "/images/blog/ai-robot-hands.jpg"
excerpt: "A short checklist for taking your site from local development to a live, statically-generated deployment."
---

## Build a static export

This starter renders as a fully static site. A production build generates the
HTML for every page and locale ahead of time, so there is no server to run and
the site is fast and cheap to host.

## Run through the checklist

Before you ship, confirm the essentials:

- Replace every placeholder in the site config with your real brand details.
- Set your production URL so canonical links, sitemaps, and structured data
  point at the right domain.
- Swap the icons and favicon in the public directory for your own assets.
- Fill in the legal and privacy pages — several are legally required in the EU.

## Publish the output

Upload the generated output to any static host or CDN. Because everything is
pre-rendered, deployment is a file copy: no runtime, no database, no cold
starts.

## Iterate

Content lives in markdown, so publishing a new post is just adding a file and
rebuilding. Keep your writing in version control and let each build refresh the
live site.
