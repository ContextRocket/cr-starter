#!/bin/bash

PORT="${BACKEND_PORT:-8100}"

if [ -f /.dockerenv ]; then
    echo "Running in Docker on port ${PORT}"
    python -m uvicorn app.main:app --host 0.0.0.0 --port "${PORT}" --reload &
    python watcher.py
else
    echo "Running locally with uv on port ${PORT}"
    uv run python -m uvicorn app.main:app --host 0.0.0.0 --port "${PORT}" --reload &
    uv run python watcher.py
fi

wait
