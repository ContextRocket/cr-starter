# Publishable SDK and embeds (`cr-sdk`)

Browser integration source, tests, and package builds live in the public
[`cr-sdk`](https://github.com/ContextRocket/cr-sdk) repository. Its npm packages
are not published yet. Separately, versioned browser bundles have been
published to the ContextRocket CDN; sites can load those bundles directly
without installing the npm packages. The starter checks in generated local
artifacts, so it can also build and demo offline.

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

The package names are defined in `cr-sdk`, but the packages are not currently
available from the public npm registry. The starter therefore keeps its built
widget in `public/embed/widget.js` and its contact form bridge in
`public/embed/contact-form.js`. Normal site setup does not require either
package. Add versioned package dependencies after a verified package release
exists.

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

To refresh just one artifact, use `pnpm run build:widget` or
`pnpm run build:contact-form` from the starter checkout. The corresponding
SDK package is built by each command before its generated browser artifact is
copied into `public/embed/`.

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
theme and organization settings to that script. The contact-form bridge can be
selected with `PUBLIC_CONTEXTROCKET_CONTACT_FORM_SCRIPT_URL` or
`contactForm.scriptSrc` in `config/site.json`. Both URLs default to checked-in
local files, so offline demos continue to work. Keep external URLs pinned to an
artifact version. Do not use a mutable `latest` URL.

The published chat widget bundle URL is
`https://contextrocket.cdn.contextrocket.com/embeds/chat/v0.1.1/widget.js`.
The published contact-form browser bridge URL is
`https://contextrocket.cdn.contextrocket.com/embeds/contact-form/v0.1.0/contact-form.browser.js`.
Both were published and verified on 2026-11-11. New releases use a unique
version-specific prefix through the existing `contextrocket sites publish`
operator command. Customers can load these public URLs without an operator
token. Publishing a bundle is independent of creating an organization or
enabling live chat/form handling for a handle. A configured demo handle is only
a default value; after a production reset, a matching organization, public
policy, allowed origin, and any required publishable key must exist before the
live path can work. These browser bundles are separate from the shared brand kit's
`/brand/` assets.
