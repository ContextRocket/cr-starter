---
title: "Building your first page"
author: "The Team"
date: "2026-07-20"
image: "/images/blog/programming-setup.jpg"
excerpt: "Create a page, keep strings translatable, and wire it into navigation without forking shared chrome."
---

## Start from the layout

Marketing pages use the shared site chrome (navbar, footer, locale handling). Add a route under `src/pages/`, compose content with existing sections or a small custom component, and the chrome stays consistent.

## Prefer configuration over forks

Brand identity, navigation links, and feature switches live in `config/site.json`. Read those values in your page instead of hardcoding a company name or tagline.

## Translate as you go

User-facing UI copy goes through `t("KEY")` and the site message files. Blog and long-form articles stay in Markdown under `content/posts/` — that keeps article language with the content, not the chrome strings.

## Wire it into navigation

Add a link in `nav.links` or `nav.footerLinks` in `site.json`. Because destinations are configured in one place, a fork can remap or hide a page without editing shared components.

## Show work with images

Cover images belong in frontmatter (`image: "/images/..."`). In-post figures use normal Markdown:

![Desk setup illustrating an in-article figure](/images/blog/programming-setup.jpg)

Credit Unsplash photographers via `content/attributions.json` when you ship third-party photos.

That loop — page, config, translation, navigation, media — is how the starter stays small while still looking finished.
