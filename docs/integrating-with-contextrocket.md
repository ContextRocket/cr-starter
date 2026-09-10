# Integrating with ContextRocket

The starter has two chat modes:

- `demo` (default): deterministic canned data, suitable for static hosting and design demos;
- `live`: direct browser A2A to the configured ContextRocket API base.

## Configuration

```dotenv
PUBLIC_CR_CHAT_MODE=live
PUBLIC_CR_AGENT_URL=https://app-api.contextrocket.com
PUBLIC_CONTEXTROCKET_HANDLE=contextrocket
PUBLIC_CONTEXTROCKET_API_KEY=your-publishable-api-key
```

The starter showcase uses ContextRocket's `contextrocket` organization handle.
Forks should replace it with their own published handle. The default site mode
is still `demo`, so no API request occurs until live mode is enabled.

The organization handle is the public identity of the published agent and is sent as `metadata.handle`. The website API key is sent as `X-Api-Key`; it is named `apiKey` in TypeScript and `api-key` / `data-contextrocket-api-key` in the widget contract.

ContextRocket must bind that credential to the published agent and validate the request `Origin` against its configured origin allowlist before executing A2A. Keys should be scoped, rate-limited, revocable, and unsuitable for administrative or source-management operations.

## Embed widget (primary integration)

Customer sites use `@contextrocket/embed-chat` from the public `cr-sdk` repo
(copied to `public/embed/widget.js` for local demos, or loaded from CDN later).
The widget talks to ContextRocket over browser A2A. There is no API proxy and
no in-repo chat page required for production embeds.

The public integration sends only an organization handle and website API key. It does not create a local user, mint a local token, or expose a server credential.

## Standalone widget

The widget is built and released from **`cr-sdk`** (`packages/embed-chat`).
This starter consumes it via pnpm `file:` (or CDN later). Use
`pnpm run build:widget` to refresh `public/embed/widget.js`.

Build it with:

```bash
make build-widget
```

Demo:

```html
<script src="/embed/widget.js" data-contextrocket-mode="demo" defer></script>
```

Live:

```html
<script
  src="/embed/widget.js"
  data-contextrocket-mode="live"
  data-contextrocket-api-base="https://app-api.contextrocket.com"
  data-contextrocket-handle="your-organization-handle"
  data-contextrocket-api-key="your-publishable-api-key"
  defer
></script>
```

The V1 hosted scalar appearance contract is deliberately small and typed. Use
these values once the starter customization lane has implemented and tested
them; a production dashboard snippet is the authoritative supported example:

```html
<script
  src="https://cdn.contextrocket.com/widget/v<verified-version>/widget.js"
  data-contextrocket-mode="live"
  data-contextrocket-api-base="https://app-api.contextrocket.com"
  data-contextrocket-handle="your-organization-handle"
  data-contextrocket-api-key="your-publishable-api-key"
  data-contextrocket-theme="system"
  data-contextrocket-accent="#ff2b67"
  data-contextrocket-position="bottom-right"
  defer
></script>
```

The dashboard supplies the exact versioned URL only after a starter release is
published and smoke-tested. For WordPress, paste the generated block into a
Custom HTML block or site-wide footer. For Next.js, use `next/script` with
`strategy="afterInteractive"` and the same `data-contextrocket-*` attributes.
Never put a server credential in either integration.

For a forked starter site, keep the richer configuration in typed
`siteConfig`/environment values and build the local bundle. The configuration
order is starter defaults, fork/siteConfig values, then validated installation
attributes, with the handle/API key/API base supplied at runtime. Arbitrary
CSS, HTML, JavaScript, custom endpoints, prompts, and model settings are not
part of the widget contract.

## Customer CLI

The checked-in Node/TypeScript CLI in `cli/` handles OAuth login and content
operations without adding Python or auth dependencies to the site. The
repository is the distribution channel:

```bash
pnpm --dir cli dev -- auth login
pnpm --dir cli dev -- content sync ./content cr://your-handle/content
```

For automation, set `CONTEXTROCKET_API_KEY` to an appropriately scoped org
machine credential. This variable is for the CLI/CI environment only, never
`NEXT_PUBLIC_*`. The `sources` commands remain available for explicit source
record workflows; `content sync` is the predictable folder-based default for a
starter fork.
