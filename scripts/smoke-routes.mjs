#!/usr/bin/env node
/**
 * Lightweight post-build smoke check for critical static artifacts in dist/.
 * Skips cleanly when dist/ is missing (e.g. typecheck-only runs).
 *
 * Astro output: trailingSlash "always" + build.format "directory"
 * → pages are dist/<path>/index.html (or dist/<locale>/<path>/index.html).
 * Endpoint files (sitemap, robots, manifests) are flat files at dist root.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { marked } from "marked";
import { blogConfig } from "../blog.config.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const containerBase = (process.env.CONTAINER_BASE ?? "").trim().replace(/\/+$/, "");
const containerPrefix = containerBase
  ? containerBase.startsWith("/") ? containerBase : `/${containerBase}`
  : "";

if (!fs.existsSync(dist)) {
  console.log("smoke-routes: dist/ missing — skipping (run build first)");
  process.exit(0);
}

const site = JSON.parse(
  fs.readFileSync(path.join(root, "config/site.json"), "utf8"),
);
const blogBasePath = `/${String(blogConfig.basePath ?? "/blog")
  .replace(/^\/+|\/+$/g, "")}`;
const blogFeedPath = String(blogConfig.feedPath ?? "/feed.xml")
  .replace(/^\/+|\/+$/g, "");
const proxyPathAliases = new Map([
  [`/${blogFeedPath}`, "/feed.xml"],
  [`${blogBasePath}/sitemap.xml`, "/sitemap.xml"],
]);
const locales = site.locales ?? ["en"];
const defaultLocale = site.defaultLocale ?? locales[0];
const multiLocale = locales.length > 1;
const features = site.features ?? {};

/** Prefer directory/index.html; also accept flat .html for host quirks. */
function pageExists(...segments) {
  const dirIndex = path.join(dist, ...segments, "index.html");
  if (fs.existsSync(dirIndex)) return dirIndex;
  const flat = path.join(dist, ...segments.slice(0, -1), `${segments.at(-1)}.html`);
  if (segments.length > 0 && fs.existsSync(flat)) return flat;
  return null;
}

function fileExists(...segments) {
  const filePath = path.join(dist, ...segments);
  return fs.existsSync(filePath) ? filePath : null;
}

function staticPathExists(pathname) {
  let decoded = decodeURIComponent(pathname);
  if (containerPrefix) {
    if (decoded === containerPrefix) decoded = "/";
    else if (decoded.startsWith(`${containerPrefix}/`)) {
      decoded = decoded.slice(containerPrefix.length);
    } else {
      return false;
    }
  }
  decoded = proxyPathAliases.get(decoded) ?? decoded;
  if (decoded.includes("\0") || decoded.split("/").includes("..")) return false;
  const segments = decoded.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
  if (segments.length === 0) return fileExists("index.html");
  return fileExists(...segments) || pageExists(...segments) || fileExists(...segments, "index.html");
}

const missing = [];

function requireFile(label, found) {
  if (!found) missing.push(label);
}

// Root discovery / hygiene files (always expected after a full build)
requireFile("sitemap.xml", fileExists("sitemap.xml"));
requireFile("robots.txt", fileExists("robots.txt"));
requireFile("llms.txt", fileExists("llms.txt"));
requireFile(".well-known/security.txt", fileExists(".well-known", "security.txt"));
requireFile(
  ".well-known/agent-card.json",
  fileExists(".well-known", "agent-card.json"),
);
requireFile(".well-known/mcp.json", fileExists(".well-known", "mcp.json"));
requireFile("manifest.webmanifest", fileExists("manifest.webmanifest"));

if (features.blog) {
  requireFile("feed.xml", fileExists("feed.xml"));
}

