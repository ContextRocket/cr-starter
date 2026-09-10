# Legal: behavior contract

## LEGAL-001: Company identity completeness

Given entity type `company`,
When entity, address, represented-by, registry, and VAT are all present,
Then the identity is complete (not a placeholder incomplete set).

Given any of those required fields is missing or empty,
When completeness is evaluated,
Then the identity is incomplete.

Given registry is the explicit `PENDING_REGISTRATION` sentinel,
When completeness is evaluated,
Then registry counts as present.

Never treat a German legacy placeholder entity string as a complete modern
identity.

## LEGAL-002: Individual needs name and contact only

Given entity type `individual` with a name and contact email,
When completeness is evaluated,
Then registry and VAT are not required.

## LEGAL-003: Unincorporated needs trading name, responsible person, contact

Given entity type `unincorporated` with entity, represented-by, and contact,
When completeness is evaluated,
Then registry and VAT are not required.

## LEGAL-004: Legal pages ship boilerplate without warning banners

Given the starter legal pages (privacy, terms, cookies, impressum),
When a visitor opens them,
Then they see the boilerplate content driven by site config,
And they do not see a yellow “replace before launch” notice.

Never block reading the policy behind a placeholder alert.
