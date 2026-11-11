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

The SDK also builds `dist/lead-capture.browser.js`, a small browser bridge exposing
the public lead API and attribution helpers to static forms. Its
`createPublicLeadSubmissionController()` helper owns retry idempotency: unchanged
retries reuse the same key, edits reset the attempt, and concurrent submissions
of the same payload share one request. Forms keep their own fields and UI. The
attribution helper keeps the page origin/path, referrer origin, and bounded UTM
values while omitting unrelated query parameters and fragments. The starter
checks in the generated artifact at `public/embed/lead-capture.js`; refresh the local copies with
`pnpm run build:embeds` from a sibling `cr-sdk` checkout.

The package names are defined in `cr-sdk`, but the packages are not currently
available from the public npm registry. The starter therefore keeps its built
widget in `public/embed/widget.js` and its lead bridge in
`public/embed/lead-capture.js`. Normal site setup does not require either
package. Add versioned package dependencies after a verified package release
exists.

## Local package development

```json
"@contextrocket/sdk": "file:../cr-sdk/packages/sdk",
"@contextrocket/embed-chat": "file:../cr-sdk/packages/embed-chat"
```

(Auth/Luna use `file:../../cr-sdk/packages/...` from `frontend/`.)

```bash
cd ../cr-sdk && pnpm install && pnpm build
pnpm run build:widget   # copies chat IIFE into public/embed/widget.js
pnpm run build:lead-sdk # copies the lead-capture bridge into public/embed/
```

## Import rule

```ts
import { createCRClient, resolveCRConfig, streamTask } from "@contextrocket/sdk";
```

Future widgets are additional `packages/embed-*` in `cr-sdk`.

`pnpm run build:widget` is an optional contributor workflow and expects a
sibling `../cr-sdk` checkout. The starter itself does not import either SDK
package at runtime; the checked-in widget bundle is built from `cr-sdk`.

## CDN distribution

The browser artifacts do not yet have a published CDN release path. Until an
operator CLI workflow publishes and verifies one, serve the checked-in
`public/embed/widget.js` and `public/embed/lead-capture.js` from the site. The
ContextRocket CDN origin is `https://contextrocket.cdn.contextrocket.com`, but
do not construct an embed URL from the origin alone. The existing ContextRocket
site publisher supports prefixed static files; a versioned embed prefix and
release convention still need to be selected. Brand assets already use the
separate, stable `/brand/` namespace.
