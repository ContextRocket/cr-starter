# ContextRocket Astro static starter

.PHONY: help install dev build preview verify build-widget build-cli test test-cli serve-static

help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-18s %s\n", $$1, $$2}'

install: ## Install site, CLI, and ensure cr-sdk is built
	pnpm install
	pnpm --dir ../cr-sdk install
	pnpm --dir ../cr-sdk build
	pnpm --dir cli install

dev: ## Start Astro dev server
	pnpm dev

build: ## Build static site to dist/
	pnpm run build

preview: ## Preview the static build
	pnpm preview

verify: ## Behavior IDs, theme, i18n, typecheck, unit tests, build, smoke
	pnpm run verify

test: ## Run behavior / unit tests (Vitest)
	pnpm test

build-widget: ## Build embed widget into public/embed/
	pnpm run build:widget

build-cli: ## Typecheck and build the customer CLI
	pnpm --dir cli run build

test-cli: ## Test the customer CLI
	pnpm --dir cli test

serve-static: ## Serve dist/ locally after build (port 3100)
	pnpm exec serve dist -p 3100
