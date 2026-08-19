---
title: Frequently Asked Questions
description: Answers about this site, the chat agent, ContextRocket, and customization.
---

## What is this template?

ContextRocket Starter is a production-ready Next.js template for building
static websites and branded agent experiences on [ContextRocket](https://contextrocket.com).
It includes canned demo mode, direct browser-to-agent A2A streaming, a
standalone chat widget, SEO/AEO surfaces, and a customer CLI.

## How does the chat agent work?

In demo mode, the site uses canned responses and works on a static host. In
live mode, the browser connects directly to your ContextRocket agent over the
[A2A protocol](https://google.github.io/A2A/) using Server-Sent Events. No
Next.js backend is required in the middle.

## What do I need for live mode?

Configure the agent URL, your organization handle, and the publishable API key in
the site environment. ContextRocket validates that the key is allowed for the
requesting website origin. Keep secret management and administrative API keys
out of browser code.

## Where do answers come from?

Live answers come from the verified sources connected to the ContextRocket
agent. If the agent cannot find relevant information, it should say so rather
than guess. Demo mode uses the site's canned example response.

## What data does this site collect?

The public starter has no account system or local application backend. It may
use technically necessary browser storage and optional analytics after cookie
consent. Review the [Privacy Policy](/privacy) for the site's configured
details.

## How do I customize the design?

Edit `frontend/config/site.json` for brand data, theme tokens, assets, routes,
and feature switches. Edit `frontend/i18n/messages/site/` for localized site
copy, or add Markdown under `content/` for content-heavy surfaces. Shared
components and integration code remain starter-owned so forks can pull
improvements cleanly.
