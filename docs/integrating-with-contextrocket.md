# Integrating with ContextRocket

The starter demonstrates two independent browser capabilities: A2A chat and
organization-scoped contact form. Both run on a static site; there is no local
backend or server credential.

## Chat

Demo mode is the default and uses deterministic sample responses. Live mode
connects the generated chat widget to ContextRocket over browser A2A.
The starter's configured handle is `contextrocket`. This is only the target
identifier: it does not create or provision an organization, enable its public
A2A policy, or publish context. In a fresh or reset environment, verify that
the organization exists and is configured before switching a site to live
mode. Forks should set their own organization's handle in `config/site.json`
or override it with `PUBLIC_CONTEXTROCKET_HANDLE`.

```dotenv
PUBLIC_CR_CHAT_MODE=live
PUBLIC_CR_AGENT_URL=https://api.contextrocket.com
PUBLIC_CONTEXTROCKET_HANDLE=contextrocket
# Optional; defaults to company. Use person for a Personal Brand identity.
PUBLIC_CONTEXTROCKET_SUBJECT_KIND=company
# Optional: an origin-bound website key for the deployed site.
PUBLIC_CONTEXTROCKET_API_KEY=your-origin-bound-publishable-key
```

The corresponding human-facing identity card uses the same typed identity:
`https://contextrocket.com/company/{handle}` or
`https://contextrocket.com/person/{handle}`. The API endpoints below share
that identity prefix.

The widget sends `SendStreamingMessage` to the configured typed endpoint:
`/company/{handle}/a2a` or `/person/{handle}/a2a`. The handle and identity kind
select the organization on the server. It does not use the MCP URL for chat. A
handle can serve anonymous guest questions only when its organization exists,
the organization's public A2A policy allows answering, and public-safe context
is available. Configure the permitted site origin and rate limits in
ContextRocket as required by that policy. An optional website key is sent as
`X-Api-Key`; it is a public credential, not a secret, and must be origin-bound,
scoped, rate-limited, and revocable. Both paths resolve to the public-read
capability tier: neither exposes member-only sources or the private context
graph. The handle selects an organization but is not authorization. Member A2A
requires a verified signed-in session through the typed SDK; machine
credentials stay server-side. Never put an administrative or source-management
credential in the site.

ContextRocket resolves capability scopes from the authenticated principal and
interface on the server. They are not client-supplied A2A metadata or OAuth
scopes. The organization's Brand Agent policy gates which supported skills are
advertised and which operations can execute; the API rechecks authorization
when handling each turn. Treat Agent Card skills as discovery information, not
as a permission grant. These policy checks do not change the A2A request or
stream event contract used by the widget or SDK.

Use `GET https://api.contextrocket.com/company/{handle}/agent-card.json` or
`GET https://api.contextrocket.com/person/{handle}/agent-card.json` for a
handle-specific public card. The API's generic
`/.well-known/agent-card.json` describes ContextRocket itself and does not
select an organization. The embed widget reads the handle-specific card to
populate its opening suggestions; A2A turns go directly to the matching typed
`/company/{handle}/a2a` or `/person/{handle}/a2a` endpoint.

For a site to answer live questions, create the organization, enable its public
A2A answering policy, make guest-safe context available in ContextRocket, and
configure the deployed site origin there as required by the policy. The handle
alone is never evidence that these steps have been completed. Demo mode remains
the default so clean static builds can work offline, including when no
ContextRocket organization has been provisioned.

### Agent Card on a verified site origin

The static build also emits `/.well-known/agent-card.json` as a standalone
fallback. It points to the ContextRocket A2A endpoint but cannot reflect the
organization's current policy-filtered skills or optional signed trust
metadata on the live organization card. When a site origin is verified in
ContextRocket, expose the matching typed card and A2A URLs through the CDN or
reverse proxy, preserving the original host in `Host` or `X-Forwarded-Host`.
The API returns the authoritative organization card for that verified origin.
Do not cache A2A requests or streaming responses. The static
`/.well-known/agent-card.json` remains a build-time fallback and must not be
treated as proof of the organization's current enabled capabilities.

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

Before enabling live submission, create the organization, configure its handle,
and add each exact deployed site origin in ContextRocket under **Settings →
Organization → General → Contact form websites**. The public contact form
endpoint supports custom-origin preflight and preserves the submitted intent.
It resolves the organization from the handle and enforces that organization's
contact-form origin policy. No browser API key is required or sent, so contact-only sites
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
