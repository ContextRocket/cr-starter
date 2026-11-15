---
name: source-site-port
description: Preserve source content, routes, forms, and asset meaning when adapting an existing website into a ContextRocket static site.
---

# Porting a source website

Use this workflow when reproducing or augmenting an existing customer site.

1. Read [`docs/content-fidelity.md`](../../../docs/content-fidelity.md).
2. Inventory the source routes, copy, calls to action, forms, links, images,
   downloads, languages, and canonical URLs before changing the site.
3. Map each source item to an output route or record why it is omitted. Keep
   original URL behavior, redirects, labels, and form fields unless a reviewed
   product constraint requires a change.
4. Keep copied source content distinct from proposed improvements. Do not
   invent claims, testimonials, prices, services, or calls to action.
5. Preserve image meaning and attribution. Record source URLs for copied assets.
6. Avoid em dashes in customer-facing editorial copy. Keep language aligned
   with the active site locale.
7. Compare the built routes and page content against the inventory. Report any
   omissions or material rewrites with their reasons.

The starter's `content:check` is a punctuation safeguard where configured. It
does not replace source-to-output review.
