# ContextRocket structural migration plan

This is a future migration plan for the private `context-rocket` repository.
It is intentionally structural: the goal is to make the repository compatible
with `cr-auth-starter` before moving or rewriting any ContextRocket product
features.

The intended end state is a private repository seeded from `cr-auth-starter`
with the ContextRocket product layered on top. `cr-starter` remains the small,
public, Next.js/static-first starter. `cr-landing` is the design and content
laboratory for the full-stack starter pattern.

## Guiding principles

- Preserve product behavior while changing repository seams.
- Keep ContextRocket functionality in the product overlay; do not add it to
  the public starter merely to make the migration easier.
- Remove `next-intl`; use the starter's module-based i18n runtime and APIs.
- Treat authentication as a shared foundation, while preserving ContextRocket's
  OAuth, API-key, HMAC, organization, operator, and machine-auth capabilities.
- Make generic-looking orchestration files thin and predictable before copying
  product code onto an auth-starter clone.
- Make each pull request independently testable and easy to revert.

## Target ownership model

The exact directories may evolve, but the ownership boundary should be clear:

```text
frontend/
  config/
    site.json                 # brand, theme, nav, legal, feature switches
    site.config.ts            # typed configuration façade
  i18n/
    keys.ts                   # shared translation API
    locale-provider.tsx       # client locale state
    messages/
      shared/                 # starter-owned cross-cutting UI
      app/                    # starter-owned auth/dashboard/app UI
      site/                   # site-owned marketing and legal content
      cr/                     # ContextRocket product copy
  components/
    shared/                   # starter-owned reusable components
    cr/                       # ContextRocket product components
  app/[locale]/
    auth/                     # starter auth surfaces
    dashboard/                # shared shell plus product routes

backend/
  app/
    core/                     # configuration, database, email, logging
    routes/                   # starter-shaped public/auth entrypoints
    modules/platform/auth/    # extended ContextRocket auth capabilities
    modules/cr/               # ContextRocket product modules
  commands/                   # stable generation and operator commands
```

This does not require moving every existing ContextRocket file immediately.
The first objective is to make ownership and import direction explicit.

## Pull-request sequence

### PR 1 -- Add the starter compatibility contract

Document the ownership map, supported commands, ports, generated artifacts,
and required environment variables. Add CI checks for:

- frontend typecheck, tests, lint, and production build;
- backend tests and migration checks;
- OpenAPI freshness;
- i18n parity and generated registry freshness; and
- forbidden `next-intl` imports once the i18n migration starts.

This PR should not change runtime behavior. It creates the safety net for the
remaining work.

### PR 2 -- Normalize configuration and content

Introduce the starter-shaped configuration façade:

- `frontend/config/site.json` owns brand data, nav, theme, assets, legal data,
  and feature switches;
- `frontend/config/site.config.ts` reads that data and environment overrides;
- backend consumers receive the same canonical legal/configuration values; and
- duplicate sources such as `frontend/content/site-config.ts` and ad-hoc legal
  configuration are removed or reduced to one-time adapters.

Keep product-specific operational configuration in the backend. This PR only
standardizes the public/site-facing configuration seam.

### PR 3 -- Introduce the starter i18n runtime

Bring the `cr-auth-starter` i18n structure into ContextRocket:

- `keys.ts` with `t`, `tArray`, `translateError`, and `setLocale`;
- generated locale registry and server registration;
- `locale-provider.tsx` with explicit client locale loaders;
- generated message module barrels; and
- ownership slices for `shared`, `app`, `site`, and `cr`.

At this stage, migrate the root layout, public pages, legal pages, and auth
pages first. Do not migrate the entire dashboard in one change.

### PR 4 -- Migrate product i18n by route group

Migrate product surfaces in separate commits, for example:

1. dashboard shell and account pages;
2. agent and A2A surfaces;
3. context graph, sources, and crawls;
4. composer, work items, and lead intelligence;
5. operator, integrations, and administrative tools; and
6. incubation surfaces that are still part of the product build.

Each slice should replace `next-intl` calls with the starter APIs, preserve the
existing copy, and pass focused tests. Delete `next-intl`, its plugin, request
configuration, navigation helpers, and lockfile entries only after the final
slice is migrated.

