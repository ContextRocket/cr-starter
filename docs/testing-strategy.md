# Testing Strategy

Fast, deterministic tests that prove product behavior without a network or real
LLM/A2A calls. Behavior-first rules live in
[`testing-doctrine.md`](./testing-doctrine.md). Architecture seams:
[`../src/ARCHITECTURE.md`](../src/ARCHITECTURE.md).

## Unit is the default

- **Unit / behavior** -- Vitest in one process (`pnpm test`). Pure helpers and
  feature scenarios under `__tests__/features/`.
- **Smoke** -- `scripts/smoke-routes.mjs` after build (public discovery
  artifacts).
- **Browser** -- optional Playwright later for widget / consent journeys; not
  required for the day loop.

## Folder-first

| Location | Role |
| --- | --- |
| `features/*/BEHAVIOR.md` | Owner contracts + stable IDs |
| `__tests__/features/` | Behavior tests referencing IDs |
| `__tests__/support/bdd.ts` | Given / When / Then helpers |
| `scripts/smoke-routes.mjs` | Post-build artifact checks |

## Day loop

```bash
pnpm run check:behavior-ids
pnpm test
pnpm run verify   # full gate including build + smoke
```
