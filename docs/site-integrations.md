# Site integrations

Add browser integrations in `config/site.json` under `integrations`. This is a
keyed map, so a site can keep one stable name per provider and add trusted
script extensions without editing the shared layout.

```json
{
  "features": { "cookieConsent": "auto" },
  "integrationConsentMode": "auto",
  "integrations": {
    "tag-manager": {
      "provider": "google-tag-manager",
      "containerId": "GTM-ABC123",
      "consentCategory": "marketing"
    },
    "analytics": {
      "provider": "google-analytics",
      "measurementId": "G-ABC1234567",
      "consentCategory": "analytics"
    },
    "product-analytics": {
      "provider": "posthog",
      "projectKey": "public-project-key",
      "apiHost": "https://us.i.posthog.com",
      "consentCategory": "analytics"
    },
    "support-widget": {
      "provider": "script",
      "src": "https://support.example.com/widget.js",
      "consentCategory": "functional",
      "attributes": { "data-site-id": "public-site-id" }
    }
  }
}
```

Sites that migrate an existing consent manager can preserve its copy by
setting optional `features.cookieConsentCopy` strings and category labels in
`config/site.json`. Omitted strings use the localized starter defaults. The
four category keys are `necessary`, `functional`, `analytics`, and `marketing`.
Category copy accepts `label`, `description`, and the optional
`alwaysActiveLabel`; `manageFooter` can differ from the banner’s `manage` label.

Built-in providers are `google-tag-manager`, `google-analytics`, and
`posthog`. The `script` provider is the extension seam: give each script a
stable key, an HTTPS `src`, an optional consent category, and optional HTML
attributes. Inline code is not accepted. External scripts execute with the
same page access as site code, so only add scripts from providers the site
owner trusts.

The identifiers above are browser-visible project/container IDs, not secrets.
The small PostHog bootstrap follows [PostHog's JavaScript snippet](https://posthog.com/docs/libraries/js)
and loads the browser SDK from PostHog only when PostHog is configured and its
consent category is allowed. A blank integrations map loads no third-party
tracking scripts.

## Consent

With `features.cookieConsent` set to `auto` (the starter default) and
`integrationConsentMode` set to `auto`, the consent dock appears when an enabled
optional integration is configured. With no such integrations, no prompt is
shown. Set the feature to `on` to always prompt, or `off` to explicitly disable
the built-in prompt. Optional integrations wait until the visitor grants their
category. The banner offers accept, decline, and category settings; visitors can
reopen settings from the site footer. Necessary integrations always load. A
provider with no `consentCategory` defaults to `analytics`, except Google Tag
Manager, which defaults to `marketing` because its container may run many kinds
of tags.

The chat widget is hidden while this prompt is unresolved, so the two floating
surfaces are never shown together. Any recorded choice (accept, decline, or
custom preferences) releases the widget. Necessary login/session cookies and
storage remain separate from optional analytics and functional preferences;
classify optional site features under their actual purpose rather than treating
every cookie as one blanket choice.

For an authenticated ContextRocket experience, cookies required to maintain the
user's requested sign-in, session security, or CSRF protection belong to the
necessary category. They are not optional functional preferences and must not
be gated on an analytics choice. The `functional` category is for optional
features such as remembering a visitor's chosen interface preferences.

`integrationConsentMode` can be:

- `auto` -- use the built-in banner when `features.cookieConsent` is `on` or
  `auto` detects an enabled optional integration; otherwise load configured
  integrations immediately. This is the default.
- `always` -- load configured integrations immediately and do not show the
  built-in consent banner or settings link.
- `external` -- wait for consent from another consent manager and do not show
  the built-in consent banner or settings link. Existing ContextRocket cookie
  choices are ignored in this mode. A custom
  consent manager script can use `consentCategory: "necessary"` and dispatch
  `cr:consent-change` with a `preferences` object containing `necessary`,
  `functional`, `analytics`, and `marketing` booleans. The chat widget remains
  hidden until that event too; dispatch the current saved choice after the
  manager initializes, as well as after each visitor choice.

When consent is revoked after a provider has loaded, the starter updates
Google Consent Mode and opts PostHog out. A custom script cannot be unloaded;
extension scripts should listen for `cr:consent-change` and stop their own
optional collection when a category is withdrawn.

If using Google Tag Manager to deploy Google Analytics or PostHog, avoid
configuring the same provider directly as well unless duplicate events are
intentional. Google Tag Manager can run third-party tags without a site code
change; manage those tags and their consent requirements in the GTM workspace.
