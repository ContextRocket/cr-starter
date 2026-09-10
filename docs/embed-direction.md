# Publishable SDK and embeds (`cr-sdk`)

Browser integration for ContextRocket lives in the public **`cr-sdk`**
repository (sibling checkout: `../cr-sdk`).

## Packages

| Package | npm name | Role |
| --- | --- | --- |
| `packages/sdk` | `@contextrocket/sdk` | A2A client + `createCRClient` |
| `packages/embed-chat` | `@contextrocket/embed-chat` | Chat widget IIFE |

## Local (pnpm `file:`)

```json
"@contextrocket/sdk": "file:../cr-sdk/packages/sdk",
"@contextrocket/embed-chat": "file:../cr-sdk/packages/embed-chat"
```

(Auth/Luna use `file:../../cr-sdk/packages/...` from `frontend/`.)

```bash
cd ../cr-sdk && pnpm install && pnpm build
pnpm run build:widget   # copies chat IIFE into public/embed/widget.js
```

## Import rule

```ts
import { createCRClient, resolveCRConfig, streamTask } from "@contextrocket/sdk";
```

Future widgets are additional `packages/embed-*` in `cr-sdk`.

## CDN (later)

Versioned URLs such as `https://cdn.contextrocket.com/sdk/v1/chat.js`.
Until then, serve `public/embed/widget.js` from the site or a relative path to
the `cr-sdk` checkout.
