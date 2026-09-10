# ContextRocket Astro static starter

.PHONY: help install dev build preview verify build-widget test serve-static

help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-18s %s\n", $$1, $$2}'

install: ## Install site dependencies
	pnpm install

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

build-widget: ## Build embed widget into public/embed/ (needs sibling cr-sdk)
	pnpm run build:widget

serve-static: ## Serve dist/ locally after build (port 3100)
	pnpm exec serve dist -p 3100
