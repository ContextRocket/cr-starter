---
title: Frequently Asked Questions
description: Answers to common questions about this site, the chat agent, data handling, and customization.
---

## What is this template?

This is the ContextRocket Starter -- a production-ready Next.js template for building AI-powered products on [ContextRocket](https://contextrocket.com). It ships with authentication flows, a dashboard shell, streaming chat backed by the A2A protocol, and a full agent-discoverability stack (JSON-LD, llms.txt, MCP manifest, A2A agent card).

Fork the repo, fill in `frontend/site.config.ts` with your brand, connect your ContextRocket org credential, and you have a branded knowledge agent in minutes. No backend AI code required.

## How does the chat agent work?

The chat panel connects to your ContextRocket agent over the [A2A protocol](https://google.github.io/A2A/) -- a JSON-RPC 2.0 + Server-Sent Events wire format designed for agent-to-agent communication.

When you send a message, the frontend streams a sequence of typed events from your ContextRocket agent: a working state, incremental text chunks as the agent reasons, and a completed event that carries citations. The agent reads from your verified brand knowledge (your Context Pack) and returns grounded answers with source references. No general-purpose web search is involved; the agent answers from what your org has explicitly added to its corpus.

## Where do answers come from?

Answers come from your org's Context Pack in ContextRocket -- the verified, curated knowledge base your organization manages in the ContextRocket dashboard. The agent does not browse the open web or answer from training data alone; every response is grounded in the sources your team has reviewed and approved.

If the agent cannot find relevant information in your corpus, it says so rather than guessing. You can grow the corpus by adding sources in the ContextRocket dashboard and running a fresh crawl or enrichment job.

## How do I connect my ContextRocket org?

Set two environment variables in `frontend/.env.local`:

```
NEXT_PUBLIC_CR_AGENT_URL=https://api.contextrocket.com
NEXT_PUBLIC_CR_ORG_KEY=crk_your_key_here
```

Both values come from your ContextRocket dashboard under Settings. `NEXT_PUBLIC_CR_AGENT_URL` is the A2A endpoint for your org's agent. `NEXT_PUBLIC_CR_ORG_KEY` is a `crk_`-prefixed machine credential that scopes the agent to your org's knowledge.

Restart the dev server after setting the variables. The chat FAB will connect immediately. See `docs/integrating-with-contextrocket.md` in the repo for the full environment contract and error-handling details.

## What data does this site collect?

When you use the optional local backend (full-stack path), the site stores your email address, a hashed password, and your preferred language in order to manage your account. A session cookie keeps you logged in.

Analytics are off by default. If the operator has enabled Google Analytics 4 or PostHog, those scripts load only after you accept via the cookie consent banner; declining keeps the site fully functional. Your consent choice is stored in your browser's local storage and can be cleared at any time.

For full details, see the [Privacy Policy](/privacy) page.

## How do I customize the design?

Design tokens live in `frontend/app/globals.css` as CSS custom properties (`--primary`, `--background`, `--foreground`, and so on). Change those values to match your brand without touching component code.

For deeper changes, the component library is [shadcn/ui](https://ui.shadcn.com/) built on Radix UI primitives. Components live in `frontend/components/ui/`. Tailwind v4 CSS-first configuration means there is no `tailwind.config.js` -- all theme overrides go in `globals.css`.

See `docs/customizing-design.md` for the full component map and the list of files you own versus files you should not fork.
