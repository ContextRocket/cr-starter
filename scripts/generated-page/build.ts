import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  cp,
  lstat,
  mkdir,
  readFile,
  readdir,
  realpath,
  symlink,
  writeFile,
} from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prepareSiteArchive } from "@contextrocket/site-publisher";
import {
  fail,
  object,
  safePath,
  text,
  validateInputs,
  validateManifest,
} from "./validate.ts";
import type { BuildInputs } from "./validate.ts";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const sourceRoots = ["src", "scripts", "schemas", "config"];
export const sha256 = (bytes: Uint8Array | string) =>
  createHash("sha256").update(bytes).digest("hex");
export async function fileInventory(
  directory: string,
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  async function walk(dir: string) {
    for (const entry of (await readdir(dir, { withFileTypes: true })).sort(
      (a, b) => a.name.localeCompare(b.name, "en"),
    )) {
      const path = join(dir, entry.name);
      const stat = await lstat(path);
      if (stat.isSymbolicLink()) fail("SYMLINK_INPUT", path);
      if (stat.isDirectory()) await walk(path);
      else if (stat.isFile())
        result[relative(directory, path)] = sha256(await readFile(path));
      else fail("INVALID_FILE", path);
    }
  }
  await walk(directory);
  return result;
}
const inventoryHash = (files: Record<string, string>) =>
  sha256(
    JSON.stringify(
      Object.fromEntries(
        Object.entries(files).sort(([a], [b]) => a.localeCompare(b, "en")),
      ),
    ),
  );
