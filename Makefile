# Makefile — ContextRocket Starter
#
# Port isolation: all ports are defined ONCE in .env.example and referenced
# here via the same env-var names.  No literal port number appears twice.
# Load .env.example defaults only when the variable is not already set.
-include .env

BACKEND_DIR  = backend
FRONTEND_DIR = frontend
DOCKER_COMPOSE = docker compose

# Port defaults (must match .env.example)
FRONTEND_PORT      ?= 3100
BACKEND_PORT       ?= 8100
DB_PORT            ?= 5452
DB_TEST_PORT       ?= 5453
MAILHOG_SMTP_PORT  ?= 1026
MAILHOG_UI_PORT    ?= 8026

export FRONTEND_PORT BACKEND_PORT DB_PORT DB_TEST_PORT MAILHOG_SMTP_PORT MAILHOG_UI_PORT

# ---------------------------------------------------------------------------
# Help
# ---------------------------------------------------------------------------
.PHONY: help
help: ## Show available commands
	@echo "Available commands:"
	@awk '/^[a-zA-Z_-]+:/{split($$1, target, ":"); print "  " target[1] "\t" substr($$0, index($$0,$$2))}' $(MAKEFILE_LIST)

# ---------------------------------------------------------------------------
# Frontend
# ---------------------------------------------------------------------------
.PHONY: start-next-only start-frontend test-frontend

start-next-only: ## Start the Next.js frontend only (delegates AI to ContextRocket)
	@echo "Starting Next.js on port $(FRONTEND_PORT) — AI delegated to ContextRocket via A2A"
	-@lsof -ti :$(FRONTEND_PORT) | xargs kill 2>/dev/null || true
	cd $(FRONTEND_DIR) && ./start.sh

start-frontend: start-next-only ## Alias for start-next-only

test-frontend: ## Run frontend tests
	cd $(FRONTEND_DIR) && pnpm run test

# ---------------------------------------------------------------------------
# Backend
# ---------------------------------------------------------------------------
.PHONY: start-backend start-full

start-backend: ## Start the FastAPI backend (requires db profile running)
	-@lsof -ti :$(BACKEND_PORT) | xargs kill 2>/dev/null || true
	cd $(BACKEND_DIR) && ./start.sh

start-full: ## Start the full stack: Next.js + FastAPI + db + mailhog
	$(DOCKER_COMPOSE) --profile backend up -d
	$(MAKE) start-backend &
	$(MAKE) start-frontend

# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------
.PHONY: test-backend seed

test-backend: ## Run backend tests (starts test db automatically on port $(DB_TEST_PORT))
	@echo "Starting test database on port $(DB_TEST_PORT)..."
	@$(DOCKER_COMPOSE) --profile test up -d db_test
	@sleep 2
	cd $(BACKEND_DIR) && uv run python -m pytest

seed: ## Seed test data
	cd $(BACKEND_DIR) && uv run python seed_test_data.py

test-e2e: ## Run Playwright E2E tests
	cd $(FRONTEND_DIR) && pnpm test:e2e

# ---------------------------------------------------------------------------
# Pre-commit
# ---------------------------------------------------------------------------
.PHONY: install-hooks precommit

install-hooks: ## Install pre-commit hooks
	cd $(BACKEND_DIR) && uv run pre-commit install

precommit: ## Run pre-commit checks on all files
	@if [ ! -d "$(FRONTEND_DIR)/node_modules" ]; then \
		echo "Installing frontend dependencies..."; \
		cd $(FRONTEND_DIR) && pnpm install; \
	fi
	cd $(BACKEND_DIR) && uv run pre-commit run --all-files

# ---------------------------------------------------------------------------
# Docker (databases and mailhog only)
# ---------------------------------------------------------------------------
.PHONY: docker-up-db docker-up-test-db docker-up-mailhog docker-down docker-migrate-db

docker-up-db: ## Start the development database (backend profile)
	$(DOCKER_COMPOSE) --profile backend up -d db

docker-up-test-db: ## Start the test database (test profile)
	$(DOCKER_COMPOSE) --profile test up -d db_test

docker-up-mailhog: ## Start MailHog email testing server (backend profile)
	$(DOCKER_COMPOSE) --profile backend up -d mailhog

docker-migrate-db: ## Run database migrations
	cd $(BACKEND_DIR) && uv run alembic upgrade head

docker-down: ## Stop all Docker services
	$(DOCKER_COMPOSE) --profile backend --profile test down
