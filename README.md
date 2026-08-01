# cr-starter -- ContextRocket Starter

[![CI](https://github.com/ContextRocket/cr-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/ContextRocket/cr-starter/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.txt)

**Build a product on ContextRocket.**

Clone this repo, swap in your ContextRocket org credential, and you have a
branded chat experience backed by your corpus, context pack, and agent config
-- without writing a line of backend AI code.

---

## Replace-me checklist (fork first 30 minutes)

After forking, do these steps before making the site public:

- [ ] **`frontend/site.config.ts`** -- replace every `PLACEHOLDER` value:
  `companyName`, `legalName`, `tagline`, `description`, `siteUrl`,
  `contactEmail`, `social.*`, and all `legal.*` fields.
- [ ] **`public/` favicons and icons** -- replace `favicon.ico`,
  `favicon-16x16.png`, `favicon-32x32.png`, `apple-icon-180x180.png`,
  `icon-192.png`, `icon-512.png`, `icon-192-maskable.png`,
  `icon-512-maskable.png` with your own brand assets.
- [ ] **`/impressum`** -- legally required for DE/EU commercial sites.
  Fill in all `site.config.legal` fields (entity, address, register, vat,
  representedBy), then review the generated page with your legal advisor.
- [ ] **`/privacy`** -- auto-generated from `site.config.legal` and the
  actual app behaviour (auth data, cookies, analytics when keys are set).
  Fill in `site.config.legal`, then review the generated page with your
  legal advisor before going live. Set analytics env keys first so the
  correct providers appear in the policy.
- [ ] **`.beads/config.yaml`** -- change `issue-prefix` to your product
  name (e.g. `ACME`).
- [ ] **`frontend/.env.local`** -- set `NEXT_PUBLIC_CR_AGENT_URL` to your
  ContextRocket A2A endpoint and `NEXT_PUBLIC_CHAT_FAB_ENABLED=true`.
- [ ] **Demo credential** -- if you want a zero-config demo experience,
  set `NEXT_PUBLIC_CR_ORG_KEY` to a rate-limited org credential.
- [ ] **`README.md`** -- update the GitHub Actions badge URL and remove
  this checklist once complete.
- [ ] **Integration docs** -- read `docs/integrating-with-contextrocket.md`
  (env contract, A2A streaming, failure modes) and
  `docs/customizing-design.md` (Tailwind tokens, component map, do-not-fork
  list) before customizing.
- [ ] **Analytics (optional)** -- set `NEXT_PUBLIC_GA_MEASUREMENT_ID` or
  `NEXT_PUBLIC_POSTHOG_KEY` in `frontend/.env.local` to enable analytics.
  Consent-gated by default; nothing loads until the user accepts. See the
  Analytics section below.

---

## Out-of-the-box experience

```
clone -> make start-next-only -> http://localhost:3100
```

The homepage loads with a Chat FAB in the corner.  The FAB is pre-wired to
the ContextRocket A2A protocol.  A public zero-config demo mode is coming
soon; until then, set `NEXT_PUBLIC_CR_AGENT_URL` + `NEXT_PUBLIC_CR_ORG_KEY`
in `frontend/.env.local` to your own org credential and the FAB becomes your
brand's agent immediately.

---

## What this repo is

`cr-starter` is a Next.js + optional FastAPI template for building products on
ContextRocket.  It provides:

- **Auth flows** -- login, register, password recovery, guest JWT provisioning.
- **Dashboard shell** -- breadcrumb navigation, pagination, error toasts.
- **Chat FAB + full-page chat** -- streaming A2A client, three-tier latency UI,
  citation pills, tool-call indicators.
- **`lib/cr-sdk/`** -- the single integration surface: `createCRClient`,
  `client.streamTurn`, `client.agentCard`, guest credential lifecycle.
- **OpenAPI typed client** -- auto-generated from the optional local backend.
- **i18n keys** -- all user-facing strings in `i18n/keys.ts`; extend per locale.

Conversation state, agent runs, context packs, and knowledge all live in
ContextRocket, reached over A2A.  This repo owns only auth + UI.

Verticals fork this repo and customize at the named seams.  See
`docs/EXTENDING.md` for the fork contract.

---

## Setup paths

### Path A -- Next only (default, no local backend)

Use this when you just want the chat UI and you manage users through
ContextRocket (guest sessions auto-provisioned).

```bash
# Prerequisites: Node 22 (nvm), pnpm
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local:
#   NEXT_PUBLIC_CR_AGENT_URL=<your CR A2A endpoint>
#   NEXT_PUBLIC_CHAT_FAB_ENABLED=true

make start-next-only
# -> http://localhost:3100
```

No Python, no Postgres, no Docker required.

### Path B -- Full stack (with user management backend)

Use this when you need local user accounts, email-based auth, and operator
controls beyond ContextRocket's org credentials.

```bash
# Prerequisites: Docker Desktop, Python 3.12, uv, Node 22, pnpm

# 1. Copy env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# 2. Edit backend/.env -- generate three random secret keys:
#    python3 -c "import secrets; print(secrets.token_hex(32))"
#    Set ACCESS_SECRET_KEY, RESET_PASSWORD_SECRET_KEY, VERIFICATION_SECRET_KEY

# 3. Edit frontend/.env.local
#    NEXT_PUBLIC_BACKEND_ENABLED=true
#    NEXT_PUBLIC_CR_AGENT_URL=<your CR A2A endpoint>
#    NEXT_PUBLIC_CHAT_FAB_ENABLED=true

# 4. Start the database and apply migrations
make docker-up-db
make docker-migrate-db

# 5. Install dependencies
cd backend && uv sync
cd frontend && pnpm install

# 6. Start both servers
make start-backend   # Terminal 1 -- FastAPI on :8100
make start-frontend  # Terminal 2 -- Next.js on :3100
```

---

## Port map

All ports are isolated from the sibling `context-rocket` project to allow
both to run simultaneously.

| Service | Port |
|---|---|
| Next.js frontend | **3100** |
| FastAPI backend | **8100** |
| Dev DB (Postgres) | **5452** |
| Test DB (Postgres) | **5453** |
| MailHog SMTP | **1026** |
| MailHog Web UI | **8026** |

---

## Customization guide

### Tailwind theming

Edit `frontend/app/globals.css`.  The design tokens (`--primary`, `--background`,
etc.) are CSS custom properties in the `:root` block -- change them to match
your brand without touching component code.

### Internationalization

The starter ships tri-locale (en, es, de) out of the box.

**Where strings live:**
- `frontend/i18n/messages/en.ts` -- English (source of truth)
- `frontend/i18n/messages/es.ts` -- Spanish
- `frontend/i18n/messages/de.ts` -- German

**How to add a string:**
1. Add the key and English value to `en.ts`.
2. Add the same key with translated values to `es.ts` and `de.ts`.
3. Use `t("YOUR_KEY")` in any component.

**Boundary rule:** `messages/*.ts` is UI copy only (labels, prompts, errors).
Brand identity (tagline, description, company name) stays in `site.config.ts`.

**Parity enforcement:** `scripts/check-i18n-parity.js` compares all locale
files against `en.ts` (AST-based, not regex). It runs automatically on
pre-commit. Run it manually:

```bash
cd frontend && node scripts/check-i18n-parity.js
```

**How to add a new locale** (e.g. French):
1. Create `frontend/i18n/messages/fr.ts` with `export const fr = { ... }`.
2. Add `"fr"` to `SUPPORTED_LOCALES` in `frontend/i18n/messages/index.ts`.
3. Add `"fr"` to `locales` in `frontend/site.config.ts`.
4. Add a loader for `fr` in `frontend/i18n/locale-provider.tsx`.
5. Add locale label keys (`locale.labelFrench`) in all three existing files + the new `fr.ts`.
6. Run `node scripts/check-i18n-parity.js` to confirm parity.

**Locale switching:** a `<LocaleSwitcher />` component (Globe icon + dropdown)
is mounted in the home page footer. Mount it wherever your layout needs it.
The active locale is persisted in a `NEXT_LOCALE` cookie. The `<html lang>`
attribute is updated on the client after hydration.

**Upgrade path:** cookie/provider-based locale is the current approach (no URL
segments). For full SEO/hreflang support, adopt Next.js
[locale] URL-segment routing -- the message files and `t()` API are compatible
with that upgrade. See `frontend/i18n/keys.ts` for the upgrade path comment.

### Chat FAB flag

Set `NEXT_PUBLIC_CHAT_FAB_ENABLED=true` in `frontend/.env.local` to show the
FAB on every page.  To restrict it to specific pages, mount `<ChatFab />`
directly in those page layouts and leave the flag unset.

### cr-sdk config

`frontend/lib/cr-sdk/config.ts` reads env vars.  For production deployments,
set `NEXT_PUBLIC_CR_AGENT_URL` and optionally `NEXT_PUBLIC_CR_ORG_KEY` in
your hosting platform's environment config (Vercel, Railway, etc.).

### Analytics: paste one key

Analytics is dormant until you add a key. Set one (or both) in
`frontend/.env.local`:

```bash
# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_your_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com   # optional, default shown
```

**GDPR: consent-first by default.** The cookie consent banner appears on first
visit. Analytics scripts load only after the user clicks Accept. Declining keeps
the site fully functional. All analytics code lives in `frontend/lib/analytics.ts`.
Nothing outside that file loads gtag or PostHog.

---

## How agents discover this site

`cr-starter` ships a full agent-discoverability stack. Every file is generated
from `site.config.ts` -- forks get the correct content with no extra work.

| Signal | Path | Purpose |
|---|---|---|
| robots.txt | `/robots.txt` | Named AI-crawler tier (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, ...) with explicit Allow for high-value paths and `llms.txt`. Config switch: `siteConfig.allowAiCrawlers` (default true). |
| llms.txt | `/llms.txt` | Curated Markdown context for LLMs and answer engines. Includes MCP section naming the ContextRocket-hosted endpoint. |
| llms-full.txt | `/llms-full.txt` | Extended context for agents that want more detail. |
| A2A agent card | `/.well-known/agent.json` | A2A spec discovery endpoint. Points at the configured CR A2A endpoint. Valid JSON even when the endpoint is not yet configured (`url: null`). |
| MCP manifest | `/.well-known/mcp.json` | Emerging convention for MCP server discovery. Describes the ContextRocket-hosted MCP endpoint for this org. |
| Sitemap | `/sitemap.xml` | Standard XML sitemap for all indexable public pages. |
| Chat widget | `public/widget.js` + `/embed` | One-tag embed that adds a floating chat button to any site. See the [home page demo section](/) and `docs/agent-web-standards.md`. |

The AI-crawler tier gives answer engines (ChatGPT, Claude, Perplexity) an
explicit Allow list covering `/`, `/llms.txt`, `/llms-full.txt`,
`/.well-known/agent.json`, and `/sitemap.xml`. A crawl delay of 1 second
prevents server overload. Set `allowAiCrawlers: false` in `site.config.ts`
to block the tier entirely.

For a detailed explanation of each standard, the spec links, and the hosted-agent
patterns (widget embed + ContextRocket-hosted MCP endpoint), see
[docs/agent-web-standards.md](docs/agent-web-standards.md).

---

## Fork contract

See `docs/EXTENDING.md` for:
- The sanctioned extension seams (theme, config, data bootstrap hooks).
- The files you own vs. files you should never touch.
- The contribute-back path (generic improvements as upstream PRs; vertical
  logic stays in your fork).

---

## Working with AI agents

This repo is designed for multi-tool AI workflows (Claude Code, Gemini CLI,
Cursor, etc.).  Each tool reads the same control plane:

| Tool | Reads |
|---|---|
| Claude Code | `CLAUDE.md` -> `AGENTS.md` + subdirectory `AGENTS.md` |
| Gemini CLI | `GEMINI.md` -> `AGENTS.md` + subdirectory `AGENTS.md` |
| Cursor | `.cursor/rules/project.mdc` -> `AGENTS.md` + subdirectory `AGENTS.md` |

All rules live in `AGENTS.md` (root) and `backend/AGENTS.md` / `frontend/AGENTS.md`.
Do not put rules in the tool-specific files; they are thin delegation wrappers.

**Beads workflow** (work graph):

```bash
brew install beads   # one-time
bd bootstrap --yes   # initialise .beads/ in the clone
bd ready             # see unblocked tasks
bd update <id> --claim   # claim a task before starting
bd close <id> -r "one line summary"   # mark done
```

**Install pre-commit hooks** (once per clone):

```bash
cd backend && uv sync && uv run python -m pre_commit install
```

## Testing

```bash
make test-frontend   # Jest unit tests (Next.js)
make test-backend    # pytest (optional backend)
make test-e2e        # Playwright E2E (requires full stack)
```

---

## License

MIT (c) 2026 ContextRocket. See `LICENSE.txt`.
