# Agent Web Standards

Best practices for making your site legible to AI agents, answer engines,
and the emerging agentic web. This repo implements all of them. Each section
explains what the standard is, why it matters for AI discoverability, where
this repo implements it, and links to the authoritative spec.

---

## 1. robots.txt with an AI-crawler tier

**What it is.** `robots.txt` is the decades-old Robots Exclusion Protocol
that tells crawlers which paths to access. Modern answer-engine crawlers
(GPTBot, ClaudeBot, PerplexityBot, Google-Extended, and others) respect it.
The pattern here adds a named AI-crawler tier with an explicit Allow list
covering your highest-value content paths, rather than relying on the
wildcard `*` rule.

**Why it matters.** Answer engines (ChatGPT, Claude, Perplexity) use their
crawlers to retrieve grounding context. An explicit Allow list signals which
pages matter most for AI retrieval, gives crawlers a crawl delay hint to
prevent server overload, and lets you block the same sensitive paths (auth,
dashboard, admin) you already block from general crawlers.

**Config switch.** Set `allowAiCrawlers: false` in `frontend/site.config.ts`
to switch the entire AI-crawler tier to `Disallow: /`. Default is `true`
because being readable by answer engines is the point of the AEO surface.

**Where this repo implements it.**
`frontend/app/robots.ts` -- `CRAWLER_CONFIG.ai_crawlers` with named agents
(`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, and 16 others),
explicit `highValuePaths` Allow list, and a 1-second crawl delay.

**Spec.** https://www.robotstxt.org/robotstxt.html and
https://developers.google.com/search/docs/crawling-indexing/robots/intro

---

## 2. sitemap.xml

**What it is.** An XML Sitemap lists every public URL on your site with
optional metadata (lastmod, changefreq, priority). Both search engines and AI
crawlers use it for discovery.

**Why it matters.** A sitemap guarantees that newly published or rarely linked
pages get discovered. Answer engines use it as a starting point before
deciding which pages to retrieve for grounding.

**Where this repo implements it.**
`frontend/app/sitemap.ts` -- auto-generated from `site.config.ts`. Every
static public route is included. Dynamic routes can be added by extending the
array in that file.

**Spec.** https://www.sitemaps.org/protocol.html

---

## 3. llms.txt

**What it is.** `/llms.txt` is a Markdown file that gives AI assistants and
answer engines a curated, human-readable map of a site. It is a community
convention (llmstxt.org) that signals intent to be AI-readable and provides
a navigable index of key pages.

**Why it matters.** AI assistants that visit your site before generating an
answer often check for `llms.txt` first. A concise, accurate `llms.txt` helps
them understand what the site is about, which pages are authoritative, and
where to find machine-readable resources (agent card, MCP manifest, sitemap).

**Where this repo implements it.**
`frontend/app/llms.txt/route.ts` -- generated from `site.config.ts`. Content
includes core pages, machine-readable resources, and MCP information.
Served at `/llms.txt` with `content-type: text/markdown`.

**Spec / convention.** https://llmstxt.org/

---

## 4. llms-full.txt

**What it is.** `/llms-full.txt` is the extended version of `llms.txt` for
agents that want more detail: full descriptions, integration docs, API
context, and anything else useful for a thorough understanding.

**Why it matters.** Some agent runtimes fetch `llms-full.txt` when they need
richer context for a multi-turn interaction or a tool call. Having a
well-populated full context file gives those agents more to work with.

**Where this repo implements it.**
`frontend/app/llms-full.txt/route.ts` -- generated from `site.config.ts`.
Extend the content in that route file to include your full integration
documentation, API surface, and any context that helps an agent interact
correctly with your product.

**Spec / convention.** https://llmstxt.org/ (same convention as llms.txt)

---

## 5. .well-known/agent.json (A2A agent card)

**What it is.** `/.well-known/agent.json` is the A2A (Agent-to-Agent)
discovery endpoint defined by the Google A2A specification. It describes
the agent hosted at this site: its capabilities, authentication schemes,
skills, and the A2A endpoint URL that other agents can call.

**Why it matters.** A2A is an emerging open standard for agent-to-agent
communication. When an orchestrator agent wants to call your agent as a
sub-task, it fetches `/.well-known/agent.json` to discover the endpoint
and understand the protocol. This is the machine-readable equivalent of
a service API contract.

**Where this repo implements it.**
`frontend/app/.well-known/agent.json/route.ts` -- delegates to
`frontend/lib/agent-card.ts` (pure builder, no server imports, fully
testable). The card is valid JSON even when the endpoint is unconfigured
(`url: null`), so discovery tooling can parse it before you wire a backend.

**Spec.** https://google.github.io/A2A/ and
https://google.github.io/A2A/#/documentation?id=agent-card

---

## 6. .well-known/mcp.json (MCP server discovery)

**What it is.** `/.well-known/mcp.json` is an emerging convention for
exposing an MCP (Model Context Protocol) server manifest at a well-known
path. The field shape is not yet formally standardized; it describes the
MCP endpoint URL, transport, capabilities, and provider.

**Why it matters.** MCP lets agents connect to your brand's knowledge as
tools and resources -- structured, queryable, and authoritative. Declaring
your MCP endpoint in a well-known manifest lets agent runtimes discover it
automatically without manual configuration by the user.

**Hosted-agent pattern: ContextRocket serves your MCP endpoint.**
Rather than running MCP server infrastructure yourself, ContextRocket hosts
a per-org MCP endpoint (`<CR_AGENT_URL>/api/mcp`). Your site declares this
endpoint in `/.well-known/mcp.json` and in `llms.txt`. Agents discover it
and connect without you managing any server code.

**Where this repo implements it.**
`frontend/app/.well-known/mcp.json/route.ts` -- delegates to
`frontend/lib/mcp-manifest.ts` (pure builder). The manifest is generated
from `site.config.ts` and `NEXT_PUBLIC_CR_AGENT_URL`.

**Spec / reference.**
MCP spec: https://spec.modelcontextprotocol.io/
Well-known path proposal: https://github.com/modelcontextprotocol/specification/discussions/129
Anthropic MCP docs: https://docs.anthropic.com/en/docs/mcp

---

## 7. JSON-LD Organization and WebSite structured data

**What it is.** JSON-LD (JSON for Linked Data) lets you embed structured
metadata directly in your HTML `<head>`. `Organization` and `WebSite` are
the two schema.org types that describe a company and its primary website.
Answer engines read JSON-LD to extract authoritative facts about an entity.

**Why it matters.** JSON-LD is the primary signal answer engines use to
build knowledge-graph entries. A correctly structured `Organization` block
with `name`, `url`, `description`, `sameAs` (social profiles), and
`contactPoint` gives search engines and AI systems a machine-readable
identity anchor for your brand. `WebSite` adds the `SearchAction` and
canonical URL.

**Where this repo implements it.**
`frontend/lib/structured-data.ts` -- pure builders for `Organization` and
`WebSite` JSON-LD, generated from `site.config.ts`.
`frontend/components/seo/structured-data-scripts.tsx` -- injects the
`<script type="application/ld+json">` tags in the home page `<head>`.
`frontend/app/page.tsx` -- renders the structured data on the home page.

**Spec.** https://schema.org/Organization and https://schema.org/WebSite

---

## 8. Hosted-agent pattern: chat on your site via the widget

**What it is.** A one-script-tag embed that drops a floating chat button
onto any page. The button opens an iframe pointing at your site's `/embed`
route, which renders the full ContextRocket chat panel. No React, no
bundler, and no backend changes are required on the host site.

**Why it matters.** Adding an AI agent to an existing site is often blocked
by integration complexity. The widget removes that barrier: paste one
`<script>` tag, configure a data attribute with your agent URL, and the
agent is live. The iframe boundary provides style isolation for free.

**How it works.**
1. `widget.js` reads its own `<script>` tag's `data-cr-agent-url`,
   `data-cr-site-key`, and `data-cr-title` attributes.
2. It injects a floating action button (FAB) into the host page.
3. On click, it opens an `<iframe>` pointing at `/embed` on the same
   origin as `widget.js`, passing config via URL query params.
4. The `/embed` page is chromeless: no navigation, no footer. It renders
   the chat panel and connects to the configured ContextRocket agent.

**Security notes.** `data-cr-site-key` is a public rate-limited credential.
It is analogous to a publishable API key. Origin binding and rate-limiting
are enforced server-side at ContextRocket. Never put server-side secrets in
widget attributes or in embed page query params.

**Snippet.**

```html
<script
  src="https://your-site.example/widget.js"
  data-cr-agent-url="https://your-cr-instance.com"
  data-cr-site-key="pk_live_..."
  defer
></script>
```

**Where this repo implements it.**
`frontend/public/widget.js` -- self-contained vanilla-JS loader (no bundler
dependency, readable as a reference implementation).
`frontend/app/embed/page.tsx` -- chromeless chat page for the iframe.
`frontend/lib/widget-config.ts` -- shared config-parsing contract (TypeScript
version; widget.js inlines the same 5-line parse to stay dependency-free).

**Demo.** The home page (`/`) has a section with the copy-paste snippet and
an explanation. The floating chat button already on the home page (the FAB
from the root layout) is the same chat panel component the widget embeds;
the section notes this to avoid confusion about a second overlapping button.

---

## 9. Hosted-agent pattern: your brand's context as an MCP endpoint

**What it is.** ContextRocket hosts a per-org MCP endpoint backed by your
verified corpus and context pack. Any MCP-compatible agent runtime can
connect to it as a tool server, querying your brand's knowledge without
custom infrastructure.

**Why it matters.** The emerging agentic web connects agents to data sources
via MCP rather than one-off APIs. Having your brand knowledge available as
an MCP endpoint means any agent (Claude, Cursor, Copilot, or a custom agent)
can retrieve authoritative context about your product -- reducing
hallucination and improving answer quality when agents discuss your brand.

**How a site declares it.**
1. Set `NEXT_PUBLIC_CR_AGENT_URL` to your ContextRocket org endpoint.
2. The `/.well-known/mcp.json` manifest is automatically generated pointing
   to `<CR_AGENT_URL>/api/mcp`.
3. Add an entry to `/llms.txt` naming the MCP endpoint (already included
   in the `llms.txt/route.ts` output).
4. Agent runtimes discover the endpoint from the well-known manifest without
   any manual user configuration.

**Where this repo implements it.**
`frontend/app/.well-known/mcp.json/route.ts` and
`frontend/lib/mcp-manifest.ts` -- see section 6 above.
`frontend/app/llms.txt/route.ts` -- MCP section included in the llms.txt
output.

---

## Summary: which file implements which standard

| Standard | Path | Purpose |
|---|---|---|
| AI-tiered robots.txt | `frontend/app/robots.ts` | Named AI-crawler tier with explicit Allow list and crawl delay |
| sitemap.xml | `frontend/app/sitemap.ts` | Page index for search + AI discovery |
| llms.txt | `frontend/app/llms.txt/route.ts` | Curated AI-readable site context |
| llms-full.txt | `frontend/app/llms-full.txt/route.ts` | Extended context for agents |
| A2A agent card | `frontend/app/.well-known/agent.json/route.ts` | Agent-to-agent discovery endpoint |
| MCP manifest | `frontend/app/.well-known/mcp.json/route.ts` | MCP server discovery (emerging convention) |
| JSON-LD Organization+WebSite | `frontend/lib/structured-data.ts`, `frontend/app/page.tsx` | Machine-readable brand identity |
| Chat widget (embed) | `frontend/public/widget.js`, `frontend/app/embed/page.tsx` | One-tag agent embed for any site |
| MCP hosted endpoint | `frontend/lib/mcp-manifest.ts` (pointer) | Per-org MCP served by ContextRocket |
