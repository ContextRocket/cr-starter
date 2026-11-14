# Extension and ownership guide

The starter is intentionally small. General behavior belongs here; a fork should normally supply data, copy, theme, assets, and a site-specific page composition.

## Fork-owned

| Area | Location |
|---|---|
| Brand identity, navigation, theme, and assets | `config/site.json` |
| Site language and content | `src/i18n/messages/site/*.ts` |
| Home page composition | `src/pages/[locale]/index.astro` (and flat `src/pages/index.astro` for single-locale) |
| Optional site-specific pages | `src/pages/` and `src/components/custom/` |
| Fork-owned images and public files | `public/` |
| Truly bespoke components | `src/components/custom/` |

## Starter-owned

Pull these from `cr-starter` rather than copying fork logic into them (see `.fork-sync.json`):

- `src/components/chrome/`, shared page shells under `src/components/pages/`;
- `src/lib/`;
- `src/config/site.config.ts`;
- `src/i18n/messages/shared/` and `src/i18n/messages/app/`;
- public discovery routes (`sitemap`, `robots`, `llms`, `feed`, `.well-known`).

Browser SDK and embeds live in the sibling public repo **`cr-sdk`**
(`@contextrocket/sdk`, `@contextrocket/embed-chat`), not in this starter.

## Linking to the organization's Grounding Page

Use the shared `GroundingPageLink` when a generated landing page should point
visitors to the organization's public facts surface. The destination is built
from `contextrocket.handle` and `contextrocket.subjectKind` in `config/site.json`
and follows the typed `/company/{handle}/facts` or `/person/{handle}/facts`
route. The visible label remains page-owned and localized:

```astro
---
import GroundingPageLink from "@/components/chrome/GroundingPageLink.astro";
---

<GroundingPageLink label="Learn about our organization" />
```

For a verified customer-domain proxy, pass its public origin explicitly. Do not
use an API URL or redirect protocol clients between the web and API origins.
The component links to the Grounding Page; it does not copy or recreate its
governed facts.

## Adding a feature

1. Decide whether it is general functionality or brand content.
2. Put general behavior in a shared component, library, config seam, or i18n app/shared slice.
3. Put site-specific copy in the fork's `site/` messages.
4. Keep static builds usable offline; live ContextRocket access stays browser-direct via the embed widget.
5. Run `make verify` (theme, i18n, typecheck, build, smoke).

## Composing a landing page with contact capture

Keep a generated page's layout and source-specific copy in its page file, then
reuse `ContactFormSection` for the common heading, card, and SDK-backed form
pattern. It is optional; use `ContactForm` directly when the surrounding layout
needs a different composition:

```astro
---
import ContactFormSection from "@/components/contact/ContactFormSection.astro";
import GroundingPageLink from "@/components/chrome/GroundingPageLink.astro";
import type { SupportedLocale } from "@/i18n/locales";

interface Props { locale: SupportedLocale }
const { locale } = Astro.props;
---

<ContactFormSection
  locale={locale}
  id="inquiry"
  idPrefix="landing-inquiry"
  eyebrow="Residency services"
  title="Tell us what you need"
  description="The page provides the customer-approved inquiry copy."
/>
<p class="mt-6 text-sm text-text-secondary">
  Want to learn more? <GroundingPageLink label="Read our Grounding Page" />
</p>
```

`ContactFormSection` accepts customer-owned copy, an optional eyebrow and
section ID, and a class override. Use `headingAs="h1"` when it is the page's
main heading; embedded sections default to `h2`. The form reads its demo/live
mode, organization, API origin, SDK URL, and localized labels from starter
configuration. Demo mode shows its “not sent” notice before fields. `idPrefix`
keeps labels and controls unique when a page contains more than one form. Add
optional source-specific questions through the named slot; `data-cr-custom-answer`
maps each existing form field to a key in the organization's configured contact
schema:

```astro
<ContactFormSection
  locale={locale}
  idPrefix="residency-inquiry"
  title="Plan your move"
>
  <label slot="custom-fields" class="block text-sm font-medium">
    Where are you planning to live?
    <select
      class="mt-2 block w-full rounded-xl border border-input bg-background px-4 py-3"
      name="residency-area"
      data-cr-custom-answer="residency_area"
      required
    >
      <option value="">Choose an area</option>
      <option value="madrid">Madrid</option>
      <option value="other">Another area</option>
    </select>
  </label>
</ContactFormSection>
```

The control keeps the site's field name, label, choices, and browser validation.
The bridge submits its value under `custom_answers.residency_area`; confirm that
key with the organization before enabling live submissions. Use
`data-cr-custom-answer-type="multi_select"` for a multiple select, or
`"number"` / `"boolean"` when the custom schema expects those value types.
When the source form has a smaller field set, disable the optional starter
fields in that fork's `config/site.json`; name, email, and explicit consent
remain part of the shared contact contract:

```json
{
  "contactForm": {
    "fields": { "phone": false, "intent": false, "message": false }
  }
}
```

Then add the source's required fields in the `custom-fields` slot and map each
to its configured custom answer key. This keeps the source's form shape while
the SDK continues to own validation, attribution, and submission behavior.
For example, a LinkedIn URL field can retain its source label and native URL
validation while being sent as a configured custom answer:

```astro
<label slot="custom-fields" class="block text-sm font-medium">
  LinkedIn URL
  <input
    class="mt-2 block w-full rounded-xl border border-input bg-background px-4 py-3"
    name="linkedin"
    type="url"
    data-cr-custom-answer="linkedin_url"
    required
  />
</label>
```

The custom answer key must exist in that organization's lead schema before live
submissions are enabled.
For a fully custom source form, use `data-contact-form` with the same bridge
attributes and retain its source markup and validation.

Auth, passwordless accounts, dashboards, and FastAPI are deliberately outside this public repo. Use the private `cr-auth-starter` for those concerns.
