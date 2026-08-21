# Customizing the design

Use [`style-and-structure-guide.md`](style-and-structure-guide.md) as the
required checkpoint for preserving a fork's visual language, content, voice,
and baseline during synchronization.

Fork design is data-first. Start with `frontend/config/site.json`:

- `theme.light` and `theme.dark` contain CSS variable values;
- `theme.radius` controls the component radius system;
- `assets` points at fork-owned logos and images;
- `chrome` controls the header/footer presentation and first-visit theme; and
- `nav` controls links and public feature flags.

Site copy belongs in frontend/i18n/messages/site/<locale>.ts for the locales
the fork serves. An English-only fork should keep only en.ts in each message
slice; the generator removes unused locale wiring. Shared and app messages are
starter-owned. Keep all visible strings behind the i18n API.

For a genuinely different home page, edit `frontend/app/[locale]/page.tsx` while preserving the shared sections and config seams that make future starter updates easy to merge. Add fork-specific components under `frontend/components/custom/`.

## Review checklist

- Check mobile and desktop layouts.
- Check light and dark themes.
- Check every locale listed in frontend/config/site.json.
- Check focus states, keyboard navigation, and reduced motion.
- Run the static build so the design works without a server.

```bash
make build-static
```
