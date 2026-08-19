# Extension and ownership guide

The starter is intentionally small. General behavior belongs here; a fork should normally supply data, copy, theme, assets, and a site-specific page composition.

## Fork-owned

| Area | Location |
|---|---|
| Brand identity, navigation, theme, assets, legal data | `frontend/config/site.json` |
| Site language and content | `frontend/i18n/messages/site/*.ts` |
| Home page composition | `frontend/app/[locale]/page.tsx` |
| Optional site-specific pages | `frontend/app/[locale]/` |
| Fork-owned images and public files | `frontend/public/` |
| Truly bespoke components | `frontend/components/custom/` |

## Starter-owned

Pull these from `cr-starter` rather than copying fork logic into them:

- `frontend/components/shared/`;
- `frontend/lib/`;
- `frontend/config/site.config.ts`;
- `frontend/i18n/messages/shared/` and `frontend/i18n/messages/app/`;
- `clients/embed-widget/`; and
- `cli/`.

## Adding a feature

1. Decide whether it is general functionality or brand content.
2. Put general behavior in a shared component, library, config seam, or i18n app slice.
3. Put site-specific copy in the fork's `site/` messages.
4. Keep demo mode functional and keep live ContextRocket access browser-direct.
5. Add focused tests and run `make verify`.

Auth, passwordless accounts, dashboards, and FastAPI are deliberately outside this public repo. Use the private `cr-auth-starter` for those concerns.
