#!/bin/bash

source ~/.zshrc && nvm use --silent 2>/dev/null || true
PORT="${FRONTEND_PORT:-3100}" pnpm exec next dev --turbopack &

node watcher.js

wait