# Agent web standards

The starter treats search engines and answer engines as first-class
consumers. The public site is designed to be understandable before chat is
connected and to expose its brand facts through stable machine-readable
surfaces.

## Discovery

- robots.txt defines ordinary and AI-crawler policies.
- sitemap.xml lists the generated public routes.
- llms.txt provides a concise AI-readable site map.
- /.well-known/agent.json exposes the local A2A agent card.
- /.well-known/mcp.json describes the hosted ContextRocket MCP surface when
  an API base is configured.

The canonical AI-readable file is `/llms.txt`. The project does not publish
`/llms-full.txt`: that filename is an optional convention used by some
documentation platforms, not part of the `llmstxt.org` proposal. Keep the
single file concise and link to the detailed Markdown pages that agents may
fetch when needed.

These are generated from site configuration and the public route tree. Keep
titles, descriptions, canonical URLs, and page content accurate in the fork's
site data and site message files.

The fork-owned `frontend/config/site.json.publicRoutes` list is the allowlist
for those public surfaces. `frontend/lib/public-route-registry.ts` is the
shared route contract and `frontend/lib/public-site.ts` supplies the sitemap,
robots, and llms builders. Forks should configure that list rather than copy
these builders or hand-maintain the route files.

## Structured identity

frontend/lib/structured-data.ts builds Organization and WebSite JSON-LD.
The home page renders it through the shared SEO components. Provide a stable
site URL, company description, social links, and contact details in
frontend/config/site.json.

## Direct A2A and the widget

The starter has canned demo mode for static deployments and live mode for
direct browser A2A. A host does not need a Next.js proxy or a backend.

The standalone widget is built from clients/embed-widget and copied to
frontend/public/embed/widget.js. Its canonical live snippet is:

    <script
      src="https://your-site.example/embed/widget.js"
      data-contextrocket-mode="live"
      data-contextrocket-api-base="https://app-api.contextrocket.com"
      data-contextrocket-handle="your-organization-handle"
      data-contextrocket-api-key="publishable-api-key"
      defer
    ></script>

The organization handle identifies the published agent. The API key is a
publishable browser credential. ContextRocket must bind it to that handle, check
the request Origin against the configured allowlist, enforce scope and rate
limits, and reject invalid or disallowed requests before agent execution.
Never place a server-side machine key in a public page.

## Implementation map

| Surface                 | Implementation                                                        |
| ----------------------- | --------------------------------------------------------------------- |
| robots.txt              | frontend/app/robots.ts                                                |
| sitemap.xml             | frontend/app/sitemap.ts                                               |
| llms.txt                | frontend/app/llms.txt/route.ts                                        |
| Route registry/builders | frontend/lib/public-route-registry.ts and frontend/lib/public-site.ts |
| Agent card              | frontend/app/.well-known/agent.json/route.ts                          |
| MCP manifest            | frontend/app/.well-known/mcp.json/route.ts                            |
| JSON-LD                 | frontend/lib/structured-data.ts                                       |
| A2A client              | frontend/lib/a2a-client.ts                                            |
| React stream hook       | frontend/hooks/use-a2a-stream.ts                                      |
| Standalone widget       | clients/embed-widget/                                                 |
| Customer CLI            | cli/                                                                  |
