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

## Synchronizing a fork

After a parent change, the fork must be clean before synchronization:

```bash
git fetch starter
git merge starter/main
```

Resolve conflicts by taking the parent version for parent-owned files, keeping
the fork version for site content/config/assets, and manually merging page
composition. Then run the fork's typecheck, i18n check, tests, and build before
committing the synchronization merge.

Do not leave temporary edits to parent-owned files in a fork. The history reset
makes the parent relationship simple, but ownership discipline is what prevents
future file-level drift.
