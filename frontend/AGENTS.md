# Frontend - AI Agent Guide

Read the root `AGENTS.md` first.

**IMPORTANT**: Run `make` commands from the **project root**, not from this directory.

## Technology

- Next.js 16+ (App Router, not Pages Router)
- React 19+
- TypeScript (strict -- avoid `any`)
- Tailwind CSS v4 (CSS-first config in `globals.css`, no `tailwind.config.js`)
- shadcn/ui components + unified `radix-ui` package
- `lucide-react` for icons
- OpenAPI-generated type-safe API client (`@hey-api/openapi-ts`)
- Zod for runtime validation
- **Package manager: pnpm** (never npm or yarn)

## Directory layout

```
frontend/
  app/                     Next.js App Router pages
    auth/                  Login, register, forgot-password, reset-password
    chat/page.tsx          Full-page chat route (NEXT_PUBLIC_CHAT_FAB_ENABLED gate)
    dashboard/             Dashboard shell
    layout.tsx             Root layout (ChatFab injection site)
    globals.css            Tailwind v4 CSS-first config + design tokens [FORK-OWNS]
  components/
    chat/                  Chat FAB, panel, composer, message list, status pills
    dashboard/             Breadcrumb, pagination, error toast
    ui/                    shadcn/ui -- do not edit
  hooks/
    use-a2a-stream.ts      React hook wrapping A2A streaming state machine
  lib/
    cr-sdk/                Integration surface [import from here, not a2a-client]
      config.ts            CRConfig + resolveCRConfig()
      credentials.ts       Guest JWT lifecycle (ensureToken, stored token)
      index.ts             createCRClient -- public API
    a2a-client.ts          A2A wire protocol -- used only by cr-sdk
    clientConfig.ts        OpenAPI client base URL
  i18n/
    keys.ts                All user-facing strings [FORK-OWNS]
  __tests__/               Jest tests (mirror source layout)
    lib/cr-sdk/            cr-sdk unit tests (seam-fix coverage)
    hooks/                 Hook tests
    lib/                   Client and utility tests
    components/            Component tests
    actions/               Server action tests
    pages/                 Page tests
```

## Commands

```bash
make start-frontend         # Next.js on :3100
make test-frontend          # Jest unit tests
make test-e2e               # Playwright E2E (auto-starts servers)
pnpm run lint               # ESLint
pnpm run tsc                # TypeScript typecheck
pnpm run generate-client    # Regen OpenAPI client from openapi.json
```

## cr-sdk -- the integration boundary

Components and hooks **must** import from `@/lib/cr-sdk`, not from
`@/lib/a2a-client` directly.  The cr-sdk wraps the wire layer with credential
handling and a simple `createCRClient` surface.

```ts
import { createCRClient, resolveCRConfig } from "@/lib/cr-sdk";
import { buildTextTurnParams } from "@/lib/cr-sdk";  // re-exported

const client = createCRClient(resolveCRConfig());
await client.ensureToken();
for await (const event of client.streamTurn(params)) { ... }
```

The `useA2AStream` hook uses the a2a-client directly because it predates
the cr-sdk; new hook code should go through cr-sdk.

## Guest auth seam (NEXT_PUBLIC_BACKEND_ENABLED)

When `NEXT_PUBLIC_BACKEND_ENABLED=true`:
- First chat open calls `POST /auth/guest` on the local backend (port 8100).
- The returned JWT is stored in localStorage under `cr_auth_token`.
- Subsequent opens skip the network call and return the stored token.
- The token is passed as Bearer in A2A requests so ContextRocket can bind session.

When `NEXT_PUBLIC_BACKEND_ENABLED=false`:
- Guest JWT provisioning is skipped; A2A calls proceed without identity.
- User management UI renders an honest "managed by ContextRocket" state.

## Self-contained code

Never import from outside this repository (no sibling-repo or path
imports).  Everything the frontend needs lives in this repo.

## i18n

All user-facing strings live in `i18n/keys.ts`.  Use `t("KEY")` everywhere.
No hardcoded English in JSX, placeholders, aria-labels, or toasts.

```ts
import { t } from "@/i18n/keys";
<button>{t("CHAT_SEND")}</button>
```

Backend error keys come back as raw strings; translate them with `translateError()`.

## Testing conventions

- Jest + React Testing Library.  Tests live in `__tests__/`.
- Test **behavior**, not implementation details.
- Keep components thin -- extract logic into hooks or `lib/`.
- For fetch mocks, assign `global.fetch = jest.fn()` (not `jest.spyOn`).
- `afterEach(() => jest.restoreAllMocks())` to clean up.

## OpenAPI client

Auto-generated from the backend schema.  Never edit `lib/openapi-client/` by hand.

```bash
# From project root:
make regenerate-openapi
# Or client-only (schema already current):
cd frontend && pnpm run generate-client
```

## Adding a frontend feature

1. Write a failing test in `__tests__/`.
2. Create or update the page/component.
3. If it calls the backend, use the typed OpenAPI client.
4. Extract non-trivial logic into `lib/` or a hook.
5. Run `make test-frontend` to verify.
6. Add i18n keys for any new strings.
