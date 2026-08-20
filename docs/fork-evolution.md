# Fork customization and evolution

This is the contract for keeping a fork close to `cr-starter`. A fork should
normally change data, copy, theme, assets, and page composition. General
behavior belongs in the parent.

## Ownership

Fork-owned:

- `frontend/config/site.json` and documented environment values;
- `frontend/i18n/messages/site/<locale>.ts`;
- Markdown content, including blog, privacy, and Impressum pages;
- `frontend/app/[locale]/page.tsx` and genuinely product-specific routes;
- `frontend/components/custom/`; and
- `frontend/public/` assets.

Parent-owned:

- `frontend/components/shared/`;
- `frontend/lib/` and integration transport;
- `frontend/config/site.config.ts`;
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

The policy is the source of truth for what may flow between repositories. If a
fork needs a new kind of variation, add a typed configuration or component seam
to the parent first, then update the policy and synchronize. Do not bypass the
policy with a broad `git merge` or by copying an entire repository.
