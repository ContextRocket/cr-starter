# Chrome: behavior contract

## CHROME-001: Locale-aware public paths

Given a locale and a public path segment,
When navigation helpers build hrefs,
Then multi-locale sites prefix the locale,
And single-locale forks may use unprefixed paths per site config.

Never emit a bare locale with a missing trailing slash where the static export
contract requires directories.

## CHROME-002: Footer shows legal name and year

Given `company.legalName` and the current calendar year,
When the footer renders,
Then the copyright line includes a space between the year and the legal name.

Never concatenate year and name without a separator.
