# Contributing to cr-starter

Thank you for considering a contribution. cr-starter is a public Astro/static
template, so clear and well-tested changes benefit every brand fork.

## Developer setup

### Prerequisites

- Node 22 (`nvm` recommended; repo ships `.nvmrc`)
- pnpm 10+

### Clone and start

```bash
git clone https://github.com/ContextRocket/cr-starter.git
cd cr-starter
source ~/.zshrc && nvm use --silent
pnpm install
pnpm dev   # http://localhost:3100
```

Sensible defaults live in `src/config/site.config.ts` and `config/site.json`.
To override connection settings, copy `.env.example` to `.env` and edit.

### Checks

```bash
pnpm run theme:check
pnpm run i18n:check
pnpm run typecheck
pnpm run build
node scripts/smoke-routes.mjs
# or:
pnpm run verify
```

## PR expectations

- One logical change per PR. Split unrelated fixes into separate branches.
- `pnpm run verify` is green.
- No hardcoded English strings: all user-facing text goes through `createT`
  / `t("KEY")` in `src/i18n/keys.ts`.
- No LLM provider keys. Live chat uses the embed widget + publishable API key.
- No imports from sibling repos (see `AGENTS.md` hard rules).
- Match existing code style (TypeScript strict, no `any`).
- Update `CHANGELOG.md` under `## [Unreleased]` with a one-line entry when
  the change is user-visible.

## What belongs upstream

Generic improvements are welcome as PRs:

- Bug fixes in chrome, legal pages, blog, attribution, or embed widget wiring.
- SEO/AEO improvements to the public site surface.
- Documentation fixes for the Astro flat layout.

Vertical product logic (domain-specific pages, custom skills, brand-specific
copy) belongs in your fork, not upstream.

## Security

Please report security vulnerabilities via GitHub Security Advisories -- see
[SECURITY.md](SECURITY.md) for the responsible disclosure process.
