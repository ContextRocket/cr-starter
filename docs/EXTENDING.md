# EXTENDING.md -- Fork contract for cr-starter

This document defines the sanctioned extension seams for forks of cr-starter.
This contract applies to every vertical built on this template.

---

## What a fork owns vs. what it must not touch

### Fork-owns (change freely, never send upstream)

These files exist to be customized per vertical.  Your fork's diff lives here.

| Path | What to change |
|---|---|
| `frontend/app/globals.css` | Tailwind CSS tokens: `--primary`, `--background`, font stack, border radius. |
| `frontend/i18n/keys.ts` | Add keys for vertical-specific UI strings; translate as you grow locales. |
| `frontend/app/page.tsx` | Replace the generic home page with your branded landing page. |
| `frontend/app/layout.tsx` | Swap metadata title/description; adjust FAB injection if needed. |
| `frontend/lib/cr-sdk/config.ts` | Extend `CRConfig` if your vertical needs extra config fields. |
| `frontend/components/chat/chat-empty-state.tsx` | Brand the empty-state title and subtitle. |
| `backend/app/routes/` (whole directory) | Add vertical-specific backend routes when truly needed (not for AI -- that goes through ContextRocket). |
| `backend/app/models.py` | Add fields to `User` for vertical-specific user metadata (locale, display name, plan). |
| `backend/app/schemas.py` | Add Pydantic schemas for new routes. |
| `backend/alembic_migrations/` | Add migrations for your model additions. |
| `dev-fixtures/` | Demo/test fixture data for the vertical (JSON files loaded by fixture mode). |
| `frontend/.env.example` | Add vertical-specific env vars alongside the template defaults. |
| `README.md` | Replace with your vertical's getting-started guide. |

### Template-core (do NOT edit -- take upstream PRs instead)

These files are stable contracts shared by all forks.  Editing them makes
syncing upstream improvements painful.

| Path | Why frozen |
|---|---|
| `frontend/lib/cr-sdk/index.ts` | Public SDK surface used by all consumers. |
| `frontend/lib/cr-sdk/credentials.ts` | Guest JWT lifecycle. |
| `frontend/lib/a2a-client.ts` | A2A wire protocol. |
| `frontend/hooks/use-a2a-stream.ts` | Streaming state machine. |
| `frontend/components/ui/` | shadcn/ui components (upgrade via shadcn CLI). |
| `frontend/lib/openapi-client/` | Auto-generated; regenerate with `make regenerate-openapi`. |
| `frontend/components/chat/` (except empty-state title/subtitle) | Chat primitives shared across all forks. |
| `backend/app/users.py` | fastapi-users config. |
| `backend/app/routes/guest.py` | Guest auth contract. |
| `backend/app/config.py` | Port map and base settings. |
| `Makefile` | Shared make targets. |
| `.github/workflows/` | CI pipelines. |

---

## Extension seams

### 1. Corpus / data bootstrap hooks

ContextRocket handles the corpus.  To seed your org's context pack with
vertical-specific data on first deploy:

- Add a `backend/commands/seed_corpus.py` script that calls the ContextRocket
  API using the org machine credential.
- Document the seed command in your fork's README.
- Do not store corpus data as Postgres rows in the template DB.

### 2. Theme tokens

All design tokens live in `frontend/app/globals.css` under `:root` and
`[data-theme="dark"]`.  A complete rebrand is 10-20 lines:

```css
:root {
  --primary: 220 90% 56%;     /* your brand blue */
  --primary-foreground: 0 0% 100%;
  --background: 0 0% 100%;
  /* ... */
}
```

Do not override tokens inside component files -- keep all color decisions
in `globals.css` so the theme is swappable.

### 3. App config (persona, welcome, scope)

The cr-starter passes surface config to ContextRocket at A2A session assembly.
To set persona, welcome message, and scope for your vertical, set these env vars:

```bash
# frontend/.env.local (or hosting platform env)
NEXT_PUBLIC_CR_AGENT_URL=https://api.contextrocket.com/a2a/<your-org-id>
NEXT_PUBLIC_CR_ORG_KEY=<machine-credential-key>
```

The display name, persona prompt segment, and welcome message are configured
in the ContextRocket dashboard for the org, not in this repo.  The template
reads them from the A2A agent card (`client.agentCard()`).

For the welcome title and subtitle shown in the chat empty state, pass props
to `<ChatFab welcomeTitle="..." welcomeSubtitle="..." />` in `app/layout.tsx`.

### 4. Optional backend routes

When your vertical needs backend logic that cannot live in ContextRocket (e.g.
a custom webhook receiver, a payment callback, an analytics endpoint), add
route modules under `backend/app/routes/` and mount them in `backend/app/main.py`.

Keep these routes thin -- validation, auth, and dispatch.  Domain logic that
involves the agent or knowledge belongs in ContextRocket skills.

No LLM keys in these routes.  The template backend has no AI dependencies.

---

## Staying in sync with upstream

Use Git's remote-tracking workflow:

```bash
# In your fork -- add the upstream template as a remote
git remote add upstream https://github.com/contextrocket/cr-starter.git

# Pull upstream improvements (do NOT rebase -- merge to preserve fork history)
git fetch upstream
git merge upstream/main --no-ff
```

Merge conflicts will be concentrated in template-core files.  Because
fork-owns files rarely overlap with template-core files, merges should be
clean most of the time.

### Contribute-back path

If you fix a bug or add a feature in a template-core file:

1. Extract the change into a minimal patch (no vertical logic).
2. Open a PR against `contextrocket/cr-starter` with the generic fix.
3. Once merged upstream, pull it back into your fork via `git merge upstream/main`.

Do NOT send vertical-specific logic upstream (persona prompts, corpus seed
scripts, branding tokens, vertical routes).  Those stay in your fork forever.

---

## Checklist for a new fork

- [ ] Fork `contextrocket/cr-starter` on GitHub.
- [ ] Set the fork's public repo name to your vertical name (e.g. `cr-acme`).
- [ ] Replace `frontend/app/globals.css` design tokens.
- [ ] Replace `frontend/app/page.tsx` with your branded home page.
- [ ] Update `frontend/i18n/keys.ts` with vertical strings.
- [ ] Set `NEXT_PUBLIC_CR_AGENT_URL` + `NEXT_PUBLIC_CR_ORG_KEY` in your
      hosting platform.
- [ ] Optionally set `NEXT_PUBLIC_BACKEND_ENABLED=true` and deploy the
      FastAPI backend if you need local user accounts.
- [ ] Run `make test-frontend` + `make test-backend` -- all green.
- [ ] Update `README.md` with your vertical's getting-started guide.
