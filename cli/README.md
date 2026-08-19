# `contextrocket` CLI

The portable, customer CLI for ContextRocket -- a thin HTTP + OAuth (RFC 8252
loopback + PKCE) client plus local file I/O. No Python: it lives in this
repository at `cli/` as a self-contained Node/TypeScript package. Clone or fork
the starter and run the CLI from that checkout; there is no separate CDN
installer or CLI release channel.

This package is **canonical** in `cr-starter/cli/` and OpenAPI-coupled to the
ContextRocket backend.

## Install / run

**From this repository:**

```bash
pnpm install
pnpm test
pnpm build            # -> dist/ with a `contextrocket` bin

# Run without a global install:
pnpm dev auth login             # tsx (source)
node dist/bin.js auth login     # built
npx contextrocket auth login    # after `pnpm pack` / publish / link
```

## Command surface

The global target flags (`[--api-base URL]` and `[--local]`) precede the
command group on every subcommand.

```
contextrocket [--api-base URL] [--local] auth login [--no-launch-browser]
contextrocket [--api-base URL] [--local] auth print-access-token
contextrocket [--api-base URL] [--local] auth whoami
contextrocket [--api-base URL] [--local] auth logout

contextrocket [--api-base URL] [--local] content cp   <source> <dest>     # local<->cr://
contextrocket [--api-base URL] [--local] content cat  cr://<org>/<folder>/<file>
contextrocket [--api-base URL] [--local] content ls   cr://<org>[/<prefix>]
contextrocket [--api-base URL] [--local] content rm   cr://<org>/<folder>[/<file>|/]
contextrocket [--api-base URL] [--local] content sync <local-dir> cr://<org>[/<folder>]
contextrocket [--api-base URL] [--local] content query cr://<org>[/<prefix>] "<question>"  # not yet API-exposed

contextrocket [--api-base URL] [--local] sources ls --org <handle>
contextrocket [--api-base URL] [--local] sources upload --org <handle> --file PATH [--type TYPE]
contextrocket [--api-base URL] [--local] sources download --org <handle> --id ID --out PATH
contextrocket [--api-base URL] [--local] sources rm --org <handle> --id ID

contextrocket [--api-base URL] [--local] admin create-org  --slug S --name N
contextrocket [--api-base URL] [--local] admin create-user --org-slug S --email E [--password P] [--role R]

contextrocket [--api-base URL] [--local] sites publish --org <handle> --dir <built out/ dir>
```

`sites publish` tars the built static export `<dir>` (must look like a static
`out/`: has `index.html`, no `_next/server`) and streams it to the **governed**
backend endpoint `POST /api/orgs/<org>/sites/publish` with the stored Bearer
token. The backend holds the AWS creds and syncs it to the CDN so it serves at
`<handle>.cdn.contextrocket.com` -- **the customer never gets direct CDN/S3 write
access.** Fail-closed on not-logged-in / bad dir / non-2xx; progress goes to
stderr and the resulting site URL is the only stdout line (scriptable).

### Target backend

The CLI **defaults to production** (`https://app-api.contextrocket.com`). Use
`--local` to target the localhost dev backend (`http://localhost:8000`) instead.

Base URL resolution (highest precedence first):

1. `--api-base <url>` -- an explicit base always wins.
2. `CONTEXTROCKET_API_BASE` env -- wins over `--local`.
3. `--local` -- localhost:8000.
4. default -- production (`https://app-api.contextrocket.com`).

So an explicit `--api-base` (or the env var) overrides `--local`; with neither,
`--local` picks localhost and the bare default is production. `auth whoami`
prints the resolved `Target:` for the current invocation when it differs from
the base you logged into.

## Non-interactive auth (CI / GitHub Actions)

The RFC 8252 loopback flow above needs a browser, so it **cannot run headless**.
For CI, set `CONTEXTROCKET_API_KEY` to a `crk_` **org machine credential** and the
CLI uses it directly as the REST bearer -- **no browser, no
`~/.contextrocket/credentials.json`**:

```bash
CONTEXTROCKET_API_KEY=crk_... \
CONTEXTROCKET_API_BASE=https://app-api.contextrocket.com \
  pnpm --dir cli dev -- content sync ./content cr://kleos/content
```

- When `CONTEXTROCKET_API_KEY` is set (and non-empty), it takes precedence over any
  stored OAuth login and is sent as `Authorization: Bearer crk_...`.
- The backend tiered-principal layer resolves the credential AS its org and is
  **org-scoped, fail-closed**: a `crk_` key for org X may publish to org X only;
  a key for a different org → hard `401`; a revoked/unknown key → `401`.
- An empty/whitespace `CONTEXTROCKET_API_KEY` is ignored (falls back to the stored
  login), so a blank CI variable does not lock out an interactive user.

