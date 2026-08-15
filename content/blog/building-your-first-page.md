---
title: "Building Your First Page"
author: "The Team"
date: "2026-07-20"
image: "/images/blog/programming-setup.jpg"
excerpt: "Walk through creating a new page, wiring it into navigation, and keeping every user-facing string translatable from day one."
featured: true
---

## Start from the layout

Every page in this starter inherits a shared layout that provides the site
navbar, footer, and locale handling. You rarely need to think about chrome —
add your page under the locale route and it appears with the rest of the site.

## Add your content

A page is a server component that returns markup. Keep a single `<h1>`, use
semantic landmarks, and read brand identity from the site config rather than
hardcoding a company name or tagline.

```tsx
export default function AboutPage() {
  return (
    <main>
      <h1>About us</h1>
      <p>Tell your story here.</p>
    </main>
  );
}
```

## Translate as you go

User-facing text goes through the translation helper so it works across every
launch locale. Add the key once, provide copy for each language, and the string
resolves from the URL locale automatically.

## Wire it into navigation

Point a navigation link at your new page through the site config. Because links
are configured in one place, a fork can remap or hide any destination without
editing component code.

That is the whole loop: layout, content, translation, navigation. Repeat it for
every page and the site grows consistently.
