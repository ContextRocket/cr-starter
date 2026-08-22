# Fork customization and evolution

This is the contract for keeping a fork close to `cr-starter`. A fork should
normally change data, copy, theme, assets, and page composition. General
behavior belongs in the parent.

For the required content, voice, visual, and recovery checkpoint that goes
alongside this ownership contract, read
[`style-and-structure-guide.md`](style-and-structure-guide.md).

## Ownership

Fork-owned:

- `frontend/config/site.json` and documented environment values. Its
  `publicRoutes` array is the explicit allowlist for sitemap, robots, llms.txt,
  and shared metadata discovery;
- `frontend/blog.config.mjs`, which controls the public post title/path and the
  frontend-relative Markdown collection directory (`content/posts/` by default);
- `frontend/i18n/messages/site/<locale>.ts`;
- Markdown content, including posts, privacy, and Impressum pages;
- `frontend/app/[locale]/page.tsx` and genuinely product-specific routes;
- `frontend/components/custom/`; and
- `frontend/public/` assets.

Parent-owned:

- `frontend/components/shared/`;
- `frontend/lib/` and integration transport;
- `frontend/lib/public-route-registry.ts` and `frontend/lib/public-site.ts`;
- `frontend/config/site.config.ts`;
- `frontend/app/sitemap.ts`, `frontend/app/robots.ts`, and
  `frontend/app/llms.txt/route.ts`;
- `frontend/i18n/messages/shared/` and `frontend/i18n/messages/app/`;
- generated i18n wiring;
- the ChatFab, gallery, widget, and CLI.

Do not edit parent-owned files in a fork to make a product change. Use the
configuration seam, a site message, a custom wrapper, or a fork-owned route.
If no suitable seam exists, propose it in the parent first.

## Styling and messages

Use `site.json.theme`, `theme.radius`, and `chrome` for global visual changes.
Use an exposed component variant or `className` when a fork-owned page calls
the component. Do not depend on fragile selectors against shared-component
internals. A one-off component belongs under `components/custom/`; a recurring
variation should become a parent-owned variant or slot.

For ChatFab branding, keep the main logo and the small chat mark separate when
the main logo is a wordmark. Set `assets.chatFabIcon` (and optionally
`assets.chatFabIconDark`) to a square, legible asset. The shared ChatFab falls
back to `assets.logo`/`assets.logoDark` when those fields are absent, so the
starter and ContextRocket landing site need no extra configuration.

The public starter has no auth surface. Auth message customization belongs to
`cr-auth-starter`, where a fork may override individual parent-owned shared/app
messages in `frontend/i18n/messages/overrides/<locale>.ts`. Never edit the auth
message modules directly.

## Promoting a fork change

When functionality may be reusable:

1. Keep the fork prototype and identify its product-specific inputs.
2. Move only generic behavior to the parent.
3. Add a typed configuration, variant, or adapter seam.
4. Add parent tests for the new contract.
5. Synchronize the fork from the parent.
6. Delete the fork duplicate in a separate cleanup commit.

Do not copy a complete product component, content bundle, or route into the
parent. Preserve product content and composition in the fork.

## Synchronizing the family

Synchronization is policy-driven rather than a repository-wide Git merge. This
keeps project-type configuration and product content out of the shared update
path, which is what makes the public Next.js starter safe to promote through
the server-side auth starter and its product forks.

The chain is deliberately linear:

```text
                 ┌----> cr-kleos
cr-starter ------┼----> cr-gba
                 └----> cr-markmacmahon

cr-starter -> cr-auth-starter -> cr-luna
                         └----> cr-landing
```

When `cr-starter` changes, update and commit `cr-auth-starter` first, then
update and commit each auth fork from `cr-auth-starter`:

```bash
# in cr-auth-starter
make sync-parent-check
make sync-parent
# review, test, and commit the staged parent update

# in cr-luna and cr-landing
make sync-parent-check
make sync-parent
# review, test, and commit the staged parent update
```

Each repository has a `.fork-sync.json` policy. `sync-parent-check` fetches the
configured parent and reports drift without changing files. `sync-parent`
copies only the policy's parent-owned paths and stages them for one ordinary
commit. It requires a clean worktree and never deletes fork-only files, so
project-type configuration, site content, assets, and custom composition stay
with the product. It also avoids conflict markers and merge-resolution state.

The sync script cannot recognize a design decision by itself. Before changing a
policy or adding a path to `policy.sync`, compare it against the fork-owned
inventory and the style checkpoint. A path that contains a parent copy is not
automatically parent-owned. Review the staged diff and capture the affected
surfaces before committing.

The policy is the source of truth for what may flow between repositories. If a
fork needs a new kind of variation, add a typed configuration or component seam
to the parent first, then update the policy and synchronize. Do not bypass the
policy with a broad `git merge` or by copying an entire repository.

Each policy carries the canonical parent URL, so a fresh clone can add its
fetch-only parent remote automatically; existing local sibling remotes remain
usable.

## Verification tiers

The starter carries the complete shared test suite; the forks do not need to
repeat that expensive suite for every copy or theme edit. From a public fork:

```bash
make verify-fork    # sync check, typecheck, lint, i18n, fork-owned tests
make verify-static  # the fast gate plus the actual static export
```

The fork test runner derives ownership from the parent Git tree and the fork's
sync policy. It excludes tests already present in the parent by default, while
new or explicitly preserved fork tests still run. Run `make verify` in
`cr-starter` after shared implementation changes. To opt a fork into the full
parent test set for a shared-infrastructure change, run
`CR_RUN_PARENT_TESTS=1 pnpm run test:fork`. This keeps the normal release check
proportional to the change without weakening the parent-owned contract tests.

## Public discovery contract

The public discovery implementation is parent-owned and route selection is
configuration-owned. A fork should add a route to `site.json.publicRoutes` only
when that page is intended to be public and indexable. Use `includeInLlms` for
the small set of pages that belong in the concise `llms.txt` summary. Blog
entries are discovered from the Markdown adapter and inherit the configured
blog path, including custom paths such as `/posts` or a partner-specific
segment.

The route wrappers are synchronized explicitly by every policy because they
live beside the App Router rather than under `lib/`. No fork should copy or
hand-maintain its own sitemap, robots, or llms builder. The canonical
AI-readable surface is `/llms.txt`; do not add `/llms-full.txt`.
