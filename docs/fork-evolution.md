# Fork and package model

Use `cr-starter` as the source template for a new branded Astro site. A fork
owns its routes, content, assets, locale selection, theme, and page composition.
The starter owns the default site shape and the shared static publishing
contract. A fork should not copy the starter's test suite or demo-only pages
when it does not use them.

Keep brand values and optional capability settings in `config/site.json`. The
typed `src/config/site.config.ts` seam is shared with the starter and should
stay synchronized in forks; it normalizes common settings while preserving
fork-specific fields from that JSON. A setting such as `gallery` does not add a
page or dependency unless the fork composes one.

## Three ownership layers

| Layer | Owns | Update path |
| --- | --- | --- |
| `cr-starter` | Astro template, route/SEO contract, starter-owned components, core behavior tests | GitHub template at creation; curated `.fork-sync.json` for shared source during the transition |
| `cr-sdk` | Browser SDK, A2A transport, chat widget, contact form clients, reusable UI packages | Versioned `@contextrocket/*` releases |
| Brand fork | Site-specific copy, pages, assets, design tokens, configuration | Customer/site repository |

The embed chat is already a good example: its source and behavior tests live in
`cr-sdk/packages/embed-chat`; the static site consumes its built widget. Forks
do not carry another copy of the chat test suite.

## Component package boundary

Astro and browser components that need to be shared by multiple forks should
move into a small `@contextrocket/astro` package in `cr-sdk`. Candidate modules
include a branded **Powered by** badge, organization-scoped contact form, and
cookie consent. The package should provide typed inputs, CSS-variable/slot
styling hooks, and browser-safe behavior. It should not own page routes, brand
copy, site content, or a site's overall theme.

Keep each capability in `cr-starter` until two concrete consumers establish
the public inputs. Then move the implementation and its behavior tests into
`cr-sdk`, publish it, and switch the starter and forks to the package. This
avoids publishing speculative APIs and keeps the package's contract grounded
in real customer sites.

## Forking vs. consuming a package

Use a template copy for the whole website because customers need independent
ownership of routes and visual composition. Use published SDK packages for
capabilities that should evolve in place across websites. This gives customers
a normal source repository to customize with Claude Code or Codex while shared
chat/form behavior gets one tested implementation.

During the transition, `.fork-sync.json` can copy selected production source
paths from the starter. It should exclude the starter's test suite and preserve
fork-owned configuration, pages, messages, content, and assets. Retire a sync
path when its capability becomes a versioned package.

## Test ownership

- `cr-starter` tests starter contracts and Astro component behavior.
- `cr-sdk` tests published package contracts and browser behavior.
- A fork checks its route allowlist, localization parity, static build, and
  product-specific behavior. It should not rerun the starter or SDK suites.

## Current sync workflow

Inspect drift against a sibling checkout:

```bash
node scripts/sync-parent.mjs --check --from-local=../cr-starter
```

The local mode fetches the configured parent branch from that checkout. It
includes committed changes even if they have not been pushed; uncommitted
working-tree changes are not Git fetch sources. If the parent checkout is
dirty, the command warns that it will compare against committed changes only.
Commit the parent-owned changes before applying the sync when those changes
need to reach the fork.

To apply the curated paths, make the fork worktree clean, then:

```bash
node scripts/sync-parent.mjs --apply --from-local=../cr-starter
```

Review the staged diff and verify the site before committing. The sync policy
is transitional and should remain narrow; it must never replace the fork's
brand composition or bring the starter's tests into a customer repository.
