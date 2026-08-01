# cr-starter -- Developer Guide

Single source of truth for AI assistants and developers.  Tool-specific files
(`CLAUDE.md`, `.cursor/rules/`) point here.

See also `backend/AGENTS.md` and `frontend/AGENTS.md` for subproject details.

## What this repo is

A Next.js + optional FastAPI template for building products on ContextRocket.
The frontend is the product.  The backend is a thin user-management layer
(fastapi-users: guest JWT, registered accounts, conversion).  All AI -- agent
runs, context packs, threads, knowledge -- delegates to ContextRocket over A2A.

`docs/EXTENDING.md` is the fork contract: verticals fork this repo and
customize at the named seams.

## Hard rules

1. **Self-contained code.** Never import from outside this repository (no
   sibling-repo or path imports).  Everything the app needs lives in this
   repo.
   **Port/adapter at integration seams:** data access and external
   services go behind small interfaces (a Port) with concrete adapters
   and fake/in-memory test doubles, so forks swap implementations (file
   -> API, local -> platform) without rewriting consumers.  Do not
   over-abstract thin CRUD where the database is the contract.
2. **No LLM keys.** The template delegates all AI to ContextRocket over A2A.
   `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, and friends must not appear in
   `.env.example`, config, or any default path.  The only external AI
   dependency is `NEXT_PUBLIC_CR_AGENT_URL` + optional `NEXT_PUBLIC_CR_ORG_KEY`.
3. **Port isolation.** All services run on template-specific ports (3100, 8100,
   5452, 5453, 1026, 8026) defined once in `.env.example`.  No port is
   hardcoded twice.  These ports must not collide with the sibling
   `context-rocket` project (3000, 8000, 5442, 5443).
4. **No hardcoded English in UI.** All user-facing strings go through
   `i18n/keys.ts` and `t("KEY")`.
5. **cr-sdk is the integration boundary.** Components and hooks import from
   `@/lib/cr-sdk`, not directly from `@/lib/a2a-client`.  The wire protocol
   layer (`a2a-client.ts`) is an implementation detail of cr-sdk.
6. **TDD first.** Write a failing test before adding behavior.
7. **Boyscout rule.** Fix pre-existing lint/test failures in any file you touch.
   Do not defer.

## Architecture

```
frontend/
  app/                 Next.js App Router pages
  components/
    chat/              Chat FAB, panel, composer, message list (A2A streaming)
    dashboard/         Shell primitives (breadcrumb, pagination, error toast)
    ui/                shadcn/ui (do not edit)
  lib/
    cr-sdk/            Integration surface: createCRClient, credentials, config
    a2a-client.ts      A2A wire protocol (used only by cr-sdk)
    clientConfig.ts    OpenAPI client base URL config
  hooks/
    use-a2a-stream.ts  React hook wrapping cr-sdk/a2a streaming
  i18n/keys.ts         All user-facing strings
  __tests__/           Jest unit tests (mirror source layout)

backend/               Optional thin backend (fastapi-users only)
  app/
    routes/guest.py    POST /auth/guest + POST /auth/convert
    users.py           fastapi-users config
    models.py          User model (is_guest field)
    schemas.py         UserRead, GuestTokenResponse, ConvertRequest
  tests/               pytest suite
```

## Toolchain

- **Frontend:** pnpm + Next.js 16+ (App Router).  Before Node commands:
  `source ~/.zshrc && nvm use --silent`.
- **Backend:** uv + Python 3.12 + FastAPI + fastapi-users + Alembic.
- **Tests:** `make test-frontend` (Jest) / `make test-backend` (pytest).
- **Lint/types:** `pnpm run lint` + `pnpm run tsc` (frontend); `uv run ruff check` (backend).
- **All make commands run from project root.**
- **Dependency policy:** shared-stack versions (Next.js, React, Tailwind, Zod,
  fastapi, fastapi-users, SQLAlchemy, asyncpg, Alembic) track the `context-rocket`
  platform repo; check drift when bumping any of these.

## cr-sdk public API

```ts
import { createCRClient, resolveCRConfig } from "@/lib/cr-sdk";

const config = resolveCRConfig();   // reads NEXT_PUBLIC_* env vars
const client = createCRClient(config);

await client.ensureToken();          // provision guest JWT if needed
for await (const event of client.streamTurn(params)) { ... }
const card = await client.agentCard();
```

Key helpers re-exported from cr-sdk: `getStoredToken`, `setStoredToken`,
`clearStoredToken`, `buildTextTurnParams`, `fetchAgentCard`, `parseA2AEvent`.

## Fork workflow (forks of cr-starter)

See `docs/EXTENDING.md`.  The short version:
- Fork-owns: `app/globals.css`, `i18n/keys.ts`, `app/page.tsx`,
  `lib/cr-sdk/config.ts`, `dev-fixtures/`, `backend/app/routes/` (optional).
- Never touch: `lib/cr-sdk/index.ts`, `lib/a2a-client.ts`, `components/ui/`,
  `lib/openapi-client/`.
- Generic improvements go upstream as PRs; vertical logic stays in the fork.

## Integrating & customizing

**Read these two docs first when working in a fork:**

- `docs/integrating-with-contextrocket.md` -- what you need from the CR
  dashboard, the env-var contract (`NEXT_PUBLIC_CR_AGENT_URL`, org key,
  `NEXT_PUBLIC_CHAT_FAB_ENABLED`), what A2A/SSE gives you (JSON-RPC +
  streaming events + citations + thread continuity), demo-credential OOB
  mode, and honest failure modes (what the FAB shows on 401/rate-limit).
  Written from the real `lib/cr-sdk/` and `lib/a2a-client.ts` code.

- `docs/customizing-design.md` -- site.config identity fields, Tailwind
  token entry points in `globals.css`, component map (chat/, seo/,
  dashboard/), favicon swap, and what NOT to fork (cr-sdk transport,
  a2a-client).

A fresh agent in a fork should reach a working FAB and branded site by
reading those two docs and editing `site.config.ts` + `frontend/.env.local`.
No source spelunking required for the common case.

## How work is planned (lightweight, practical)

- **Beads is the plan of record** (work graph + traps), not markdown status:
  `bd ready` -> `bd update <id> --claim` -> implement + verify ->
  `bd close <id> -r "one line"`. Fresh clone: `brew install beads && bd
  bootstrap --yes`. Issues live in `.beads/` (JSONL mode, committed).
  Forks change `issue-prefix` in `.beads/config.yaml` to their product name.
- **Docs are durable contracts only.** AGENTS.md files = control plane;
  `docs/` = contracts that outlive sessions (EXTENDING.md, integration
  notes, design references); CHANGELOG.md = releases. NO status ledgers,
  session logs, or second backlogs in prose — git history and beads are the
  archive. If a doc goes stale, rewrite or delete it; never append updates.
- **Session discipline:** commit green slices with explicit pathspecs; a
  session ends when `bd ready` is empty or a genuine blocker names itself,
  not at a decision point resolvable from this file.
