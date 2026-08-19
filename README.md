# ContextRocket Starter

A small, Next.js-first starter for building branded websites that connect directly to ContextRocket. It runs as a static export with no backend, database, Docker, or local AI service.

The starter provides:

- configuration-driven branding and theme data;
- fork-owned multilingual site content;
- canned chat for demos and static hosting;
- optional direct browser A2A streaming to ContextRocket;
- a standalone dependency-free chat widget; and
- the customer `contextrocket` CLI in this repository for authentication and
  content transfer.

The customer workflow is intentionally GitHub-first: clone or fork this
repository, put authored source material under `content/`, configure the site,
and run the checked-in CLI to publish that content to ContextRocket. The CLI is
not downloaded from a separate CDN release channel.

## Quick start

```bash
pnpm install --dir frontend
pnpm --dir frontend dev
```

The site runs in canned demo mode by default. To connect a published agent, copy `frontend/config/.env.example` to `frontend/.env.local` and set:

```bash
NEXT_PUBLIC_CR_CHAT_MODE=live
NEXT_PUBLIC_CR_AGENT_URL=https://app-api.contextrocket.com
NEXT_PUBLIC_CONTEXTROCKET_HANDLE=your-organization-handle
NEXT_PUBLIC_CONTEXTROCKET_API_KEY=your-publishable-api-key
```

The API key is a browser credential: it must be scoped, rate-limited, revocable, and restricted by allowed origins in ContextRocket. Never put a server-side `crk_` machine credential in a public build.

## Fork contract

Forks normally change only:

- `frontend/config/site.json` for identity, navigation, theme, assets, and switches;
- `frontend/i18n/messages/site/` for brand content;
- `frontend/app/[locale]/page.tsx` for a custom home composition; and
- `frontend/public/` for fork-owned assets.

Shared components, transport, configuration seams, i18n shared/app messages, widget, and CLI are starter-owned. Pull starter updates into a fork instead of copying feature code into it.

Language bundles are optional. For an English-only site, set the site locale list
to ["en"] and keep only the en.ts file in each message slice. The i18n
generator discovers the files that exist, so unused language bundles are not
loaded or carried in the fork.

The public starter intentionally does not contain auth, passwordless account flows, dashboards, or FastAPI. Those belong in the private `cr-auth-starter`; `cr-luna` is the advanced full-stack proof of concept based on that private starter.

## Widget

The standalone widget source, build, tests, versioning, and eventual CDN
release all belong to this repository. Context Rocket's dashboard provisions
the Website API key and generates installation snippets; it does not contain a
second widget implementation. The starter's React Chat FAB is the richer UX
reference, while `clients/embed-widget/` is the dependency-free script for
static HTML, WordPress, and other sites that cannot import the starter source.

Build the standalone widget with:

```bash
pnpm --dir clients/embed-widget build
```

Use it in demo mode:

```html
<script
  src="/embed/widget.js"
  data-contextrocket-mode="demo"
  data-contextrocket-theme="system"
  data-contextrocket-position="bottom-right"
  defer
></script>
```

For a hosted release, use the immutable versioned URL supplied by the Context
Rocket dashboard after a starter release has been published and verified. Do
not invent an unversioned CDN URL. Direct live A2A uses
`data-contextrocket-api-base`, `data-contextrocket-handle`, and
`data-contextrocket-api-key`; the last value is a publishable, origin-bound
Website API key, not a server credential.

The V1 hosted scalar contract is intended to support
`data-contextrocket-theme` (`system|light|dark`),
`data-contextrocket-accent` (validated color),
`data-contextrocket-position` (`bottom-right|bottom-left`), bounded title and
greeting values, and a supported locale. The customization lane must land and
test these values before they appear in a generated production snippet. Keep
richer fork-specific appearance and icebreakers in typed `siteConfig`
configuration. Do not inject CSS, scripts, custom endpoints, prompts, or model
settings into the widget.

## Publish content

Keep publishable authored material in a predictable folder such as
`content/`. After creating an org machine credential for automation, publish
the folder with the CLI from this checkout:

```bash
CONTEXTROCKET_API_KEY=crk_... \
  pnpm --dir cli dev -- content sync ./content cr://your-handle/content
```

For an interactive human session, use `auth login` once and omit the machine
credential environment variable. The `cr://` destination uses the
ContextRocket handle as its org component; the credential is org-scoped and
must never be committed.

## CLI

The CLI is an npm package in [`cli/`](cli/). During development:

```bash
pnpm --dir cli install
pnpm --dir cli build
pnpm --dir cli dev -- auth login
pnpm --dir cli dev -- content sync ./content cr://your-handle/content
```

It supports OAuth login, headless `CONTEXTROCKET_API_KEY` authentication,
content copy/list/read/delete/sync, source upload/download/delete, and
static-site publishing. `sites publish` is for delivering a built static site
through the governed CR CDN; it is not how the CLI is distributed.

## Verification

```bash
make verify
```

For a static deployment:

```bash
make build-static
make serve-static
```

See [`AGENTS.md`](AGENTS.md) for the ownership rules and [`docs/`](docs/) for configuration, design, AEO/SEO, and deployment guidance.

## License

MIT