// Root deployments can be mounted by an external reverse proxy at the blog
// path, so check those synthetic aliases against the static root files. A
// ContextRocket container is a complete site mounted below its own prefix;
// its publication routes expose the root feed and sitemap directly instead.
if (features.blog && !containerPrefix) {
  requireFile(
    `${blogFeedPath} (reverse-proxy feed alias)`,
    staticPathExists(`/${blogFeedPath}`),
  );
  requireFile(
    `${blogBasePath}/sitemap.xml (reverse-proxy sitemap alias)`,
    staticPathExists(`${blogBasePath}/sitemap.xml`),
  );
}

// Home is optional. Blog-only publications can omit it when the product owns
// the public root and the reverse proxy exposes only the configured blog path.
if ((site.publicRoutes ?? []).some((route) => route.key === "home")) {
  const homeSegments = multiLocale ? [defaultLocale] : [];
  requireFile(
    multiLocale ? `${defaultLocale}/index.html` : "index.html",
    pageExists(...homeSegments) || fileExists(...homeSegments, "index.html"),
  );
}

if (features.blog) {
  const basePath = (blogConfig.basePath ?? "/blog").replace(/^\/+|\/+$/g, "");
  const baseSegments = basePath.split("/").filter(Boolean);
  const blogSegments = [
    ...(multiLocale ? [defaultLocale] : []),
    ...baseSegments,
  ];
  const label = `${blogSegments.join("/")}/index.html`;
  const blogIndexFile = pageExists(...blogSegments);
  requireFile(label, blogIndexFile);
  requireFile(
    `${blogBasePath}/llms.txt (blog content discovery)`,
    staticPathExists(
      containerPrefix
        ? `${containerPrefix}${blogBasePath}/llms.txt`
        : `${blogBasePath}/llms.txt`,
    ),
  );

  if (blogIndexFile) {
    const localePrefix = multiLocale ? `/${defaultLocale}` : "";
    const routePath = `${localePrefix}${blogBasePath}`;
    const canonicalPath = site.trailingSlash === "always"
      ? `${routePath.replace(/\/+$/, "")}/`
      : routePath.replace(/\/+$/, "");
    const siteUrl = String(site.company?.siteUrl ?? "").replace(/\/$/, "");
    const expectedCanonical = `${siteUrl}${canonicalPath}`;
    const html = fs.readFileSync(blogIndexFile, "utf8");
    const canonicalTag = html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i)?.[0];
    const canonicalUrl = canonicalTag?.match(/\bhref=["']([^"']+)["']/i)?.[1];
    if (canonicalUrl !== expectedCanonical) {
      missing.push(
        `blog index canonical URL (${canonicalUrl ?? "missing"}; expected ${expectedCanonical})`,
      );
    }

    const sitemap = fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8");
    if (!sitemap.includes(`<loc>${expectedCanonical}</loc>`)) {
      missing.push(`blog index canonical URL is absent from sitemap (${expectedCanonical})`);
    }

    const feed = fileExists("feed.xml");
    if (feed) {
      const feedXml = fs.readFileSync(feed, "utf8");
      const channelLink = feedXml.match(/<channel>[\s\S]*?<link>(.*?)<\/link>/i)?.[1];
      if (channelLink !== expectedCanonical) {
        missing.push(
          `blog feed channel URL (${channelLink ?? "missing"}; expected ${expectedCanonical})`,
        );
      }
    }
  }

  const contentDir = path.resolve(root, blogConfig.contentDir ?? "content/posts");
  if (fs.existsSync(contentDir)) {
    const posts = new Map();
    for (const file of fs.readdirSync(contentDir)) {
      if (!file.endsWith(".md")) continue;
      const basename = file.slice(0, -3);
      const localized = basename.match(/^(.*)\.([a-z]{2})$/i);
      const candidateLocale = localized?.[2].toLowerCase();
      const locale = candidateLocale && locales.includes(candidateLocale)
        ? candidateLocale
        : undefined;
      const slug = locale ? localized[1] : basename;
      const draft = matter(fs.readFileSync(path.join(contentDir, file), "utf8"))
        .data.draft === true;
      if (!posts.has(slug)) {
        posts.set(slug, { shared: undefined, localized: new Map() });
      }
      const authored = posts.get(slug);
      if (locale) authored.localized.set(locale, draft);
      else authored.shared = draft;
    }

    for (const [slug, authored] of posts) {
      for (const locale of locales) {
        const draft = authored.localized.has(locale)
          ? authored.localized.get(locale)
          : authored.shared;
        if (draft === undefined) continue;
        const segments = [
          ...(multiLocale ? [locale] : []),
          ...baseSegments,
          slug,
        ];
        const publicPath = `/${segments.join("/")}`;
        if (draft) {
          if (pageExists(...segments)) {
            missing.push(`draft blog post was published (${publicPath})`);
          }
          continue;
        }
        const postHtmlFile = pageExists(...segments);
        requireFile(`blog post (${publicPath})`, postHtmlFile);

        if (postHtmlFile) {
          const localeFile = path.join(contentDir, `${slug}.${locale}.md`);
          const sharedFile = path.join(contentDir, `${slug}.md`);
          const sourceFile = fs.existsSync(localeFile) ? localeFile : sharedFile;
          const sourceContent = matter(fs.readFileSync(sourceFile, "utf8")).content;
          const sourceSectionCount = marked
            .lexer(sourceContent)
            .filter((token) => token.type === "heading" && token.depth >= 2 && token.text.trim())
            .length;
          const postHtml = fs.readFileSync(postHtmlFile, "utf8");
          const contentsMatch = postHtml.match(
            /<nav\b(?=[^>]*\bdata-blog-contents(?:\s|=|>))[^>]*>([\s\S]*?)<\/nav>/i,
          );

          if (sourceSectionCount >= 4 && !contentsMatch) {
            missing.push(`long blog post is missing its contents navigation (${publicPath})`);
          }
          if (contentsMatch) {
            const links = [...contentsMatch[1].matchAll(/<a\b[^>]*\bhref=["']#([^"']+)["']/gi)];
            const headingIds = new Set(
              [...postHtml.matchAll(/<h[2-6]\b[^>]*\bid=["']([^"']+)["'][^>]*>/gi)]
                .map((match) => match[1]),
            );
            if (links.length < 4) {
              missing.push(`blog contents navigation has too few links (${publicPath})`);
            }
            for (const link of links) {
              let id = "";
              try {
                id = decodeURIComponent(link[1]);
              } catch {
                missing.push(`blog contents link has an invalid fragment (${publicPath})`);
              }
              if (!id || !headingIds.has(id)) {
                missing.push(`blog contents link does not resolve to an article heading (${publicPath})`);
              }
            }
          }
        }

        if (baseSegments.join("/") !== "blog") {
          const legacySegments = [
            ...(multiLocale ? [locale] : []),
            "blog",
            slug,
          ];
          if (pageExists(...legacySegments)) {
            missing.push(
              `unexpected duplicate blog post route (/${legacySegments.join("/")})`,
            );
          }
        }
      }
    }
  }

  if (features.topics === true) {
    const topicsDir = path.resolve(root, blogConfig.topicsDir ?? "content/topics");
    const topics = fs.existsSync(topicsDir)
      ? fs.readdirSync(topicsDir)
          .filter((file) => /^[a-z0-9]+(?:-[a-z0-9]+)*\.md$/.test(file))
          .map((file) => ({
            slug: file.slice(0, -3),
            ...matter(fs.readFileSync(path.join(topicsDir, file), "utf8")).data,
          }))
      : [];
    const published = topics.filter((topic) => topic.draft !== true);
    const topicIndexSegments = [...blogSegments, "topics"];
    if (published.length > 0) {
      requireFile("published topic index", pageExists(...topicIndexSegments));
    }
    const sitemap = fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8");
    const llms = fs.readFileSync(path.join(dist, "llms.txt"), "utf8");
    const feed = fileExists("feed.xml");
    const feedXml = feed ? fs.readFileSync(feed, "utf8") : "";
    const siteUrl = String(site.company?.siteUrl ?? "").replace(/\/+$/, "");
    for (const topic of topics) {
      const segments = [...topicIndexSegments, topic.slug];
      const topicPath = `/${segments.join("/")}`;
      const canonical = `${siteUrl}${topicPath}/`;
      if (topic.draft === true) {
        if (pageExists(...segments)) missing.push(`draft topic was published (${topicPath})`);
        if (sitemap.includes(`<loc>${canonical}</loc>`)) missing.push(`draft topic appears in sitemap (${canonical})`);
        if (llms.includes(`](${canonical})`)) missing.push(`draft topic appears in llms.txt (${canonical})`);
        continue;
      }
      requireFile(`published topic (${topicPath})`, pageExists(...segments));
      if (!sitemap.includes(`<loc>${canonical}</loc>`)) missing.push(`published topic is missing from sitemap (${canonical})`);
      if (!llms.includes(`](${canonical})`)) missing.push(`published topic is missing from llms.txt (${canonical})`);
      if (feedXml.includes(canonical)) missing.push(`topic must not appear in dated RSS feed (${canonical})`);
    }
  }

  if (baseSegments.join("/") !== "blog") {
    const legacyIndex = [
      ...(multiLocale ? [defaultLocale] : []),
      "blog",
    ];
    if (pageExists(...legacyIndex)) {
      missing.push(
        `unexpected duplicate blog index route (/${legacyIndex.join("/")})`,
      );
    }
  }
}

