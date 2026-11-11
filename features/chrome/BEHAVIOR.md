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
