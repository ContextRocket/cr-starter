# ContextRocket Starter -- public Next.js/static-first developer commands

FRONTEND_DIR = frontend
CLI_DIR = cli
WIDGET_DIR = clients/embed-widget
FRONTEND_PORT ?= 3100

.PHONY: help install start-next-only start-frontend test-frontend build-static \
        test-cli build-cli build-widget verify serve-static design-review

help: ## Show available commands
	@awk '/^[a-zA-Z_-]+:/{split($$1, target, ":"); print "  " target[1] "\t" substr($$0, index($$0,$$2))}' $(MAKEFILE_LIST)

install: ## Install frontend, CLI, and widget dependencies
	cd $(FRONTEND_DIR) && pnpm install
	cd $(CLI_DIR) && pnpm install
	cd $(WIDGET_DIR) && pnpm install

start-next-only: ## Start the Next.js site (chat is canned unless live mode is configured)
	@echo "Starting Next.js on port $(FRONTEND_PORT) — Powered by ContextRocket 🚀"
	-@lsof -ti :$(FRONTEND_PORT) | xargs kill 2>/dev/null || true
	cd $(FRONTEND_DIR) && PORT=$(FRONTEND_PORT) ./start.sh

start-frontend: start-next-only

test-frontend: ## Run the frontend unit tests
	cd $(FRONTEND_DIR) && pnpm test

build-static: ## Build a self-contained static export
	cd $(FRONTEND_DIR) && pnpm build:static

test-cli: ## Test the customer npm CLI
	cd $(CLI_DIR) && pnpm test

build-cli: ## Typecheck and build the customer npm CLI
	cd $(CLI_DIR) && pnpm typecheck && pnpm build

build-widget: ## Build the standalone widget and copy it into frontend/public/embed
	cd $(WIDGET_DIR) && pnpm build

verify: ## Run the public starter verification suite
	$(MAKE) test-cli build-cli build-widget
	cd $(FRONTEND_DIR) && pnpm verify

serve-static: ## Serve frontend/out locally after build-static
	@echo "Serving static export at http://localhost:8080"
	@cd $(FRONTEND_DIR)/out && python3 -m http.server 8080

design-review: ## Capture design-review screenshots (no backend needed)
	cd $(FRONTEND_DIR) && source ~/.zshrc && nvm use --silent && node scripts/capture-design-review.mjs design-review