// Check every configured public URL, including fork-owned routes such as a
// podcast or a custom trailing-slash route. This catches a sitemap entry that
// has been kept in config while its static page was accidentally removed.
for (const route of site.publicRoutes ?? []) {
  if (route.key === "home" || route.key === "blog") {
    continue; // checked above, with the blog's dedicated path source
  }
  if (route.feature && features[route.feature] === false) continue;

  const rawPath =
    typeof route.canonicalPath === "string" ? route.canonicalPath : route.path;
  const routeSegments = String(rawPath ?? "")
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean);
  const segments = [
    ...(multiLocale ? [defaultLocale] : []),
    ...routeSegments,
  ];
  const publicPath = routeSegments.length
    ? `/${routeSegments.join("/")}`
    : "/";
  const label = `${route.key} (${publicPath})`;
  requireFile(
    label,
    pageExists(...segments) || fileExists(...segments, "index.html"),
  );
}

// Keep CDN redirects coupled to fork configuration. A redirect is part of the
// source site's URL contract, so missing provider artifacts must fail smoke.
const configuredRedirects = (site.redirects ?? []).map(({ from, to, status = 301 }) => ({
  from,
  to,
  status: Number(status),
}));
const redirectsJsonPath = fileExists("redirects.json");
const redirectsRulesPath = fileExists("_redirects");
requireFile("redirects.json", redirectsJsonPath);
requireFile("_redirects", redirectsRulesPath);

