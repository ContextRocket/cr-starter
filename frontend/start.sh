#!/bin/bash

source ~/.zshrc && nvm use --silent 2>/dev/null || true
PORT="${FRONTEND_PORT:-3003}" pnpm exec next dev --turbopack &

node watcher.js

wait
