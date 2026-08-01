# Frontend Integration Notes

This document describes the exact contracts the backend exposes for the
frontend worker to wire up.  All items below correspond to backend changes
landed in the P3 / P5 execution lane.

---

## P3 — Guest + Conversion

### POST /auth/guest

Creates an ephemeral guest account.  No body required.  No auth required.

**Response 201**
```json
{
  "access_token": "<JWT>",
  "token_type": "bearer"
}
```

The JWT lifetime is controlled by `GUEST_TOKEN_LIFETIME_SECONDS` (default 72h).
Store the token in the same place as a regular login token (e.g. `localStorage`
or an HTTP-only cookie via a server action).

### GET /users/me (guest)

A guest token authenticates `GET /users/me` exactly like a regular token.
The response includes `is_guest: true`:

```json
{
  "id": "<uuid>",
  "email": "guest-<uuid>@guest.local",
  "is_active": true,
  "is_superuser": false,
  "is_verified": false,
  "locale": "en",
  "is_guest": true
}
```

Use `is_guest` to decide whether to show the conversion prompt.

### POST /auth/convert

Upgrades the caller's guest account to a permanent account.  The caller must
carry a valid guest Bearer JWT.  **The user id is preserved** — any
ContextRocket-side session context (threads, org bindings) survives without
re-binding.

**Request body**
```json
{
  "email": "user@example.com",
  "password": "NewPass#99"
}
```

**Response 200** — the updated `UserRead` (same shape as `/users/me`, with
`is_guest: false`).

**Error cases**
| HTTP | `detail` key | When |
|---|---|---|
| 400 | `ERROR_ALREADY_CONVERTED` | Account is already permanent |
| 400 | `ERROR_EMAIL_ALREADY_EXISTS` | Email taken by another user |
| 401 | (fastapi-users default) | No / invalid / expired token |

After a successful conversion the existing token remains valid for its
remaining lifetime.  The frontend may optionally log the user in again via
`POST /auth/jwt/login` with the new credentials to get a full-lifetime token.

### NEXT_PUBLIC_BACKEND_ENABLED guard

When `NEXT_PUBLIC_BACKEND_ENABLED=false` (Next-only mode, no local backend),
all server actions that call the backend should render an honest disabled
state rather than failing silently.  Suggested copy:

> "Account management is handled by ContextRocket. Connect via your
> ContextRocket workspace."

Do NOT render a fake loading spinner or hide the disabled state.

---

## P5 — Port map

The template runs on a fully isolated set of ports.  Use these in any
frontend config, E2E setup, or `package.json` scripts:

| Service | Port |
|---|---|
| Next.js frontend | **3100** |
| FastAPI backend | **8100** |
| Dev DB (Postgres) | **5452** |
| Test DB (Postgres) | **5453** |
| MailHog SMTP | **1026** |
| MailHog Web UI | **8026** |

The backend base URL for the generated OpenAPI client and server actions:

```
http://localhost:8100
```

Set `NEXT_PUBLIC_CR_AGENT_URL` (not a backend URL — points at ContextRocket)
to the ContextRocket A2A endpoint.  This is the only external AI dependency.
No model API keys (OpenAI, Anthropic, etc.) belong in `.env.example` or the
frontend environment.

### E2E / Playwright

Use port `8100` for the backend base URL and `3100` for the frontend base URL
in `playwright.config.ts` / E2E environment setup.

### OpenAPI client regen

Run `make regenerate-openapi` (or `pnpm run generate-client` from
`frontend/`) after any backend route / schema change.  The backend listens on
`http://localhost:8100` — update the client config base URL accordingly.