if (redirectsJsonPath) {
  try {
    const emitted = JSON.parse(fs.readFileSync(redirectsJsonPath, "utf8"));
    if (JSON.stringify(emitted) !== JSON.stringify(configuredRedirects)) {
      missing.push("redirects.json does not match config/site.json redirects");
    }
  } catch {
    missing.push("redirects.json is invalid JSON");
  }
}

if (redirectsRulesPath) {
  const emitted = fs
    .readFileSync(redirectsRulesPath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
  const expected = configuredRedirects.map(
    ({ from, to, status }) => `${from} ${to} ${status}`,
  );
  if (JSON.stringify(emitted) !== JSON.stringify(expected)) {
    missing.push("_redirects does not match config/site.json redirects");
  }
}

// A redirect is useful only when its destination is another redirect or a
// file in the published tree. Catch stale redirect targets before deployment.
for (const { from, to } of configuredRedirects) {
  if (!to.startsWith("/")) continue; // External HTTPS destination.
  const targetPath = new URL(to, "https://static.invalid").pathname;
  if (targetPath.includes(":") || targetPath.includes("*")) continue;
  if (configuredRedirects.some((redirect) => redirect.from === targetPath)) continue;
  let exists = false;
  try {
    exists = staticPathExists(
      containerPrefix ? `${containerPrefix}${targetPath}` : targetPath,
    );
  } catch {
    // Invalid percent-encoding cannot identify a generated static file.
  }
  if (!exists) missing.push(`redirect target for ${from} (${targetPath})`);
}

// Static route checks above prove that declared pages exist. Also validate
// same-origin links in generated pages so renamed routes and missing assets do
// not survive a successful CDN build unnoticed.
const siteOrigin = new URL(site.company.siteUrl);
const htmlFiles = [];
function collectHtml(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) collectHtml(absolute);
    else if (entry.isFile() && entry.name.endsWith(".html")) htmlFiles.push(absolute);
  }
}
collectHtml(dist);

