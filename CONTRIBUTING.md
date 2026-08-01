# Contributing to cr-starter

Thank you for considering a contribution. cr-starter is a public template so
clear, documented, and well-tested changes benefit every fork.

## Developer setup

### Prerequisites

- Node 22 (`nvm` recommended; repo ships `.nvmrc`)
- pnpm 10+
- Python 3.12 + `uv` (backend only)
- Docker Desktop (full-stack setup only)

### Clone and start

```bash
git clone https://github.com/your-org/cr-starter.git
cd cr-starter

# Frontend only (no Python/Docker required)
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local: set NEXT_PUBLIC_CR_AGENT_URL
make start-next-only   # -> http://localhost:3100

# Full stack
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
make docker-up-db && make docker-migrate-db
make start-backend     # Terminal 1
make start-frontend    # Terminal 2
```

### Run tests

```bash
make test-frontend     # Jest unit tests
make test-backend      # pytest (optional backend)
```

### Lint and type-check

```bash
cd frontend && source ~/.zshrc && nvm use --silent
pnpm run lint          # ESLint
pnpm run tsc           # TypeScript

# Backend
cd backend && uv run ruff check app tests
```

### Pre-commit hooks

```bash
cd backend && uv sync && uv run python -m pre_commit install
```

## Beads workflow (work graph)

This repo uses [Beads](https://github.com/steveyegge/beads) as the plan of
record rather than a second markdown backlog.

```bash
brew install beads       # one-time install
bd bootstrap --yes       # initialise .beads/ in the clone

bd ready                 # see unblocked tasks
bd update <id> --claim   # claim a task before starting
bd close <id> -r "..."   # mark done with a one-line reason
```

Forks should change `issue-prefix` in `.beads/config.yaml` to their own
product name.

## PR expectations

- One logical change per PR. Split unrelated fixes into separate branches.
- Tests pass: `make test-frontend` and `make test-backend` green.
- No hardcoded English strings: all user-facing text goes through `t("KEY")`
  in `frontend/i18n/keys.ts`.
- No LLM provider keys. The template delegates all AI to ContextRocket.
- No imports from sibling repos (see `AGENTS.md` hard rules).
- Match existing code style (TypeScript strict, no `any`).
- Update `CHANGELOG.md` under `## [Unreleased]` with a one-line entry.

## What belongs upstream

Generic improvements are welcome as PRs:

- Bug fixes in auth flows, the A2A client, or the dashboard shell.
- New shadcn/ui components or utility hooks.
- SEO/AEO improvements to the public site surface.
- Test coverage for core flows.
- Documentation fixes.

Vertical product logic (domain-specific pages, custom skills, brand-specific
copy) belongs in your fork, not upstream.

## Security

Please report security vulnerabilities via GitHub Security Advisories -- see
[SECURITY.md](SECURITY.md) for the responsible disclosure process.
