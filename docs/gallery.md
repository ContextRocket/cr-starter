# Gallery

The starter gallery is a static-first content model for profile photos, press
images, portfolio work, and event photography. It is intentionally separate
from the blog image convention: blog posts continue to own their Markdown
images, while gallery assets have stable identities that can be referenced by
site configuration and future publishing tools.

## Recommended layout

Keep the files in a predictable folder structure under `frontend/public/`:

```text
frontend/public/gallery/
  profile/
    mark-macmahon-2026.jpg
  events/
    contextrocket-launch/
      keynote.jpg
      team.jpg
frontend/content/gallery.json
```

The manifest stores paths relative to `frontend/public/`:

```json
{
  "version": 1,
  "collections": [
    {
      "id": "contextrocket-launch",
      "label": "ContextRocket launch",
      "kind": "event",
      "date": "2026-09-15",
      "location": "Madrid"
    }
  ],
  "assets": [
    {
      "id": "mark-profile-2026",
      "path": "gallery/profile/mark-macmahon-2026.jpg",
      "alt": "Mark MacMahon profile photo",
      "roles": ["profile", "avatar"],
      "date": "2026-08-19",
      "featured": true,
      "variants": {
        "card": {
          "path": "gallery/profile/mark-macmahon-2026-card.jpg",
          "width": 400,
          "height": 600
        },
        "lightbox": {
          "path": "gallery/profile/mark-macmahon-2026-lightbox.jpg",
          "width": 1600,
          "height": 2400
        }
      }
    },
    {
      "id": "launch-keynote",
      "path": "gallery/events/contextrocket-launch/keynote.jpg",
      "alt": "A keynote at the ContextRocket launch",
      "collectionIds": ["contextrocket-launch"],
      "roles": ["event"],
      "tags": ["keynote", "contextrocket"]
    }
  ]
}
```

The folder structure is for human maintenance and CDN layout. The manifest is
the source of truth for meaning. Do not make consumers infer that an image is
a profile image or an event image from its filename.

## Stable IDs and canonical profile images

Set the canonical image in `config/site.json` by ID rather than by URL:

```json
{
  "gallery": {
    "manifestPath": "content/gallery.json",
    "assetBaseUrl": "",
    "profileImageId": "mark-profile-2026"
  }
}
```

`profileImageId` is deliberately explicit. It does not change unexpectedly
when a newer image is added. `getLatestGalleryAsset(assets, { role:
"profile" })` is available for “latest” queries and tooling, but should not
silently replace the canonical site image.

The route `/[locale]/gallery` is feature-gated by
`features.gallery`. A fork that wants the route enables the feature and adds a
normal `site.json` navigation link. A fork that only wants the lightbox can
leave the route disabled and use `ImageLightbox` directly.

## CDN direction

`path` is a stable publishing key. Locally, `galleryAssetUrl` produces
`/gallery/...`; setting `NEXT_PUBLIC_GALLERY_ASSET_BASE_URL` to a CDN root
produces the same path below that root. This means a future CLI/CDN publisher
can upload the files and manifest without rewriting page content or changing
asset IDs.

The first version intentionally does not add upload state, private assets,
automatic derivative generation, or a remote API. Those belong in the
publishing layer once the local content model has been exercised by Mark and
the other forks.

## Resolution and variants

Two different photographs should be two different gallery assets, even when
they are both profile images. That is how the two business-focused Mark
photographs are represented. Do not hide different crops or compositions under
one ID.

When the same photograph is exported at multiple resolutions, keep one stable
asset ID and add named `variants`. Each variant records its exact path and
intrinsic dimensions. Prefer purpose names (`thumbnail`, `card`, `profile`,
`lightbox`) over vague names such as `small` and `large`; the consuming layout
can then change without renaming the underlying files.

For ordinary Next.js rendering, `next/image` can generate responsive sizes from
one source. Explicit variants become useful when the files will also be
published to a CDN, used by static-only sites, or shared with non-Next clients.
The base asset should remain a sufficiently high-quality source, while a
lightbox should never be fed a tiny card derivative. The optional
`galleryAssetUrl(asset, baseUrl, "card")` and
`toGalleryImage(asset, baseUrl, "lightbox")` helpers select a variant and fall
back to the base path when that variant is not present.

## Why a manifest rather than only folders?

Folders are excellent for finding files and make CDN keys obvious, but they do
not express aliases such as “this is the current profile image”, accessibility
text, credits, dates, or an image belonging to more than one collection. A
single small manifest gives us those semantics without adding a localization
bundle or a database. Labels and captions are content metadata; if a site ever
needs translated captions, that can be added as an optional content-level
extension without turning the gallery UI into another language system.
