#!/bin/bash

PORT="${FRONTEND_PORT:-3100}" pnpm run dev &

node watcher.js

wait