Mint a credential from an org admin (returned **once** -- store it as a repo/CI
secret): `POST /api/orgs/{org}/credentials` (`{"label": "github-actions"}`) →
`{ "plaintext": "crk_..." }`. Revoke with
`DELETE /api/orgs/{org}/credentials/{label}`.

### GitHub Actions example

```yaml
# .github/workflows/publish-site.yml
name: Publish static site
on:
  push:
    branches: [main]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"

      # Install and build the checked-in starter CLI.
      - run: pnpm install --dir cli
      - run: pnpm --dir cli build

      # Headless content publication with a crk_ org machine credential.
      - name: Publish content
        env:
          CONTEXTROCKET_API_KEY: ${{ secrets.CONTEXTROCKET_API_KEY }}
          CONTEXTROCKET_API_BASE: https://app-api.contextrocket.com
        run: |
          node cli/dist/bin.js content sync ./content cr://kleos/content
```

The CLI attaches the `CONTEXTROCKET_API_KEY` bearer to **every** org-scoped call,
so the client side is uniform. Backend `crk_` acceptance now covers the headless
**upload** surface -- `sites publish`, `content` upload (`POST
/api/orgs/{org}/content`), and source-file upload (`POST
/api/orgs/{org}/sources/uploads/file`) -- via the shared principal-first resolver
(`resolve_upload_principal` / `authorize_org_principal`, org-scoped and
fail-closed: a wrong-org `crk_` key is a 401, a chat-only credential is a 403).
The content-store **read** routes (`ls` / `query` / `download` / `rm`) and other
non-upload org routes still require the user-JWT / `X-Api-Key` (UserApiKey) path.
See `docs/ops/cli-and-credentials.md`.

## Auth flow (RFC 8252 native app)

1. Reserve an ephemeral loopback port on `127.0.0.1` (only) and build the exact
   `redirect_uri` the server will match.
2. Dynamic client registration: `POST /oauth/register` (public, PKCE, no secret).
3. Browser consent: `GET /oauth/authorize?...&code_challenge_method=S256&state=...`.
4. Loopback catches the redirect; the CSRF `state` is verified before anything
   else. A mismatch aborts WITHOUT exchanging the code.
5. Token exchange: `POST /oauth/token` (`authorization_code` grant + PKCE
   `code_verifier`) yields the MCP access + refresh pair.
6. Two-token plane: `POST /api/auth/oauth-cli-exchange` exchanges the MCP access
   token for a fastapi-users USER JWT used as the REST bearer for the
   content/admin surface. A failed exchange is surfaced (no silent fallback) but
   does not discard the successful OAuth login.

Credentials are stored in `~/.contextrocket/credentials.json` (dir `0700`, file
`0600`). `print-access-token` silently refreshes an expired access token.

## Security controls

- PKCE **S256 mandatory** (`base64url(sha256(verifier))`, padding stripped).
- Loopback bound to **`127.0.0.1` only** (never `0.0.0.0`), one-shot.
- **`state` (CSRF) verified** against the redirect before token exchange.
- Credentials **`0600`** file / **`0700`** dir; tokens never logged.
- Machine-readable **stdout stays clean** (raw token / ids / listing lines,
  un-emoji'd, pipeable). Branding + semantic emoji (🧠 content, 🦞 auth) and the
  `Powered by ContextRocket 🚀 🧠 🦞` footer go to **stderr**.
- Redirects are not auto-followed by the HTTP transports (no unexpected hop).

## OpenAPI reuse

The auth (`/oauth/*`, `/api/auth/oauth-cli-exchange`) and content/admin
(`/api/orgs/{org}/content*`, `/api/admin/*`) routes are ContextRocket-specific
and are **not** part of the cr-starter template `local-shared-data/openapi.json`
(which ships only the auth/users/operator surface). So the hey-api generated SDK
at `frontend/lib/openapi-client` does not cover them, and the CLI uses a small
typed `fetch` wrapper (`src/api-client.ts`) for exactly those routes. When a
deployment's `openapi.json` includes those paths, `frontend/lib/openapi-client/types.gen.ts`
can type the request/response bodies; the transport seam + bearer-attach contract
stay identical.

## Tests

`pnpm test` (vitest, no live network -- every side effect is an injected seam):

- `pkce.test.ts` -- S256 known-answer (RFC 7636 §B), no-padding, empty-string vector.
- `address.test.ts` -- `cr://` grammar + fail-closed traversal rejection.
- `oauth-flow.test.ts` -- register/token request shapes; **`state`-mismatch CSRF
  rejection never exchanges the code**; server-error surfacing.
- `credentials.test.ts` -- `0600`/`0700` perms, round-trip, redaction.
- `cli.test.ts` -- login stores creds + branding-to-stderr; `--no-launch-browser`
  prints URL and does NOT open the browser; `print-access-token` clean stdout;
  bearer attach + fail-closed content/admin.
```
