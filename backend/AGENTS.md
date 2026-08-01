# Backend - AI Agent Guide

Read the root `AGENTS.md` first.

**IMPORTANT**: Run `make` commands from the **project root**, not from this directory.

## Scope

The backend is intentionally tiny.  It owns ONLY:
- fastapi-users: registration, login (JWT), password recovery, email verification.
- Guest auth: `POST /auth/guest` (ephemeral JWT) + `POST /auth/convert` (flip to permanent).
- User model with `is_guest` field and `locale`.
- Config, logging, CORS, email (MailHog for local dev).
- Alembic migrations.

Everything else (threads, messages, agent runs, context packs, knowledge,
org bindings) lives in ContextRocket and is reached over A2A.  Do not add
App, Thread, Message, Subscriber, Webhook, Simulator, or similar models.

## Technology

- Python 3.12, FastAPI (async)
- PostgreSQL via asyncpg + SQLAlchemy (async)
- fastapi-users for auth (JWT + password recovery)
- Alembic for migrations
- Pydantic for schemas
- **Package manager: uv** (never pip or poetry)

## Ports

| Service | Port |
|---|---|
| FastAPI (dev) | **8100** |
| Dev DB | **5452** |
| Test DB | **5453** |
| MailHog SMTP | **1026** |

These ports are isolated from the sibling `context-rocket` project.

## Directory layout

```
backend/
  app/
    main.py        FastAPI app + CORS + route mounts
    config.py      Settings (pydantic-settings; ports/secrets/mail)
    database.py    Async SQLAlchemy engine + session
    models.py      User model (is_guest, locale)
    schemas.py     UserRead, UserCreate, GuestTokenResponse, ConvertRequest
    users.py       fastapi-users config (UserManager, JWTStrategy)
    email.py       Email sending (password reset)
    routes/
      guest.py     POST /auth/guest + POST /auth/convert
  tests/           pytest suite
  alembic_migrations/
```

## Commands

```bash
make start-backend         # FastAPI on :8100 (auto-kills orphan processes)
make test-backend          # pytest (starts test DB on :5453 automatically)
make docker-up-db          # Start Postgres
make docker-migrate-db     # Apply Alembic migrations
```

## Testing conventions

- pytest with async support.  Tests live in `tests/`.
- Keep routes thin -- validation and transport only.
- Prefer pure domain logic with unit tests.
- No LLM keys, no Qdrant, no remote services in tests.

```bash
cd backend && uv run python -m pytest -x -q   # targeted run
make test-backend                              # full suite from root
```

## No LLM keys

The backend has no AI dependencies.  Do not add `ANTHROPIC_API_KEY`,
`OPENAI_API_KEY`, `GEMINI_API_KEY`, or any LLM model strings.  The template
delegates all AI to ContextRocket over A2A.

## i18n -- error keys

Backend routes return **raw i18n key strings** for all client-facing errors.
The frontend owns the English translations in `frontend/i18n/keys.ts`.

```python
# Correct
raise HTTPException(status_code=400, detail="ERROR_ALREADY_CONVERTED")
return {"message": "ACTION_CONVERTED"}

# Wrong -- do not translate in the route
raise HTTPException(status_code=400, detail=t("ERROR_ALREADY_CONVERTED"))
```

## Guest auth contract (P3)

`POST /auth/guest` -- no body, no auth.  Returns `{ access_token, token_type }`.
JWT lifetime: `GUEST_TOKEN_LIFETIME_SECONDS` (default 72h).

`POST /auth/convert` -- requires guest Bearer JWT.  Body: `{ email, password }`.
Upgrades the SAME user row in-place (user id preserved).  Returns `UserRead`.

The frontend's `lib/cr-sdk/credentials.ts` calls this endpoint when
`NEXT_PUBLIC_BACKEND_ENABLED=true` and no token is stored.

## Adding a backend feature

1. Write a failing test in `tests/`.
2. Add Pydantic schema in `schemas.py`.
3. Implement in `routes/` (keep thin) or a pure util function.
4. Run `make test-backend` to verify.
5. Update the OpenAPI schema: `make regenerate-openapi` from project root.
