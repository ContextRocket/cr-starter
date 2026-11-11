# Chrome: behavior contract

## CHROME-001: Locale-aware public paths

Given a locale and a public path segment,
When navigation helpers build hrefs,
Then multi-locale sites prefix the locale,
And single-locale forks may use unprefixed paths per site config.

Never emit a bare locale with a missing trailing slash where the static export
contract requires directories.

## CHROME-002: Footer shows configured name and year

Given the configured company name and the current calendar year,
When the footer renders,
Then the copyright line includes a space between the year and the configured name.

Never concatenate year and name without a separator.

## CHROME-003: Current navigation follows route hierarchy

Given a local navigation href and the current page path,
When chrome determines the current section,
Then an exact route or nested page marks that link as current,
And in-page fragment links and external links are never marked current.

Never mark the home link current on every route or treat an anchor CTA as a page.
