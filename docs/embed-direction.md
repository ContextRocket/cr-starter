# Publishable SDK and embeds (`cr-sdk`)

Browser integration source, tests, and package builds live in the public
[`cr-sdk`](https://github.com/ContextRocket/cr-sdk) repository. Its npm packages
are not published yet. Separately, versioned browser bundles have been
published to the ContextRocket CDN; sites can load those bundles directly
without installing the npm packages. The starter checks in generated local
artifacts, so it can also build and demo offline.

Avatar presentation is independently configurable: `chat.agentAvatar` sets the
portrait shown in the conversation, while `chat.launcherAvatar` replaces the
rocket in the floating launcher. Without a launcher avatar, the brand rocket
remains the default. Optional `chat.launcherAppearance: "portrait"` displays a
standalone circular portrait with a restrained glimmer; set
`chat.launcherAvatarBackground` to a color or `transparent` for transparent art.
`chat.agentAvatarStyle: "cutout"` lets a transparent assistant portrait overlap
a soft gradient header; `chat.agentHeaderStartColor` and
`chat.agentHeaderEndColor` control its two color stops. Page-level `chatTitle` and `chatSubtitle` props localize
the name shown there. These treatments are opt-in; other sites keep the default
ContextRocket launcher and compact chat header.

## Packages

| Package | npm name | Role |
| --- | --- | --- |
| `packages/sdk` | `@contextrocket/sdk` | A2A client + `createCRClient` |
| `packages/embed-chat` | `@contextrocket/embed-chat` | Chat widget IIFE |

The SDK also builds `dist/contact-form.browser.js`, a small browser bridge
exposing the public contact-form API and attribution helpers to static forms. Its
`createContactFormController()` helper owns retry idempotency: unchanged
retries reuse the same key, edits reset the attempt, and concurrent submissions
of the same payload share one request. Forms keep their own fields and UI. The
attribution helper keeps the page origin/path, referrer origin, and bounded UTM
values while omitting unrelated query parameters and fragments. The starter
checks in the generated artifact at `public/embed/contact-form.js`; refresh the
local copies with `pnpm run build:embeds` from a sibling `cr-sdk` checkout.
`pnpm run build:contact-form` also copies the generated browser type declaration to
`src/types/contextrocket-contact-form.d.ts`, so sites use the SDK's current
`window.ContextRocketSDK` type instead of maintaining a local approximation.

The SDK now also builds `dist/site-behaviors.browser.js`. It owns consent
preference storage and migration, the consent events and banner interactions,
and the configurable Google Tag Manager, Google Analytics, PostHog, and custom
script loaders. The starter keeps the translated, theme-aware Astro banner
markup and `config/site.json` values; the generated browser artifact supplies
the shared behavior. Its generated type contract is copied to
`src/types/contextrocket-site-integrations.d.ts`.

The package names are defined in `cr-sdk`, but the packages are not currently
available from the public npm registry. The starter therefore keeps its built
widget and browser bridges in `public/embed/`. Normal site setup does not
require the SDK checkout. Add versioned package dependencies after a verified
package release exists.

## Local package development

```json
"@contextrocket/sdk": "file:../cr-sdk/packages/sdk",
"@contextrocket/embed-chat": "file:../cr-sdk/packages/embed-chat"
```

(Auth/Luna use `file:../../cr-sdk/packages/...` from `frontend/`.)

Run these commands from the starter checkout. Install the sibling SDK
dependencies, then let the starter command build each package and sync its
artifact into the directory that owns `public/embed/`:

```bash
pnpm --dir ../cr-sdk install
pnpm run build:embeds
```

The combined command builds the SDK once, builds the chat widget, then refreshes
all three generated artifacts in `public/embed/`. To refresh one artifact, use
`pnpm run build:widget`, `pnpm run build:contact-form`, or
`pnpm run build:site-behaviors` from the starter checkout.

## Import rule

```ts
import { createCRClient, resolveCRConfig, streamTask } from "@contextrocket/sdk";
import { parseAgentResponsePart } from "@contextrocket/sdk/json-render";
```

The SDK owns the bounded JSON Render v2 contract and validator used by the
chat widget. `createCRClient()` preserves validated `agent_ui` cards on typed
A2A artifact events; site renderers can bind those cards to their own UI while
the standalone widget uses the same validator and catalog. Unknown or malformed
data parts are omitted.

Future widgets are additional `packages/embed-*` in `cr-sdk`.

`pnpm run build:widget` is an optional contributor workflow and expects a
sibling `../cr-sdk` checkout. The starter itself does not import either SDK
package at runtime; the checked-in widget bundle is built from `cr-sdk`.

## CDN distribution

The checked-in `public/embed/widget.js` remains the standalone offline default.
Set `PUBLIC_CONTEXTROCKET_CHAT_WIDGET_URL` to a full versioned HTTPS URL when a
widget release is published; the site layout applies the configured widget
theme, launcher color, and organization settings to that script. The
`chat.launcherColor` option accepts `pink`, `ink`, or a contrast-checked hex
color. `chat.position` in `config/site.json` accepts `bottom-right` (the
default) or `bottom-left`; `PUBLIC_CR_CHAT_POSITION` can override it at build
time. This passes through to the SDK's `data-contextrocket-position` setting.
The contact-form bridge can be
selected with `PUBLIC_CONTEXTROCKET_CONTACT_FORM_SCRIPT_URL` or
`contactForm.scriptSrc` in `config/site.json`. Both URLs default to checked-in
local files, so offline demos continue to work. Keep external URLs pinned to an
artifact version. Do not use a mutable `latest` URL.

The published chat widget bundle URL is
`https://contextrocket.cdn.contextrocket.com/embeds/chat/v0.0.2/widget.js`.
The published contact-form browser bridge URL is
`https://contextrocket.cdn.contextrocket.com/embeds/contact-form/v0.1.1/contact-form.browser.js`.
The consent and site-integrations browser bundle URL is
`https://contextrocket.cdn.contextrocket.com/embeds/site-behaviors/v0.1.1/site-behaviors.browser.js`.
The chat bundle version 0.0.2 was published and verified on 2026-11-12; the
contact-form bridge and
site-behaviors bundle were published on 2026-11-12. New releases use a unique
version-specific prefix through the existing `contextrocket sites publish`
operator command. Customers can load these public URLs without an operator
token. Publishing a bundle is independent of creating an organization or
enabling live chat/form handling for a handle. A configured demo handle is only
a default value; after a production reset, a matching organization, public
policy, allowed origin, and any required publishable key must exist before the
live path can work. These browser bundles are separate from the shared brand kit's
`/brand/` assets.

The checked-in `public/embed/widget.js` is built from the unpublished
`@contextrocket/embed-chat@0.0.1` development source, which adds language
propagation and optional agent portraits. Keep published installs pinned to
the CDN's `v0.0.2` URL until a later public release is agreed and verified.

The contact-form adapter uses `mapContactFormData`, introduced in SDK version
`0.1.1`. The published `v0.1.1` browser bridge includes that helper and can be
pinned by sites that want the shared CDN artifact. The checked-in local bridge
remains the offline default.

The SDK `0.1.2` contact-form bridge adds `mapCustomContactAnswers` for mapping
site-owned controls to the organization's configured Leads fields. The local
starter bundle includes it. The `v0.1.2` CDN release is pending; do not pin it
until the URL is published and verified. The published `v0.1.1` URL does not
contain this mapper.

The site-behaviors bundle is checked in for static offline builds and can also
be loaded from the versioned CDN URL using
`PUBLIC_CONTEXTROCKET_SITE_BEHAVIORS_URL`. Keep the checked-in local file as
the offline default.
