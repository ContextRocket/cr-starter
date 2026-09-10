# Setup and deployment

The public Astro starter needs Node.js and pnpm. No backend service.

## Install and run

```bash
source ~/.zshrc && nvm use --silent
pnpm install
pnpm dev   # http://localhost:3100
```

Brand forks use their own ports (3101+, see AGENTS.md).

Demo chat is the default. Copy `.env.example` to `.env` for live embed settings:

```dotenv
PUBLIC_CR_CHAT_MODE=live
PUBLIC_CR_AGENT_URL=https://app-api.contextrocket.com
PUBLIC_CONTEXTROCKET_HANDLE=your-handle
PUBLIC_CONTEXTROCKET_API_KEY=your-publishable-api-key
```

## Static build and CDN deploy

```bash
pnpm run build    # writes dist/ (+ blog path alias + single-locale flatten)
make serve-static # http://localhost:3100
```

Upload `dist/` to Cloudflare Pages, CloudFront, S3, or any static host.

## Embed widget

```bash
pnpm run build:widget
# artifact: public/embed/widget.js
```

Direction for a future shared embed repo: [embed-direction.md](embed-direction.md).
