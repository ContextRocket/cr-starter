# Setup and deployment

The public starter needs Node.js, pnpm, and no backend service.

## Install and run

```bash
source ~/.zshrc && nvm use --silent
pnpm install --dir frontend
pnpm --dir frontend dev
```

The site runs with canned chat by default. Copy `frontend/config/.env.example` to `frontend/.env.local` when you need to change site toggles or connect live A2A.

## Live ContextRocket chat

```dotenv
NEXT_PUBLIC_CR_CHAT_MODE=live
NEXT_PUBLIC_CR_AGENT_URL=https://app-api.contextrocket.com
NEXT_PUBLIC_CONTEXTROCKET_HANDLE=your-organization-handle
NEXT_PUBLIC_CONTEXTROCKET_API_KEY=your-publishable-api-key
```

The organization handle selects the published agent. The API key is public and
must be origin-bound and scoped by ContextRocket. Never use a server-side
`crk_` machine key in a browser build.

## Static export and content publication

```bash
make build-static
make serve-static
```

The generated `frontend/out/` directory can be served by any static host. If
you choose to deliver it through the governed ContextRocket CDN, use the same
checked-in CLI:

```bash
pnpm --dir cli dev -- sites publish --org your-handle --dir frontend/out
```

The normal customer story is source publication from Git:

```bash
CONTEXTROCKET_API_KEY=crk_... \
  pnpm --dir cli dev -- content sync ./content cr://your-handle/content
```

## Widget and CLI

```bash
make build-widget
make test-cli build-cli
```

The widget artifact is built into the starter and served locally from
`frontend/public/embed/widget.js`. The CLI supports OAuth login, machine-key
authentication for CI, content transfer, source-file transfer, and static-site
publishing. There is no separate CDN installer for the CLI.

## Verification

```bash
make verify
```
