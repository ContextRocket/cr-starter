# Publish contract -- static landing pages

Learnings from the Astro `cr-starter` for ContextRocket (and any CDN host).

## Goal

Fast path from brand inputs to a static site on Cloudflare Pages, CloudFront,
S3, or any static host -- without forking a full Next app shell.

## Inputs (fork / client)

| Input | Example |
| --- | --- |
| Brand + theme | `config/site.json` |
| Copy | `src/i18n/messages/site/en.ts` (+ other locales if needed) |
| Home composition | `src/pages/[locale]/index.astro` |
| Posts | `content/posts/*.md` |
| Optional evergreen topics | `content/topics/*.md` with `features.topics: true` |
| Assets | `public/` |
| Chat | Embed snippet + handle + publishable API key |

## Outputs

- `dist/` -- static HTML/CSS/JS
- `dist/redirects.json` -- provider-neutral redirect rules from `config/site.json`
- `dist/_redirects` -- the same rules in Cloudflare Pages / Netlify syntax
- Optional `public/embed/widget.js` (or CDN URL for the same artifact)
- Hygiene files: sitemap, robots, llms.txt, feed.xml, security.txt

Use `pnpm run build` for a customer deployment to Cloudflare Pages, CloudFront,
S3, Netlify, or another static host. An organization may also publish a built
site to its ContextRocket CDN using the Node-only
`@contextrocket/site-publisher` package from `cr-sdk`; that path needs a private
admin-scoped organization machine token and does not change canonical paths.
The package is not yet released on npm. Platform-operator tasks such as
publishing shared brand assets remain in the ContextRocket operator CLI.
For the optional development publisher, copy `publication.example.json` to
`publication.json` and set the canonical origin and mounts. `pnpm publish:site
--reviewed` forwards that declaration with the build; the server reads its
sitemaps to derive the URL inventory. See
[integration setup](integrating-with-contextrocket.md#publishing-to-the-contextrocket-cdn)
for the unpublished SDK source requirement. Publishing to ContextRocket's CDN
is not needed to connect a site to the ContextRocket API.

## Generated gap pages and repository handoff

ContextRocket generates a gap page with this starter's Astro components and
the SDK chat, contact-form and consent bridges. The first build is English
only. It can stay on ContextRocket's CDN while the organization's website
stays on another host indefinitely. A website migration is not a prerequisite.

The product owns fact selection, generation, authority and SiteRelease. This
repository owns page rendering. The build boundary takes pinned inputs and
returns a static archive; the product must not import a sibling checkout or
maintain another page renderer.

| Build input | Contract |
|---|---|
| Content | Product-validated semantic page manifest with exact evidence and generation receipts; no executable content or credentials. |
| Route | Organization handle, page slug, explicit public origin and mount, and visibility. The Organization handle selects the container; the slug selects its page. |
| Language | `locales: ["en"]`, `defaultLocale: "en"`; the existing single-locale build emits paths without `/en/`. |
| Design | One immutable `cr.theme.v1` bundle, imported locally with `--purpose published`; pin its release and digest. |
| Components and assets | Pinned starter revision, lockfile, template and shared chrome version, SDK artifact digests, governed assets and licensed fonts. |
| Browser capabilities | Organization-scoped public chat and contact configuration, consent configuration and attribution. Live capabilities require their real server-side bindings. |

Materialize these inputs into an isolated starter source tree. Run the normal
Astro build and its route checks, then package `dist/` with
`@contextrocket/site-publisher`'s `prepareSiteArchive`. Its deterministic archive
is already the SDK's upload input; use it rather than a second archive format.
Return the exact archive digest, file/route inventory, input digests and actual
renderer revision to the product's existing SiteRelease build boundary. Build
success does not authorize publication.

`pnpm run build` already emits static output. The product-manifest adapter and
archive-worker entry point are not implemented here. `build:container` is the
website's `/site/` build, not a generated-page route selector. Use the product's
selected public path and container mount for a gap-page build; this contract
does not choose or rename that namespace.

| Delivery | Page owner and build inputs | Facts |
|---|---|---|
| CDN only | ContextRocket maintains the page and pins its starter inputs. | Separate ContextRocket-managed bundle. |
| Path proxy on an external website | The customer proxies the selected page path to the same CDN release; their website remains independent. | Proxy the separate managed Facts path. |
| Customer Git website, managed gap pages | The website has its own repository; ContextRocket keeps the gap-page inputs and releases. | Separate managed bundle, linked or path-proxied. |
| Customer Git page takeover | Export the same content, config, assets and version pins so the customer builds the page with Astro. | Remains ContextRocket-managed and path-proxied; never copied into the page's source tree. |

Repository takeover transfers page editing and building. It does not grant
domain, GitHub or publication authority. Keep deployment credentials outside
the source inputs. A new origin needs the corresponding browser capability
configuration; exporting files does not authorize that origin. Share versioned
design, assets, components and fonts across pages and Facts without merging
their release bundles.

## Blog-only mounting

The build includes the home route and the blog. A host can expose only the
configured blog path (for example `/blog/`) through a reverse proxy while
leaving the generated home route unreachable to visitors. `blog.config.mjs`
requires a named path segment; an empty or `/` `basePath` normalizes to
`/blog`. Keep the public `siteUrl` pointed at that public origin and include
only the routes intended for publication in `config/site.json` →
`publicRoutes`.

The RSS file is emitted at `dist/feed.xml`. `blog.config.mjs` defaults its
public link to `/feed.xml`; when a product owns that root URL, set `feedPath`
to a nested URL such as `/blog/feed.xml` and map that URL to the emitted file.

Astro emits shared assets under `/_astro/`, outside the blog path. A
blog-only proxy must also serve those asset URLs from the same build. Keep the
configured blog base path consistent with the proxy route so canonical URLs,
post links, the feed, and sitemap agree.

## URL and redirect preservation

Set `trailingSlash` in `config/site.json` to `"always"` or `"never"` to match
the source site's canonical URL shape. Keep each published route under its
source path. Before retiring a published path, add a `redirects` entry:

```json
{
  "from": "/old-section/*",
  "to": "/new-section/:splat",
  "status": 301
}
```

The build validates entries, rejects duplicate sources and redirect loops, and
emits both artifacts above. Cloudflare Pages and Netlify can consume
`_redirects`; other hosts should translate `redirects.json` into their edge or
origin redirect configuration. Static HTML fallback redirects are not a
replacement for HTTP redirect rules when a CDN supports them.

`scripts/smoke-routes.mjs` checks that every configured public route and every
authored Markdown post exists in `dist/`. It also checks that same-origin links
and assets resolve to generated files, and that local redirect targets resolve
to a generated file or another configured redirect. Keep this check in the
publish gate so broken links, missing source content, and stale redirect
targets are caught before deployment. For a blog, it also checks that the
configured public feed and sitemap paths resolve through the reverse-proxy
aliases, and that the blog index canonical URL agrees with the configured site
origin, blog path, feed channel link, and sitemap entry.

Some source sites have a route whose slash convention differs from the rest of
the site. Keep `path` as the route's logical path and set `canonicalPath` on its
`publicRoutes` entry to preserve that exact public URL:

```json
{
  "key": "trusted-voices",
  "path": "trusted-voices",
  "canonicalPath": "/trusted-voices/",
  "indexable": true
}
```

`canonicalPath` is used for generated links, canonical metadata, and sitemap
entries. Add a redirect from the old spelling when a route's canonical form
changes.

## Non-goals for this contract

- Auth, dashboard, server-rendered app shell
- FAQ / About / Features as mandatory pages
- Coupling ContextRocket product code to this repository

## Timing target

Wall clock to measure when porting a brand (Kleos / Mark MacMahon class):

1. Clone starter
2. Replace site.json, site messages, assets, home, posts
3. `pnpm install && pnpm build`
4. Deploy `dist/`

Measured on 2026-11-11 with dependencies installed, using
`/usr/bin/time -p pnpm run build` in the existing local checkouts. These are
build-only wall times, excluding dependency installation and typechecking. The
current samples ran sequentially with warm local caches; older, slower samples
are retained in the notes to show observed variance. Treat these as local
observations rather than a performance guarantee:

| Site | `pnpm build` (approx) | Notes |
| --- | --- | --- |
| `cr-starter` | 3.03s | 22 static pages; multi-locale (`en`/`es`/`de`); Astro build: 2.15s. Earlier samples were 9.8–11.1s warm and 59.2s on the first run. |
| `cr-kleos` | 3.62s | 52 static pages, including 30 blog posts and custom pages; 3 static redirect rules. Earlier samples were 10.6–18.0s. |
| `cr-markmacmahon` | 3.91s | 22 static pages; 15 posts and `/posts` alias; Astro build: 2.76s. The minimal header is emitted as static HTML at build time; homepage and `/posts/` emit no client islands. An earlier sample was ~9.5s. |

A build cannot run before dependencies are installed. For `cr-kleos`, a fresh
project copy with an empty `node_modules` directory installed 566 packages in
9.3s from the existing pnpm cache (0 packages downloaded), then built in 26.9s
on its first run: 36.2s combined. This is a warm package-cache measurement; a
machine with an empty pnpm cache will also need to download packages. Measure
that separately when establishing a clean-machine baseline for a future
ContextRocket "publish landing page" flow that emits the same artifact shape.
