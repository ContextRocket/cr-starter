# CR Starter style, structure, and voice checkpoint

This document is the engineering checkpoint for **`cr-starter` itself**. It
translates the company-level brand and voice canon into rules for this public,
Next.js/static-first starter. Each downstream repository has its own file with
the same name and its own baseline. This file is not a parent-owned file that
should be copied over a fork during synchronization.

It is deliberately not a second copy of the company brand canon. The source of
truth for the *why* is [`cr-company-docs`](https://github.com/ContextRocket/cr-company-docs):

- [Style guide](https://github.com/ContextRocket/cr-company-docs/blob/main/brand/style-guide.md)
  — voice registers, terminology, and visual principles;
- [Visual identity](https://github.com/ContextRocket/cr-company-docs/blob/main/brand/visual-identity.md)
  — palette, semantic tokens, typography, and accessibility intent;
- [Voice lexicon](https://github.com/ContextRocket/cr-company-docs/blob/main/voice/lexicon-and-voice.md)
  — approved language and claims discipline;
- [Starter and fork ecosystem](https://github.com/ContextRocket/cr-company-docs/blob/main/strategy/starter-and-fork-ecosystem.md)
  — repository roles, ownership, and synchronization strategy; and
- [Website content](https://github.com/ContextRocket/cr-company-docs/tree/main/website)
  — the current ContextRocket marketing structure and content decisions.

If this document and the company canon appear to disagree, follow the company
canon and update this implementation checkpoint. If a fork's real customer or
personal-brand content differs, preserve the fork's content and record the
decision in that fork; do not replace it with starter copy.

## This project's baseline

- This is the public Next.js-only starter. It has no local backend, database,
  auth, passwordless account flow, or dashboard.
- It is static-first and must remain usable in canned/demo mode without a
  network connection. Live AI connects directly from the browser to
  ContextRocket A2A.
- The reference configuration serves English, Spanish, and German, with
  English as the default locale. Locale files are optional in downstream
  projects; unused bundles must not be carried into a fork.
- The reference site enables the Markdown blog and ChatFab, disables gallery
  and testimonials, and uses system theme selection. These are demonstration
  defaults, not requirements for every fork.
- Shared UI, transport, i18n shared/app messages, the widget, gallery, and CLI
  are the reusable surfaces being demonstrated here. Forks customize config,
  site copy, Markdown, assets, theme, and narrow page composition.
- The default home page is a small marketing/demo surface. Auth, dashboard,
  healthcare, partner-port, and product-specific application pages do not
  belong in this public starter.

## The stability rule for downstream forks

Every fork has two things that must survive a parent update:

1. authored product content and stable URLs; and
2. its recognizable design language, including theme, typography, assets,
   layout composition, and chrome behavior.

The starter owns reusable behavior. A synchronization is successful only when
the parent behavior is updated *and* the fork still looks and reads like the
product it was built for. A green typecheck does not prove this.

Before changing a fork or its synchronization policy, inventory the current
baseline:

- `frontend/config/site.json`, including theme, chrome, navigation, routes, and
  feature switches;
- `frontend/blog.config.mjs`, the Markdown collection directory, and every
  authored Markdown file;
- `frontend/i18n/messages/site/` and any fork-owned overrides;
- `frontend/app/[locale]/`, fork-owned routes, and `components/custom/`;
- `frontend/public/` assets, especially logos, fonts, favicons, profile images,
  and images referenced by Markdown; and
- a current design-review capture for representative mobile and desktop pages
  in each supported theme.

Do not replace a ported or branded fork with the starter placeholder page while
“syncing.” If a design disappears, stop the synchronization, inspect the diff,
and recover the last known-good fork-owned files before doing anything else.

## Registers and voice

The page determines the register. A fork may have a different brand voice, but
it should make that choice deliberately and keep it consistent.

### Outward-facing marketing pages

- Lead with a clear human benefit and a specific audience.
- Use short sections with a visible job: what it is, what the visitor can do,
  and what they should do next.
- Prefer grounded, concrete language over generic AI or SaaS claims.
- Keep the hero strong, but do not turn every section into a sales pitch.
- Do not invent customers, logos, testimonials, metrics, founders, case studies,
  integrations, or capabilities.
- Keep “live,” “available,” “prototype,” and “coming later” distinctions honest.

For ContextRocket-facing pages, use the company terminology from the canon,
including **Context Graph**, **Brand Visibility**, **Organization**, and
**Sources**. Do not introduce internal implementation terms as customer-facing
nouns. A customer fork may use its own domain terminology when that is part of
the real brand or source-site content.

### Product, chat, and integration surfaces

- Be direct, calm, and useful.
- Explain the next action and the result the user should expect.
- Keep errors, loading states, permissions, and authentication language
  especially plain; trust surfaces are not places for playful claims.
- The ChatFab should feel like a helpful site capability, not a repeated sales
  banner. Its title, greeting, and icebreakers must come from configuration or
  localized messages.
- Use the existing shared i18n seams. Do not hardcode UI copy in a shared
  component or add a new locale bundle to a fork that does not serve it.

### Content fidelity

For a ported site such as `cr-kleos` or `cr-markmacmahon`, the original site's
content, links, images, and important URL paths are the baseline. Design
improvements are welcome when they remain recognizably on brand and do not
silently remove information. For a showcase such as `cr-gba` or `cr-luna`,
describe the actual product scenario and keep domain claims supportable.

## Page structure

The starter's default composition is a reference, not a mandate for every
fork. The reusable shape is:

```text
clear hero
  -> a small number of benefit/proof sections
  -> content-specific material (posts, gallery, podcast, or product detail)
  -> an appropriate next action
```

Use the smallest structure that tells the story. Avoid flat feature grids,
repeated cards, long walls of copy, and decorative sections with no user job.
The home page should not become a disguised product dashboard. Keep dashboard,
probe, evidence, and other application surfaces in the repositories that own
them; the public starter and `cr-landing` are not places to accumulate every
ContextRocket feature.

Stable URLs are part of structure. When a fork ports an existing site, preserve
its public paths unless there is an explicit migration decision. Configure
public discovery through `site.json.publicRoutes`; do not hand-maintain a fork
copy of sitemap, robots, or `llms.txt`.

Blog and post content is Markdown, one file per locale when translations are
needed. It is not an i18n message bundle. Keep the collection path, configured
public path, Markdown files, images, and route behavior together when changing
the content model. A missing post in a requested locale may use the dynamic
fallback behavior, but static builds must remain deterministic.

## Visual language

### Use the seams

Global visual identity belongs in `frontend/config/site.json`:

- `theme.light` and `theme.dark` semantic tokens;
- `theme.radius` and typography choices;
- logos, favicons, and other assets;
- `chrome.defaultTheme`, navigation, and visible feature switches; and
- typed site configuration exposed by `frontend/config/site.config.ts`.

Fork-specific composition belongs in `frontend/app/[locale]/page.tsx`, a
fork-owned route, or `frontend/components/custom/`. General interaction and
layout behavior belongs in the starter's shared components. If a fork needs a
different shared appearance, add a typed variant, slot, or wrapper to the
parent and then use it from the fork; do not override shared internals with
fragile selectors.

### Preserve recognizable design

- Use semantic theme tokens and the configured palette; do not scatter raw
  colors or one-off Tailwind values through pages.
- Keep light and dark themes intentional and complete. A fork may default to
  either theme, but both modes must remain legible and branded.
- Preserve logo treatment, transparent backgrounds, favicon choice, image
  crops, and font loading when synchronizing.
- Follow the Tailwind spacing/type scale unless the fork's established brand
  system is an explicit reason to differ. Check small screens first.
- Every interactive control needs visible focus, sufficient contrast, keyboard
  access, and sensible reduced-motion behavior.
- Prefer simple hierarchy and whitespace to decorative complexity. A visual
  improvement should make the page easier to understand, not merely add more
  content to it.

The company visual identity defines the rationale and token intent. This
repository implements the website-specific tokens and component seams; a fork
may tune those tokens without copying the shared component implementation.

## Ownership checkpoint

| Surface | Owner | A fork may change | Required check |
| --- | --- | --- | --- |
| Shared components, `lib/`, widget, CLI | Starter (or auth starter for auth/backend behavior) | Nothing directly; propose a seam | Parent tests, typecheck, sync policy |
| `site.json`, `blog.config.mjs`, env values | Fork | Identity, theme, chrome, routes, switches, collection name | Config validation and design review |
| Site messages and Markdown | Fork | Served locales and authored copy | i18n generation, Markdown/content build |
| Shared/app messages and generated wiring | Starter | Nothing directly; use site or override seams | i18n tests and bundle inventory |
| Routes and home composition | Fork | Product-specific pages and composition; preserve URLs | Route inventory, responsive review, build |
| `components/custom/` | Fork | Narrow product-specific visuals or behavior | Focused tests and design review |
| Public assets | Fork | Brand-owned images, logos, fonts, favicons | Asset references, dimensions, screenshots |
| Sitemap, robots, `llms.txt` builders | Starter | Public route configuration only | `publicRoutes` and generated output |

The exact path-level contract is maintained in
[`docs/fork-evolution.md`](fork-evolution.md) and the repository's
`.fork-sync.json`. Keep those two documents aligned whenever ownership moves.

## Safe change protocol

Use this protocol for a starter change and for every propagated fork update.

1. **Classify the change.** Decide whether it is shared behavior, typed
   configuration, fork content, fork composition, or a brand decision. If it is
   a brand/voice decision, consult `cr-company-docs`; if it is reusable code,
   put it in the correct parent.
2. **Capture the baseline.** Record the relevant file inventory, routes, and
   design-review screenshots before editing. For a port, compare against the
   original site or the last accepted fork baseline.
3. **Change one owner.** Do not solve a parent problem by editing the same
   shared component independently in every fork. Do not solve a fork problem by
   replacing its composition with the starter demo.
4. **Check the policy.** Run `make sync-parent-check` from a clean worktree in
   each affected repository. If ownership or a sync pattern must change, make
   that a deliberate, reviewable change first.
5. **Synchronize in order.** Use the documented chain in
   [`docs/fork-evolution.md`](fork-evolution.md). Review the staged diff and
   confirm that fork-owned content, assets, routes, theme, and custom
   composition are still present before committing.
6. **Run the product checks.** At minimum run the repository's typecheck,
   unit/build checks, content or static build where applicable, and accessibility
   checks. The public starter is static-first; auth forks also run their
   backend/frontend checks.
7. **Run a design review.** Capture representative mobile/desktop pages in
   light/dark mode. Review the screenshot metadata so each image is tied to a
   route, viewport, and theme. Check the hero, navigation, ChatFab, content
   pages, legal pages, and any changed surface.
8. **Commit by intent.** Keep a reusable parent change, a synchronization
   commit, and a fork-specific content/design change distinguishable. This makes
   recovery and future history cleanup safe.

## Recovery when a fork is damaged

If a synchronization wipes a design or content surface:

1. stop and do not “repair” it by copying the starter placeholder further;
2. save the current diff and inspect `git status`;
3. use `git log --all -- <path>` and local recovery branches/tags to find the
   last known-good fork version;
4. compare the fork-owned inventory above, including assets and Markdown;
5. restore only the fork-owned files, then rerun the design review and tests;
6. inspect the parent policy and ownership table before attempting another sync;
   and
7. record the cause in the fork's changelog or synchronization commit so the
   same path cannot be misclassified again.

Do not use a repository-wide reset or a broad merge as a recovery shortcut. A
clean history is useful only after the ownership boundaries have been verified.

## Release checkpoint

Before calling a starter or fork update complete, all of these should be true:

- [ ] the change has one clear owner;
- [ ] fork-owned content, assets, stable routes, theme, and composition were
      inventoried before and after the update;
- [ ] no fork-specific code was copied into a parent without a typed seam;
- [ ] served locale files contain only the locales the product needs;
- [ ] Markdown posts and localized Markdown fallbacks build correctly;
- [ ] generated sitemap, robots, and `llms.txt` reflect configured routes;
- [ ] typecheck, tests, build, and applicable accessibility checks pass;
- [ ] design-review screenshots cover changed surfaces at mobile and desktop
      sizes and in both themes where supported; and
- [ ] the synchronization and fork-specific commits are pushed to the correct
      remotes.
