# ContextRocket Starter -- public Next.js/static-first developer commands

FRONTEND_DIR = frontend
CLI_DIR = cli
WIDGET_DIR = clients/embed-widget
FRONTEND_PORT ?= 3003

.PHONY: help install start-next-only start-frontend test-frontend build-static \
        test-cli build-cli package-cli build-widget verify serve-static design-review \
        verify-fork verify-static sync-parent sync-parent-check sync-parent-local \
        sync-parent-preview

help: ## Show available commands
	@awk '/^[a-zA-Z_-]+:/{split($$1, target, ":"); print "  " target[1] "\t" substr($$0, index($$0,$$2))}' $(MAKEFILE_LIST)

install: ## Install frontend, CLI, and widget dependencies
	cd $(FRONTEND_DIR) && pnpm install
	cd $(CLI_DIR) && pnpm install
	cd $(WIDGET_DIR) && pnpm install

start-next-only: ## Start the Next.js site (chat is canned unless live mode is configured)
	@echo "Starting Next.js on port $(FRONTEND_PORT) — Powered by ContextRocket 🚀"
	-@lsof -ti :$(FRONTEND_PORT) | xargs kill 2>/dev/null || true
	cd $(FRONTEND_DIR) && FRONTEND_PORT=$(FRONTEND_PORT) PORT=$(FRONTEND_PORT) ./start.sh

start-frontend: start-next-only

start-frontend-fast: ## Faster dev -- compile only one language (English by default); skips other locales' pages + message trees
	@echo "Starting Next.js (fast: single-language, NEXT_PUBLIC_CR_UI_LOCALES=$(or $(CR_UI_LOCALES),fast)) on port $(FRONTEND_PORT)"
	-@lsof -ti :$(FRONTEND_PORT) | xargs kill 2>/dev/null || true
	cd $(FRONTEND_DIR) && NEXT_PUBLIC_CR_UI_LOCALES=$(or $(CR_UI_LOCALES),fast) ./start.sh


sync-parent-check: ## Check parent-owned paths against the GitHub remote (read-only, works on a dirty tree)
	node scripts/sync-parent.mjs --check

sync-parent-preview: ## Alias for sync-parent-check (preview drift without applying)
	node scripts/sync-parent.mjs --check

sync-parent: ## Restore parent-owned paths from the GitHub remote and stage the sync
	node scripts/sync-parent.mjs --apply

sync-parent-local: ## Restore parent-owned paths from a LOCAL sibling parent checkout (no push needed)
	node scripts/sync-parent.mjs --apply --from-local

test-frontend: ## Run the frontend unit tests
	cd $(FRONTEND_DIR) && pnpm test

verify-fork: ## Run the fast fork-owned verification gate
	$(MAKE) sync-parent-check
	cd $(FRONTEND_DIR) && pnpm run verify:fork
	$(MAKE) build-widget

verify-static: ## Run the public-fork gate and generate the static site
	$(MAKE) verify-fork
	$(MAKE) build-static

build-static: ## Build a self-contained static export
	cd $(FRONTEND_DIR) && pnpm build:static

test-cli: ## Test the customer npm CLI
	cd $(CLI_DIR) && pnpm test

build-cli: ## Typecheck and build the customer npm CLI
	cd $(CLI_DIR) && pnpm typecheck && pnpm build

package-cli: build-cli ## Create the installable CLI npm tarball
	cd $(CLI_DIR) && pnpm pack:tarball

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
