# Customizing the Design

This doc covers how to make `cr-starter` look like your product. All
customization has a defined seam. The files marked "do not fork" are the
integration transport layer -- editing them breaks future upstream syncs.

---

## 1. Brand identity via site.config.ts

`frontend/site.config.ts` is the single source of identity. Edit it first.

```ts
// frontend/site.config.ts
export const siteConfig: SiteConfig = {
  companyName: "Your Product Name",
  legalName: "Your Legal GmbH",
  tagline: "Your tagline -- becomes the home page h1.",
  description: "One-sentence description for meta tags and JSON-LD.",
  siteUrl: "https://your-domain.com",   // no trailing slash
  contactEmail: "hello@your-domain.com",
  locale: "en",
  // ...
};
```

Every page title, JSON-LD, robots, sitemap, llms.txt, and the agent card
read from `siteConfig`. Forks edit this file and nothing else for identity.

**Extending the type.** If a wave adds a new field (e.g. `allowAiCrawlers`),
add it to the `SiteConfig` interface in the same file. Grep for `siteConfig`
to find every consumer.

---

## 2. Tailwind theme and design tokens

The design system lives in `frontend/app/globals.css`. This uses Tailwind v4's
CSS-first config (no `tailwind.config.js`).

**Token entry points (safe to edit):**

```css
/* frontend/app/globals.css */

:root {
  --background: hsl(0 0% 100%);       /* page background */
  --foreground: hsl(0 0% 3.9%);       /* default text */
  --primary: hsl(0 0% 9%);            /* buttons, FAB, active states */
  --primary-foreground: hsl(0 0% 98%);
  --muted: hsl(0 0% 96.1%);
  --muted-foreground: hsl(0 0% 45.1%);
  --border: hsl(0 0% 89.8%);
  --radius: 0.5rem;                    /* border radius scale */
  /* ... */
}

.dark {
  /* dark mode overrides -- same token names */
}
```

Change `--primary` to your brand color to update the FAB, buttons, and
active highlights. The `@theme` block above maps CSS vars to Tailwind utility
classes (`bg-primary`, `text-primary-foreground`, etc.).

**Adding brand colors.** Add a custom token in `:root` and expose it via `@theme`:
```css
:root { --brand-accent: hsl(245 70% 60%); }
@theme { --color-brand-accent: var(--brand-accent); }
```
Then use `bg-brand-accent` in components.

---

## 3. Component map

```
frontend/components/
  chat/               Chat FAB, panel, composer, message list, status pills
  dashboard/          Breadcrumb, pagination, error toast, page-size selector
  seo/                Organization JSON-LD structured data
  ui/                 shadcn/ui components (do not edit -- see below)
```

**chat/**: Safe to style. The FAB position, drawer size, and color all flow
from Tailwind tokens. The welcome title and subtitle are passed as props from
`layout.tsx` or can be wired to `siteConfig`.

**dashboard/**: Shell components only -- no business logic. Safe to restyle.

**seo/**: `OrganizationJsonLd` reads from `siteConfig`. Safe to extend with
additional JSON-LD types (Person, Product) by adding new components here.

**ui/**: Generated from shadcn/ui. Upgrade via `npx shadcn@latest add <component>`.
Do not edit component internals -- changes will be overwritten on upgrade.

---

## 4. Favicon and logo swap

Replace the files in `frontend/public/`:

| File | Used by |
|---|---|
| `favicon.ico` | Browser tab |
| `favicon-16x16.png`, `favicon-32x32.png` | Legacy |
| `apple-icon-180x180.png` | iOS home screen |
| `icon-192.png`, `icon-512.png` | PWA manifest |
| `icon-192-maskable.png`, `icon-512-maskable.png` | Android adaptive icon |

Then update the paths in `siteConfig.assets` if they differ from the defaults.

The PWA manifest (`frontend/app/manifest.ts`) reads `siteConfig.assets` and
`siteConfig.companyName`, so it stays in sync automatically.

---

## 5. Copy and strings (i18n)

All user-facing strings are in `frontend/i18n/keys.ts`. Edit the values there.
The `t("KEY")` function is the only way to get a string into a component --
no hardcoded English in JSX.

```ts
// frontend/i18n/keys.ts
const messages = {
  HOME_SUBTITLE: "Your custom subtitle here.",
  CHAT_EMPTY_TITLE: "How can I help you today?",
  // ...
};
```

Post-W2c (internationalization lane), locale files will live at
`frontend/i18n/messages/{en,es,de}.ts`. Until then, `keys.ts` is the full
source of truth.

---

## 6. Legal pages

`/impressum` and `/privacy` are required for EU/DE commercial sites.

- **Impressum:** all field values come from `siteConfig.legal.*`. Fill in
  entity, address, register, vat, and representedBy -- the page renders
  automatically. Consult your legal advisor to confirm compliance.
- **Privacy policy:** auto-generated from `siteConfig.legal` and the actual
  app behaviour (auth/cookie data always; analytics sections appear only when
  `NEXT_PUBLIC_GA_MEASUREMENT_ID` or `NEXT_PUBLIC_POSTHOG_KEY` are set).
  Fill in `site.config.legal`, set your analytics keys, then review the
  generated page with qualified legal counsel before going live. Do not
  hand-edit the page file; configure `site.config.ts` instead.

---

## Do not fork these files

These files are the ContextRocket integration transport. Editing them means
you cannot accept upstream bug fixes or protocol updates without manual merge
work. Generic improvements to these files belong as upstream PRs to `cr-starter`.

| File | Reason |
|---|---|
| `frontend/lib/a2a-client.ts` | A2A wire protocol -- SSE parser, JSON-RPC builder |
| `frontend/lib/cr-sdk/index.ts` | Public cr-sdk API surface |
| `frontend/lib/cr-sdk/credentials.ts` | Guest JWT lifecycle |
| `frontend/lib/openapi-client/` | Auto-generated from backend schema |
| `frontend/components/ui/` | shadcn/ui -- upgrade, never hand-edit |

**Extension seams** (files the fork owns): `app/globals.css`, `i18n/keys.ts`,
`app/page.tsx`, `site.config.ts`, `lib/cr-sdk/config.ts`, `dev-fixtures/`,
and optional `backend/app/routes/`. See `docs/EXTENDING.md` for the full fork
contract.
