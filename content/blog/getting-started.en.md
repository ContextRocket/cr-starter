---
title: "A Simple Starting Point"
author: "The Team"
date: "2026-08-01"
image: "/images/blog/default-featured.jpg"
excerpt: "A small example of the Markdown-first publishing workflow."
featured: true
---

## Start with the content

This example post is deliberately small. Add a Markdown file to
`content/blog/`, give it a title and date in the frontmatter, and write the
article below it. The starter turns the file into a listing card, a post page,
and the related search metadata.

## Keep the workflow simple

The website structure stays in the starter. A fork normally changes its
configuration, theme, and content. That means a new article does not require a
new React component or a new translation bundle.

For another language, add another Markdown file with the same slug and a
locale suffix, such as `getting-started.es.md`. The public URL remains
`/blog/getting-started`; the language in the URL selects the matching Markdown
file.
