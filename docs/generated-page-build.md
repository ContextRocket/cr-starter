# Build one supplied generated page

The offline adapter renders an existing English `LandingPageManifest`; it does
not select facts, generate copy, authorize publication or upload anything.
`buildGeneratedPage({ inputDirectory, workDirectory, outputDirectory })` lives in
`scripts/generated-page/build.ts`. The thin entry point is:

```sh
pnpm build:generated-page INPUT_DIRECTORY WORK_DIRECTORY OUTPUT_DIRECTORY
```

Use separate directories. Work and output directories must be empty. Local
scratch work belongs under `scratchpad/`. The materialized source remains in
`WORK_DIRECTORY/source` and can later support a customer Git export. Its
`node_modules` symlink is a local build convenience, not an export artifact.
The installed dependencies must already be present; the builder never installs
or downloads them. The SDK packages currently use the documented local `file:`
checkout until their npm release. Build current SDK artifacts before installing
them. No sibling product checkout is required at runtime.

## Inputs and pins

The input directory contains only:

- `manifest.json`: product-owned semantic page content and evidence receipts.
- `build-input.json`: the adapter envelope below.
- `theme/`: a complete immutable local `cr.theme.v1` bundle with an icon set.
- `assets/`: governed image files. The renderer supplies the pinned ContextRocket
  attribution marks when the manifest selects ContextRocket disclosure.
  Customer assets must be canonical bytes already admitted by the product's
  asset pipeline, including its SVG security checks.
  The build requires an admission receipt and exact digests; a caller-supplied
  digest alone is not evidence that an arbitrary SVG is safe. Executable file
  types and symlinks are refused; this adapter is not an SVG sanitizer.

The builder uses the exported product schema in
`schemas/landing-page-manifest.schema.json`. Its adjacent `.source.json` records
repository, source path, revision, source digest and export digest. Update this
pair from the owning product's `manifest_json_schema()` export; do not edit its
content model here. JSON Schema validation runs before renderer-specific checks.

`build-input.json` has format `cr.generated-page.v1` and these fields:

| Field                                 | Meaning                                                                                                                                                                                                                            |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `organizationHandle`, `companyName`   | Supplied Organization identity; handle must match the manifest.                                                                                                                                                                    |
| `publicOrigin`, `mount`, `visibility` | Explicit HTTPS origin, the exact safe publication path (for example `/services/` or `/journal/solar-storage/`), and `public` or `private`. `/` is supported when the product intentionally owns the organization root.             |
| `pins`                                | Exact `rendererPins()` result: starter Git revision, actual source digest, lockfile, schema, shared chrome, installed SDK artifacts, embed artifacts and Node version.                                                             |
| `theme`                               | Immutable `release` identifier and complete relative-path-to-SHA256 `files` map. Imported locally with `--purpose site` so the source brand's `site_mode` is applied.                                                              |
| `assetAdmissionReceiptId`             | Product asset-admission receipt for these canonical theme and asset bytes. The product publisher owns unsafe-SVG rejection.                                                                                                        |
| `assets`                              | Complete relative-path-to-SHA256 map for `assets/`.                                                                                                                                                                                |
| `factsLink`                           | Optional supplied `label` and `href`; links to a managed Facts bundle without copying it.                                                                                                                                          |
| `navigation`                          | Optional source-site navigation: original `homeHref` and ordered `{label, href, variant}` links, with a shared `5xl` or `screen-xl` container width. The generated header renders these labels directly and does not invent links. |
| `contact`, `chat`                     | Optional product-resolved binding: `appRef`, `organizationHandle`, `publicOrigin`, `apiOrigin`, `receiptId`. Chat also requires an origin-bound `publicApiKey`.                                                                    |

Set the manifest renderer to `cr-starter` and `pinned_version` to
`pins.starterSourceSha256`. The source digest, rather than a Git label alone,
identifies the executed renderer. The caller must supply product-normalized
manifest bytes if it needs the product's canonical manifest hash: the receipt
records the exact input bytes' digest and does not recreate Python normalization.

