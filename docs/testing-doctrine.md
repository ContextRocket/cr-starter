# Testing doctrine (behavior-first) — static starter

Status: foundation for `cr-starter` (Astro). Adapted from the ContextRocket
frontend doctrine in `cr-landing` / `cr-auth-starter`. Same core rules; narrower
surface (no auth, dashboard, or server-state stack).

## 0. The core rule

Test the observable outcome a user or calling boundary can see, never the
structure that produces it. Assert: rendered accessible content, a value a
caller reads, a public URL or artifact that exists, a request the widget would
send (via a Fake). Do not assert: internal helpers, mock call graphs, classes,
exact marketing copy, or private state shape.

Refactor test: if a behavior-preserving refactor breaks the test, the test was
coupled to structure.

## 1. The i18n rule

Never assert on exact English or translated strings. Assert presence of an
affordance by role/structure, or assert dynamic data (a date ISO string, a
slug, a path). Message files change constantly; copy-bound tests are brittle.

## 2. Layers and seams

| Layer | Assert |
| --- | --- |
| Pure helper | return value / decision for synthetic inputs |
| Content loader | post meta a page would render (slug, date, image path present/absent) |
| Public discovery | sitemap/robots/llms/security artifacts after build (smoke) |
| React island | role + name outcomes with providers mocked |
| Embed widget | launcher open/close, single visible icon, panel presence |

## 3. Kill-list

- K1 copy / i18n-string assertions → role / structure / dynamic values
- K2 markup snapshots → specific observable facts; human design review for visuals
- K3 internal `vi.mock` + `toHaveBeenCalledWith` on in-repo modules → Fake at the
  boundary; only egress Fakes may assert calls
- K4 `getByTestId` / class selectors as default → role + name; testid last resort
- K5 framework re-tests (Astro/Vite/Tailwind internals) → our decision at our seam

## 4. Tiered rigor

- Tier 0: pure presentational chrome with no branches
- Tier 1: pure helpers, path builders, legal completeness, blog locale resolution
- Tier 2: multi-step journeys (cookie consent → analytics gate; widget open →
  send) — prefer Playwright when a real browser is required

## 5. BDD in Vitest (no Cucumber)

Use `__tests__/support/bdd.ts` (`scenario`, `given`, `when`, `thenStep`). No
`.feature` compiler. Feature contracts live in `features/*/BEHAVIOR.md` with
stable IDs; `pnpm run check:behavior-ids` fails on duplicates.

## 6. Suite layout

```text
features/<name>/BEHAVIOR.md     # owner-readable contract
__tests__/support/bdd.ts        # Given/When/Then helpers
__tests__/features/<name>/      # behavior tests referencing IDs
__tests__/lib/                  # narrow pure-helper tests (optional)
scripts/smoke-routes.mjs        # post-build public artifacts (Tier 2 light)
```

Network is forbidden in unit tests. Do not mock `fetch` per test; inject a port.

## 7. Verify gate

`pnpm run verify` runs theme + i18n + typecheck + unit behavior tests + build +
smoke routes. Keep the unit suite fast. No coverage-percentage gate. No
snapshot files.
