# Content fidelity for site ports

Use this process when generating or adapting pages from an existing customer
site. Treat the source as the record of what the customer chose to say. Improve
layout, navigation, accessibility, and clarity while retaining the meaning,
facts, claims, named entities, contact details, and important qualifications.

## Before writing

Create a route inventory from the source site and record every public route,
including unusual blog, podcast, campaign, and language paths. For each route,
capture the page title, headings, body sections, calls to action, links, images,
forms and their fields, downloadable files, and canonical URL. Record the
source URL and whether the page will be reproduced, intentionally omitted, or
replaced. Explain every omission or material rewrite.

Keep a source-to-output map in the project, for example
`docs/content-map.csv`, with columns for source URL, source title, destination
URL, content/assets captured, action, and reviewer notes. Compare this map
against the built site's routes before delivery. An item is not accounted for
until it has an output location or a documented reason for omission.

## Writing rules

- Preserve the customer's facts, claims, terminology, tone, and useful detail.
- Do not invent services, testimonials, prices, credentials, dates, outcomes,
  or promises. If source material is unclear, flag it for the customer.
- Prefer moving and restructuring source copy over rewriting it. Make a
  substantive rewrite only to fix a clear problem or improve accessibility,
  and note it in the content map.
- Keep every form field, consent statement, link target, and user-facing action
  accounted for when migrating a form to an SDK component.
- Preserve image meaning and attribution. Record the source URL and local
  derivative for every copied image.
- Avoid em dashes in editorial copy. Use a comma, colon, period, or parentheses
  where appropriate, then read the full sentence aloud for natural grammar.
- Keep customer-facing copy in the page's selected language. Translate only
  when that locale is part of the agreed site scope.

## Suggested generation prompt

> Rebuild the supplied page using the customer's source content and the site's
> existing design system. First inventory all headings, paragraphs, claims,
> links, calls to action, form fields, image assets, and qualifications. Preserve
> their meaning and named details. You may reorganize the layout for clearer
> hierarchy and accessibility, but do not invent facts or remove useful source
> information. Do not use em dashes. After drafting, produce a source-to-output
> mapping and list anything omitted or materially rewritten with a reason. Check
> the generated route against the source inventory before considering it done.

The repository's `pnpm run content:check` check rejects em dashes in localized
messages and blog posts. It is a simple writing safeguard, not a substitute for
the source-to-output review.