### PR 5 -- Normalize the authentication foundation

Align the shared auth surface with `cr-auth-starter`:

- use passwordless terminology and routes consistently;
- align auth page presentation with the configurable auth block;
- align localized email templates and backend email keys;
- preserve JWT sessions, guest flows, OAuth, API keys, HMAC signing, org
  boundaries, operator auth, and machine credentials as product extensions; and
- keep security-sensitive product auth logic in its product-owned modules.

This is an interface alignment, not a reduction of ContextRocket's auth model.

### PR 6 -- Normalize the generated API and client contract

Make the existing OpenAPI workflow match the starter contract:

- backend OpenAPI generation has one documented command;
- `local-shared-data/openapi.json` is the checked contract;
- the frontend generated client has one stable output location;
- stale generated output fails CI; and
- CLI, widget, frontend, and backend tests use the same API terminology.

Do not remove ContextRocket endpoints. The product's larger OpenAPI surface is
expected to remain in the overlay.

### PR 7 -- Normalize route, component, and module boundaries

Make starter-owned and product-owned code distinguishable without changing
feature behavior:

- shared frontend components live under `components/shared`;
- ContextRocket-specific UI lives under `components/cr` or product route
  groups;
- generic backend services stay in `core` or platform modules;
- product behavior remains under ContextRocket modules; and
- shared code does not import product-only implementation details.

ContextRocket already has useful modular structure under `backend/app/modules`;
the goal is to clarify and preserve that boundary, not flatten it.

### PR 8 -- Normalize entrypoints and deployment seams

Align the shape of the entrypoints while retaining ContextRocket's larger
deployment topology:

- `frontend/proxy.ts` owns locale and request boundary behavior;
- `frontend/next.config.mjs` follows the starter build/static conventions;
- `backend/api/index.py` and the app factory expose a predictable application
  entrypoint;
- Make targets, ports, `.env.example`, Docker files, and generated-client
  commands use consistent names; and
- worker, scheduler, crawler, and ML services remain product-specific services
  rather than being forced into the small starter runtime.

### PR 9 -- Establish the migration and fresh-install contract

Add explicit tests for:

- a fresh database installation;
- upgrade from the current ContextRocket database;
- generated OpenAPI from a clean checkout;
- frontend static and server builds; and
- the passwordless/auth flow against the local backend.

Do not casually renumber production Alembic migrations. When the new private
repository is created, either preserve the product migration chain or create a
documented fresh baseline from the tested current schema.

### PR 10 -- Apply the handle and API-key contract

After the agreed ContextRocket API contract is implemented, update all product
surfaces to use:

- `handle` for public organization identity;
- `X-Api-Key` / `apiKey` for website credentials; and
- explicit allowed-origin configuration and validation for browser keys.

This PR should cover the A2A endpoint, widget, CLI, dashboard credential
management, tests, and documentation together. No compatibility aliases are
needed for the old names.

## Final repository creation

Only after the structural PRs are complete:

1. Create a new private repository from `cr-auth-starter`.
2. Copy the isolated ContextRocket product overlay using an explicit allowlist.
3. Reconcile package manifests, lockfiles, migrations, generated clients,
   environment files, and Docker targets.
4. Run the full frontend, backend, i18n, OpenAPI, and fresh-install gates.
5. Compare the new repository's behavior against the existing ContextRocket
   deployment.
6. Reset the new repository's history only after the comparison is complete.

The copy operation should be based on ownership lists, not a blind recursive
overlay. Files such as `app_factory.py`, backend configuration, frontend route
layouts, migrations, and generated clients may contain both generic-looking
structure and product-specific behavior.

## Explicit non-goals

The early structural PRs should not:

- redesign or simplify the ContextRocket dashboard;
- migrate crawlers, jobs, MCP, agent runs, or knowledge-base behavior;
- remove product authentication capabilities;
- add ContextRocket-specific functionality to public `cr-starter`;
- change the current ContextRocket working tree without first checkpointing its
  existing uncommitted work; or
- use `cr-landing` as a reason to copy product code into shared starter files.

The test ground for design and content remains `cr-landing`, while the future
ContextRocket work focuses on making its foundation a clean overlay target.