async function packageRoot(name: string): Promise<string> {
  return realpath(join(root, "node_modules", name));
}
export async function rendererPins(): Promise<Record<string, string>> {
  const source: Record<string, string> = {};
  for (const dir of sourceRoots)
    for (const [p, h] of Object.entries(await fileInventory(join(root, dir))))
      source[`${dir}/${p}`] = h;
  for (const file of [
    "package.json",
    "pnpm-lock.yaml",
    "astro.config.mjs",
    "blog.config.mjs",
    "tsconfig.json",
  ])
    source[file] = sha256(await readFile(join(root, file)));
  const publisher = await packageRoot("@contextrocket/site-publisher");
  const sdk = await packageRoot("@contextrocket/sdk");
  const sdkInventory = {
    publisher: inventoryHash(await fileInventory(join(publisher, "dist"))),
    sdk: inventoryHash(await fileInventory(join(sdk, "dist"))),
  };
  const embeds: Record<string, string> = {};
  for (const file of ["widget.js", "site-behaviors.js"])
    embeds[file] = sha256(await readFile(join(root, "public/embed", file)));
  return {
    schemaSha256: sha256(
      await readFile(join(root, "schemas/landing-page-manifest.schema.json")),
    ),
    starterRevision: execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: root,
      encoding: "utf8",
    }).trim(),
    starterSourceSha256: inventoryHash(source),
    lockfileSha256: source["pnpm-lock.yaml"],
    chromeSha256: inventoryHash(
      await fileInventory(join(root, "src/components/chrome")),
    ),
    sdkSha256: inventoryHash(sdkInventory),
    sdkVersion: JSON.parse(await readFile(join(sdk, "package.json"), "utf8"))
      .version,
    publisherVersion: JSON.parse(
      await readFile(join(publisher, "package.json"), "utf8"),
    ).version,
    starterVersion: JSON.parse(
      await readFile(join(root, "package.json"), "utf8"),
    ).version,
    embedSha256: inventoryHash(embeds),
    nodeVersion: process.version,
  };
}
async function verifiedTree(directory: string, pins: Record<string, string>) {
  const actual = await fileInventory(directory);
  for (const name of Object.keys(actual)) safePath(name);
  if (inventoryHash(actual) !== inventoryHash(pins))
    fail("INPUT_DIGEST", "Pinned files do not match supplied tree");
}
function run(
  file: string,
  args: string[],
  cwd: string,
  env: NodeJS.ProcessEnv,
) {
  try {
    execFileSync(file, args, {
      cwd,
      env,
      stdio: ["ignore", "pipe", "pipe"],
      maxBuffer: 16 * 1024 * 1024,
    });
  } catch (error) {
    const detail = error as { stderr?: Buffer; stdout?: Buffer };
    fail(
      "BUILD_FAILED",
      String(detail.stderr ?? detail.stdout ?? "Astro process failed").slice(
        -5000,
      ),
    );
  }
}
async function writeJson(path: string, value: unknown) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(value, null, 2) + "\n");
}
async function freshDirectory(path: string) {
  await mkdir(path, { recursive: true });
  if ((await readdir(path)).length) fail("OUTPUT_NOT_EMPTY", path);
  if ((await realpath(path)) !== path) fail("SYMLINK_OUTPUT", path);
}
const xml = (s: string) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
export interface GeneratedBuildArtifact {
  tar_bytes: Buffer;
  build_hash: string;
  receipt: {
    ok: true;
    schema_version: string;
    schema_hash: string;
    manifest_hash: string;
    renderer_id: "cr-starter";
    renderer_pinned_version: string;
    routes: string[];
    assets: string[];
    failures: never[];
    warnings: string[];
  };
  archivePath: string;
  materializedSourceDirectory: string;
  filePaths: readonly string[];
  inputManifest: {
    target: Pick<
      BuildInputs,
      "organizationHandle" | "publicOrigin" | "mount" | "visibility"
    >;
    pins: Record<string, string>;
    theme: BuildInputs["theme"];
    assets: Record<string, string>;
    inputSha256: string;
    manifestSha256: string;
    schemaSource: unknown;
  };
}
/** Offline build boundary. Does not authorize publication or contact capture. */
export async function buildGeneratedPage({
  inputDirectory,
  workDirectory,
  outputDirectory,
}: {
  inputDirectory: string;
  workDirectory: string;
  outputDirectory: string;
}): Promise<GeneratedBuildArtifact> {
  const inputRoot = await realpath(inputDirectory);
  const work = resolve(workDirectory);
  const output = resolve(outputDirectory);
  if (
    [inputRoot, work, output].some((p, i, all) =>
      all.some((q, j) => i !== j && (p === q || p.startsWith(q + "/"))),
    )
  )
    fail("OVERLAPPING_DIRECTORIES", "Input, work and output must be separate");
  const supplied = await fileInventory(inputRoot);
  if (
    Object.keys(supplied).some(
      (p) =>
        !["build-input.json", "manifest.json"].includes(p) &&
        !p.startsWith("theme/") &&
        !p.startsWith("assets/"),
    )
  )
    fail(
      "UNEXPECTED_INPUT",
      "Only manifest, build input, theme and assets are accepted",
    );
  const inputBytes = await readFile(join(inputRoot, "build-input.json"));
  const input = validateInputs(JSON.parse(inputBytes.toString()));
  const pins = await rendererPins();
  if (inventoryHash(pins) !== inventoryHash(input.pins))
    fail(
      "RENDERER_PIN",
      "Installed source, schema, lockfile, SDK or runtime differs",
    );
  const schemaBytes = await readFile(
    join(root, "schemas/landing-page-manifest.schema.json"),
  );
  const schemaSource = JSON.parse(
    await readFile(
      join(root, "schemas/landing-page-manifest.source.json"),
      "utf8",
    ),
  );
  if (schemaSource.schemaSha256 !== pins.schemaSha256)
    fail("SCHEMA_PIN", "Product export digest mismatch");
  const manifestBytes = await readFile(join(inputRoot, "manifest.json"));
  const manifest = validateManifest(
    JSON.parse(manifestBytes.toString()),
    JSON.parse(schemaBytes.toString()),
    input,
  );
  await verifiedTree(join(inputRoot, "theme"), input.theme.files);
  await verifiedTree(join(inputRoot, "assets"), input.assets);
  for (const name of Object.keys(input.assets)) {
    if (!/\.(png|jpe?g|webp|gif|svg|ico|woff2?)$/i.test(name))
      fail("UNSUPPORTED_ASSET", name);
    if (
      name.endsWith(".svg") &&
      /<script|<foreignObject|\bon\w+\s*=|(?:href|src)\s*=\s*["'](?:https?:|\/\/|javascript:)/i.test(
        await readFile(join(inputRoot, "assets", name), "utf8"),
      )
    )
      fail("EXECUTABLE_ASSET", name);
  }
  if (
    manifest.disclosure_mode === "contextrocket" &&
    !input.assets["brand/logo-h-spark-ink.svg"]
  )
    fail("MISSING_PIN", "Local attribution mark");
  await freshDirectory(work);
  await freshDirectory(output);
  const source = join(work, "source");
  await mkdir(source);
  for (const dir of sourceRoots)
    await cp(join(root, dir), join(source, dir), {
      recursive: true,
      filter: (p) => !p.startsWith(join(root, "src/pages")),
    });
  for (const file of [
    "package.json",
    "pnpm-lock.yaml",
    "astro.config.mjs",
    "blog.config.mjs",
    "tsconfig.json",
  ])
    await cp(join(root, file), join(source, file));
  await mkdir(join(source, "public"), { recursive: true });
  await cp(join(inputRoot, "assets"), join(source, "public/assets"), {
    recursive: true,
  });
  await cp(inputRoot, join(source, "build-inputs"), { recursive: true });
  if (
    inventoryHash(await fileInventory(join(source, "build-inputs"))) !==
    inventoryHash(supplied)
  )
    fail("INPUT_CHANGED", "Input changed while materializing");
  await symlink(
    join(root, "node_modules"),
    join(source, "node_modules"),
    "dir",
  );
  const config = JSON.parse(
    await readFile(join(root, "config/site.json"), "utf8"),
  );
  config.company = {
    name: input.companyName,
    description: text(object(manifest.search).description),
    tagline: "",
    siteUrl: input.publicOrigin,
    contactEmail: "",
  };
  config.contextrocket = {
    handle: input.organizationHandle,
    subjectKind: "company",
  };
  config.locales = ["en"];
  config.defaultLocale = "en";
  config.trailingSlash = "always";
  config.redirects = [];
  config.publicRoutes = [
    {
      key: "generated",
      path: input.mount.slice(1, -1),
      indexable: object(manifest.search).sitemap_include === true,
    },
  ];
  config.assets = { logo: "", wordmark: "", faviconIco: "" };
  config.social = {};
  config.nav = { showAppLinks: false, links: [], footerLinks: [] };
  config.chrome = {
    header: "none",
    footer: "none",
    showBrandLogo: false,
    exemptPrefixes: [],
  };
  config.features = {
    blog: false,
    topics: false,
    testimonials: false,
    languageSelector: false,
    chatFab: Boolean(input.chat),
    poweredByBadge: false,
    cookieConsent: input.chat ? "on" : "off",
  };
  config.integrations = {};
  config.integrationConsentMode = "auto";
  config.theme = { tokens: {}, radius: "0.5rem" };
  config.brandAssetsUrl = "/assets/brand";
  await writeJson(join(source, "config/site.json"), config);
  const env: NodeJS.ProcessEnv = {
    PATH: process.env.PATH,
    NODE_ENV: "production",
    ASTRO_TELEMETRY_DISABLED: "1",
  };
  if (input.chat)
    Object.assign(env, {
      PUBLIC_CR_CHAT_MODE: "live",
      PUBLIC_CONTEXTROCKET_API_KEY: input.chat.publicApiKey,
      PUBLIC_CR_AGENT_URL: input.chat.apiOrigin,
    });
  run(
    process.execPath,
    [
      join(source, "scripts/import-theme.mjs"),
      "--from",
      join(source, "build-inputs/theme"),
      "--purpose",
      "published",
      "--config",
      join(source, "config/site.json"),
      "--public",
      join(source, "public"),
    ],
    source,
    env,
  );
  const themed = JSON.parse(
    await readFile(join(source, "config/site.json"), "utf8"),
  );
  // The bounded renderer uses system fonts; custom font bundles need an explicit adapter.
  for (const [name, value] of Object.entries(themed.theme.tokens))
    if (
      name.startsWith("--font-") &&
      !/^(system-ui|sans-serif|serif|monospace)(,\s*(system-ui|sans-serif|serif|monospace))*$/.test(
        text(value),
      )
    )
      fail("UNSUPPORTED_FONT", name);
  if (!themed.assets.faviconIco)
    fail("MISSING_THEME_ICON", "A local published icon is required");
  await writeJson(join(source, "src/generated/manifest.json"), manifest);
  await writeJson(join(source, "src/generated/build-input.json"), input);
  const routeFile = join(
    source,
    "src/pages",
    input.mount.slice(1),
    "index.astro",
  );
  await mkdir(dirname(routeFile), { recursive: true });
  await writeFile(
    routeFile,
    '---\nimport GeneratedPage from "@/components/generated/GeneratedPage.astro";\nimport manifest from "@/generated/manifest.json";\nimport input from "@/generated/build-input.json";\n---\n<GeneratedPage manifest={manifest} input={input} />\n',
  );
  if (input.chat) {
    await mkdir(join(source, "public/embed"), { recursive: true });
    for (const file of ["widget.js", "site-behaviors.js"])
      await cp(
        join(root, "public/embed", file),
        join(source, "public/embed", file),
      );
  }
  const url = input.publicOrigin + input.mount;
  const indexed =
    input.visibility === "public" &&
    object(manifest.search).sitemap_include === true;
  await writeFile(
    join(source, "public/sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${indexed ? `<url><loc>${xml(url)}</loc></url>` : ""}</urlset>\n`,
  );
  await writeFile(
    join(source, "public/robots.txt"),
    `User-agent: *\n${indexed ? "Allow: " + input.mount : "Disallow: /"}\nSitemap: ${input.publicOrigin}/sitemap.xml\n`,
  );
  await writeFile(
    join(source, "public/llms.txt"),
    indexed
      ? `# ${text(manifest.title).replaceAll("\n", " ")}\n\n- [${text(manifest.title).replaceAll(/[\[\]\n]/g, " ")}](${url})\n`
      : "",
  );
  await writeJson(join(source, "public/manifest.webmanifest"), {
    name: input.companyName,
    start_url: input.mount,
    display: "browser",
  });
  run(
    process.execPath,
    [join(root, "node_modules/astro/astro.js"), "build"],
    source,
    env,
  );
  const dist = join(source, "dist");
  const files = await fileInventory(dist);
  const pageFile = input.mount.slice(1) + "index.html";
  if (
    !files[pageFile] ||
    Object.keys(files).some((p) => p.endsWith(".html") && p !== pageFile)
  )
    fail("ROUTE_INVENTORY", "Build emitted missing or unexpected pages");
  const html = await readFile(join(dist, pageFile), "utf8");
  if (!html.includes(`href="${url}"`) || /(?:href|src)="\/en\//.test(html))
    fail("CANONICAL_ROUTE", "Wrong canonical or locale prefix");
  // Validate generated references. Facts links may target a separately managed bundle.
  for (const match of html.matchAll(
    /(?:src|href)="(\/[^"#?]*)(?:[?#][^"]*)?"/g,
  )) {
    const path = match[1];
    if (path === input.factsLink?.href || path === input.mount) continue;
    if (
      !files[path.slice(1)] &&
      !files[path.slice(1).replace(/\/$/, "") + "/index.html"]
    )
      fail("BROKEN_LOCAL_REFERENCE", path);
  }
  const archive = await prepareSiteArchive(dist);
  const hash = sha256(archive.tarball);
  const archivePath = join(output, "site.tar.gz");
  await writeFile(archivePath, archive.tarball);
  const artifact: GeneratedBuildArtifact = {
    tar_bytes: archive.tarball,
    build_hash: hash,
    archivePath,
    materializedSourceDirectory: source,
    filePaths: archive.filePaths,
    receipt: {
      ok: true,
      schema_version: text(manifest.schema_version),
      schema_hash: pins.schemaSha256,
      manifest_hash: sha256(manifestBytes),
      renderer_id: "cr-starter",
      renderer_pinned_version: pins.starterSourceSha256,
      routes: [input.mount],
      assets: archive.filePaths.filter((p) => p !== pageFile),
      failures: [],
      warnings: [],
    },
    inputManifest: {
      target: {
        organizationHandle: input.organizationHandle,
        publicOrigin: input.publicOrigin,
        mount: input.mount,
        visibility: input.visibility,
      },
      pins,
      theme: input.theme,
      assets: input.assets,
      inputSha256: sha256(inputBytes),
      manifestSha256: sha256(manifestBytes),
      schemaSource,
    },
  };
  const { tar_bytes: _bytes, ...receipt } = artifact;
  await writeJson(join(output, "build-artifact.json"), receipt);
  return artifact;
}
