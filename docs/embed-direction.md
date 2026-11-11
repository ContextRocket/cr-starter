# Publishable SDK and embeds (`cr-sdk`)

Browser integration source, tests, and package builds live in the public
[`cr-sdk`](https://github.com/ContextRocket/cr-sdk) repository. Its npm packages
are not published yet. This starter includes generated browser artifacts, so
customers can install, build, and use the starter without a package release.

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
```

Future widgets are additional `packages/embed-*` in `cr-sdk`.

`pnpm run build:widget` is an optional contributor workflow and expects a
sibling `../cr-sdk` checkout. The starter itself does not import either SDK
package at runtime; the checked-in widget bundle is built from `cr-sdk`.

## CDN distribution

The checked-in `public/embed/widget.js` remains the standalone offline default.
Set `PUBLIC_CONTEXTROCKET_CHAT_WIDGET_URL` to a full versioned HTTPS URL when a
widget release is published; the site layout applies the configured widget
theme and organization settings to that script. Keep demo/customer URLs pinned
to a package version. Do not use a mutable `latest` URL.

The proposed ContextRocket CDN route is
`https://contextrocket.cdn.contextrocket.com/embeds/chat/v<package-version>/widget.js`.
The public artifact has not been released there yet. The operator can publish
the built IIFE with the existing `contextrocket sites publish` command under
the `contextrocket` organization and a version-specific prefix. Customers only
load the public URL; they do not need an operator token. This is separate from
the shared brand kit's `/brand/` assets.