The archive is relative to its publication mount: root `index.html`, `_astro/`,
`assets/`, `embed/` and discovery files. Existing Astro `CONTAINER_BASE` config
prefixes compiled resources; the shared asset path helper prefixes authored
resources once. The single-locale flatten helper remains in the build. For
`/journal/solar-storage/`, canonical URLs stay at that exact path and all local
resources use that prefix. SiteRelease supplies
`path_prefix=journal/solar-storage`; it must not prepend a second physical
`journal/solar-storage/` directory. The selected mount is build input, so the
same renderer can produce a page at a customer-selected path without teaching
the reviewer UI about that path. No post-build HTML rewrite or publisher byte
transformation is required. Server-owned mounts such as `/facts/`, `/theme/`,
and the immutable `_releases` ledger remain reserved.

The builder checks binding consistency offline. It cannot establish whether an
App or origin grant is still live. The product must resolve those bindings and
recheck publication authority before storing or publishing the returned release.
Contact forms use the SDK's existing `/api/orgs/{handle}/contacts` transport with
`app_id`, supplied attribution, consent and canonical Contact fields. A valid
capture receipt is required for success; it does not claim downstream delivery.
No demo-success mode is enabled.

## Bounded renderer

Supported visible default-variant sections are `hero`, `rich_text`, `media`,
`logo_strip`, `proof_stat`, `feature_grid`, `faq`, `cta` and `contact_form`. Other
visible sections or variants fail explicitly. Content is interpolated as text
by Astro, never injected as executable markup. Canonical Contact fields are
`name`, `email`, `phone`, `company` and `message`; `name` is required. Other
form fields need an explicit adapter to the configured Contacts schema.

The first slice supports system fonts and a strict allowlist of ContextRocket
brand-CDN families (`Inter Tight`, `Geist Mono`, `Space Mono`, and `Newsreader`)
plus the listed platform fallbacks. An observed customer font is accepted only
when it resolves to one of those already-shipped families; the builder refuses
customer-hosted or unbundled font stacks. Canonicals must be self-referential.
Analytics, other locales, and unsupported sections are refused. The route is
not restricted to the onboarding `/p/` namespace. This is still a bounded
semantic page producer; it does not import an arbitrary website or make its
content structure unrestricted. `/cr/` remains an unselected proposal. Shared
The renderer imports the theme's `site_mode` variant so the preview reflects
the captured site's own surface and uses a contrasting ContextRocket
attribution mark. BaseLayout provides optional source navigation, chat and
consent; generated forms reuse the SDK's receipt and retry controller.
Facts publication, GitHub provisioning, product BuildPort cutover and browser
capability provisioning remain outside this producer.

## Output and proof

`site.tar.gz` comes from `@contextrocket/site-publisher.prepareSiteArchive`.
`build-artifact.json` records its SHA256, BuildArtifact-compatible receipt,
input manifest/schema/theme/SDK/starter/chrome pins and emitted routes. The
in-process return additionally includes `tar_bytes`. Discovery files describe
only this page; private builds are excluded from indexing.

Focused witnesses live under `__tests__/features/generated-page/` and use the
fictional supplied manifest in `__tests__/fixtures/generated-page/page.json`.
The archive witness executes Astro twice, compares archive bytes, checks escaped
content and proves Facts are linked, not included. It extracts the SDK archive,
serves it under the non-root mount, parses HTML with script execution and remote
resource loading disabled, and requests local HTML, CSS, form script, widget,
consent and brand resources over HTTP. Each must return 200; Facts return 404
from this isolated bundle. Run it only with the shared
build slot available. Validation and SDK receipt witnesses need no services or
network. Contract: [generated page behavior](../features/generated-page/BEHAVIOR.md).