for (const htmlFile of htmlFiles) {
  const relativeFile = path.relative(dist, htmlFile).split(path.sep).join("/");
  // A 404 document intentionally contains links to pages that are absent.
  if (relativeFile === "404.html") continue;

  const logicalServedPath = relativeFile === "index.html"
    ? "/"
    : relativeFile.endsWith("/index.html")
      ? `/${relativeFile.slice(0, -"index.html".length)}`
      : `/${relativeFile}`;
  const servedPath = containerPrefix
    ? `${containerPrefix}${logicalServedPath}`
    : logicalServedPath;
  const pageUrl = new URL(servedPath, siteOrigin);
  const html = fs.readFileSync(htmlFile, "utf8");
  // Match actual HTML attribute names. A word boundary also matches the
  // `action` suffix in data-action, which is a behavior hook rather than a URL.
  for (const match of html.matchAll(/(?<![\w:-])(?:href|src|action|poster)\s*=\s*(["'])(.*?)\1/gi)) {
    const raw = match[2]
      .replaceAll("&amp;", "&")
      .replaceAll("&#x2F;", "/")
      .replaceAll("&#x2f;", "/");
    if (!raw || /^(?:mailto:|tel:|javascript:|data:|blob:)/i.test(raw)) continue;
    const isAbsoluteUrl = raw.startsWith("//") || /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(raw);
    if (containerPrefix && isAbsoluteUrl) continue;

    let target;
    try {
      target = new URL(raw, pageUrl);
    } catch {
      continue;
    }
    if (!/^https?:$/.test(target.protocol) || target.origin !== siteOrigin.origin) continue;

    const isRootRelative = raw.startsWith("/") && !raw.startsWith("//");
    if (containerPrefix && isRootRelative) {
      if (
        target.pathname !== containerPrefix &&
        !target.pathname.startsWith(`${containerPrefix}/`)
      ) {
        missing.push(
          `local link is missing CONTAINER_BASE ${containerPrefix} in ${relativeFile} (${target.pathname})`,
        );
        continue;
      }
    }

    let exists = false;
    // A reverse-proxy publication can intentionally omit its root route when
    // the parent product owns `/` (for example, a blog mounted at `/blog/`).
    // Let links to that product-owned root resolve outside this static tree.
    if (
      target.pathname === "/" &&
      !(site.publicRoutes ?? []).some((route) => route.key === "home")
    ) {
      continue;
    }
    try {
      exists = staticPathExists(target.pathname);
    } catch {
      // Invalid percent-encoding cannot identify a generated static file.
    }
    if (!exists) missing.push(`local link in ${relativeFile} (${target.pathname})`);
  }
}

if (missing.length > 0) {
  console.error("smoke-routes: missing critical dist artifacts:");
  for (const item of missing) {
    console.error(`  - ${item}`);
  }
  console.error(
    `Looked under ${dist} (multiLocale=${multiLocale}, defaultLocale=${defaultLocale}).`,
  );
  process.exit(1);
}

console.log("smoke-routes: ok");
