# Integrating with ContextRocket

The starter demonstrates two independent browser capabilities: A2A chat and
organization-scoped contact form. Both run on a static site; there is no local
backend or server credential.

## Chat

Demo mode is the default and uses deterministic sample responses. Live mode
connects the generated chat widget to ContextRocket over browser A2A.
The starter's configured handle is `contextrocket`, so a live starter site is
ready to address the default ContextRocket organization. Forks should set the
handle for their own organization in `config/site.json` or override it with
`PUBLIC_CONTEXTROCKET_HANDLE`.

```dotenv
PUBLIC_CR_CHAT_MODE=live
PUBLIC_CR_AGENT_URL=https://api.contextrocket.com
PUBLIC_CONTEXTROCKET_HANDLE=contextrocket
# Optional: an origin-bound website key for the deployed site.
PUBLIC_CONTEXTROCKET_API_KEY=your-origin-bound-publishable-key
```

The widget sends `SendStreamingMessage` to `/api/agent/a2a`, with the
organization handle in A2A metadata. It does not use the MCP URL for chat. A
published public handle can serve anonymous guest questions from that
organization's public-safe facts, subject to the configured demo origin and
rate limits. An optional website key is sent as `X-Api-Key`; it is a public
credential, not a secret, and must be origin-bound, scoped, rate-limited, and
revocable. Both paths resolve to the public-read capability tier: neither
exposes member-only sources or the private context graph. The handle selects
an organization but is not authorization. Member A2A requires a verified
signed-in session through the typed SDK; machine credentials stay server-side.
Never put an administrative or source-management credential in the site.

ContextRocket resolves capability scopes from the authenticated principal and
interface on the server. They are not client-supplied A2A metadata or OAuth
scopes. The organization's Brand Agent policy gates which supported skills are
advertised and which operations can execute; the API rechecks authorization
when handling each turn. Treat Agent Card skills as discovery information, not
as a permission grant. These policy checks do not change the A2A request or
stream event contract used by the widget or SDK.

For a site to answer live questions, publish the organization's guest-safe
context in ContextRocket and configure the deployed site origin there. Demo
mode remains the default so clean static builds can work offline.

The starter uses the checked-in build of `@contextrocket/embed-chat` at
`public/embed/widget.js`, so cloning and building does not require a sibling
repository. To refresh SDK-generated assets from a local `cr-sdk` checkout, run
`pnpm run build:embeds`.

The widget supports one configured brand palette, opening and follow-up
suggestions, and the bounded JSON Render response catalog described in the
SDK's README. Its installation attributes can set organization, key, mode,
palette, suggestions, and optional full-screen behavior. Use
`PUBLIC_CR_CHAT_FULLSCREEN=true` to show the expand control and
`PUBLIC_CR_CHAT_FULLSCREEN_ON_LOAD=true` for a chat-first site such as GBA.
The full-screen close control reveals the site; arbitrary CSS, HTML,
JavaScript, prompts, or model settings are not part of the embed contract.

## Contact form integration

`/contact/` is a reusable localized example. Demo mode is safe by default: it
validates the form and reports that nothing was sent or stored. To submit to an
organization:

```dotenv
PUBLIC_CR_CONTACT_FORM_MODE=live
PUBLIC_CONTEXTROCKET_HANDLE=your-organization-handle
PUBLIC_CR_AGENT_URL=https://api.contextrocket.com
```

The page uses the checked-in browser bridge generated from
`@contextrocket/sdk` and calls `submitContactFormWithAttribution`. It sends the selected intent,
name, email, optional phone, message, explicit consent, source URL, referrer
origin, bounded UTM fields, and an idempotency key. Only the page origin and
path are retained in `source_url`; query parameters other than the five UTM
fields and all fragments are omitted. The API owns the lead ID, capture status,
delivery state, and authoritative timestamps. The browser does not invent or
overwrite those values.

If a live request fails, an unchanged retry reuses its idempotency key. Editing
any form field starts a new submission and key. This lets the API safely
deduplicate a request whose response was lost in transit.

Before enabling live submission, configure the organization handle and add each
exact deployed site origin in ContextRocket under **Settings → Organization →
General → Contact form websites**. The public contact form endpoint supports
custom-origin preflight and preserves the submitted intent. It resolves the
organization from the handle and enforces that organization's contact-form
origin policy. No browser API key is required or sent, so contact-only sites
can use the form without creating a chat credential. Chat API-key rotation
does not revoke a separately registered contact-form origin.

The public npm packages are not yet available. The starter carries generated
artifacts so the public clone remains installable; the canonical source, tests,
and build process live in `cr-sdk`.

## Publishing to the ContextRocket CDN

Publishing a site to an organization's CDN is separate from browser
integration. The Node-only `@contextrocket/site-publisher` package is built in
`cr-sdk` and ready for its first npm release; it is not available from npm yet.
It calls the org-scoped publish and release-status APIs, so static sites can
use TypeScript and Node without depending on Python or GitHub Actions.

For local development while the package is unpublished, build it from an
adjacent `cr-sdk` checkout and run its CLI directly:

```bash
pnpm --dir ../cr-sdk install
pnpm --dir ../cr-sdk/packages/site-publisher run build
node ../cr-sdk/packages/site-publisher/dist/cli.js ./dist \
  --prefix blog \
  --env-file ../cr-vault/.env.prod
```

The CLI resolves the handle from `config/site.json` (`contextrocket.handle`),
or from `CR_ORG_HANDLE` / `PUBLIC_CONTEXTROCKET_HANDLE`; `--org` can override
it. The handle selects the organization but does not authorize publishing.
The CLI currently requires a private, admin-scoped machine token minted for
that organization. Keep it in the local CLI environment or a deployment secret
store; never put it in `PUBLIC_*` variables or the generated site. The shared
`contextrocket` operator token is not a customer credential. A narrower
site-publish credential and Node/TypeScript issuance flow are product follow-
ups. Until the package is published, customers can deploy the same static
`dist/` tree with their own CDN tooling.
