#!/usr/bin/env node
/**
 * Apply a brand-pack.json onto a cr-starter tree (or a scratchpad preview).
 *
 * Default: write patches + copied assets under scratchpad/brand-previews/<id>/
 * --merge-into <dir>: merge identity/theme/chrome/assets into that tree's
 *   config/site.json, patch site/en hero strings, copy assets into public/,
 *   and write a home wiring note for LightBrandHome.
 *
 * Usage:
 *   node scripts/apply-brand-pack.mjs examples/kleos/brand-pack.json
 *   node scripts/apply-brand-pack.mjs examples/kleos/brand-pack.json --merge-into .
 */

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LANDING_BOILERPLATE } from "../examples/landing-boilerplate.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

function die(msg) {
  console.error(msg);
  process.exit(1);
}

function parseArgs(argv) {
  const args = { pack: null, mergeInto: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--merge-into") {
      args.mergeInto = path.resolve(argv[++i] ?? "");
    } else if (a.startsWith("-")) {
      die(`Unknown flag: ${a}`);
    } else if (!args.pack) {
      args.pack = path.resolve(a);
    }
  }
  if (!args.pack) {
    die(
      "Usage: node scripts/apply-brand-pack.mjs <brand-pack.json> [--merge-into <dir>]",
    );
  }
  return args;
}

function loadPack(packPath) {
  if (!existsSync(packPath)) die(`Pack not found: ${packPath}`);
  const pack = JSON.parse(readFileSync(packPath, "utf8"));
  if (pack.version !== 1) die(`Unsupported brand pack version: ${pack.version}`);
  for (const key of ["identity", "colors", "assets"]) {
    if (!pack[key]) die(`Pack missing required key: ${key}`);
  }
  if (!pack.identity.name) die("identity.name is required");
  if (!pack.colors.background || !pack.colors.primary) {
    die("colors.background and colors.primary are required");
  }
  return pack;
}

function resolveAsset(packDir, rel) {
  if (!rel) return null;
  const abs = path.resolve(packDir, rel);
  if (!existsSync(abs)) die(`Asset missing: ${rel} (resolved ${abs})`);
  return abs;
}

function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "brand";
}

function lightThemeFromColors(colors) {
  const bg = colors.background;
  const fg = colors.foreground;
  const primary = colors.primary;
  const accent = colors.accent;
  return {
    "--background": bg,
    "--foreground": fg,
    "--card": bg,
    "--card-foreground": fg,
    "--popover": bg,
    "--popover-foreground": fg,
    "--primary": primary,
    "--primary-foreground": bg,
    "--primary-hover": primary,
    "--primary-soft": `${primary}14`,
    "--brand-accent": accent,
    "--brand-accent-foreground": fg,
    "--brand-accent-hover": accent,
    "--secondary": "hsl(210 40% 96%)",
    "--secondary-foreground": fg,
    "--muted": "hsl(40 33% 97%)",
    "--muted-foreground": "hsl(215 25% 40%)",
    "--accent": "hsl(210 40% 96%)",
    "--accent-foreground": fg,
    "--border": "hsl(0 0% 89.8%)",
    "--input": "hsl(0 0% 89.8%)",
    "--ring": accent,
  };
}

function publicAssetNames(slug, pack = {}) {
  const favSrc = pack.assets?.favicon || "";
  const favExt = path.extname(favSrc) || ".ico";
  const favPublic =
    favExt === ".svg"
      ? "/favicon.svg"
      : favExt === ".png"
        ? "/favicon.png"
        : "/favicon.ico";
  return {
    logo: `/brand/${slug}-logo${path.extname(pack.assets?.logo || "") === ".svg" ? ".svg" : ".png"}`,
    favicon: favPublic,
    favicon32: `/favicon-32x32.png`,
  };
}

function buildBrandLanding() {
  return {
    primaryHref: LANDING_BOILERPLATE.primaryCta.href,
    secondaryHref: LANDING_BOILERPLATE.secondaryCta.href,
  };
}

function buildSitePatch(pack, publicPaths) {
  const id = pack.identity;
  return {
    company: {
      name: id.name,
      ...(id.legalName ? { legalName: id.legalName } : {}),
      ...(id.tagline ? { tagline: id.tagline } : {}),
      ...(id.description ? { description: id.description } : {}),
      ...(id.siteUrl ? { siteUrl: id.siteUrl } : {}),
      ...(id.contactEmail ? { contactEmail: id.contactEmail } : {}),
    },
    chrome: {
      header: "marketing",
      footer: "minimal",
      logoVariant: "wordmark",
      showBrandLogo: true,
      showThemeToggle: false,
      defaultTheme: "light",
      cookieBannerStyle: "bar",
    },
    features: {
      blog: false,
      chatFab: false,
      languageSelector: false,
      impressum: false,
      attribution: false,
      testimonials: false,
      poweredByBadge: false,
      cookieConsent: "off",
    },
    theme: {
      radius: "0.5rem",
      light: lightThemeFromColors(pack.colors),
    },
    assets: {
      logo: publicPaths.logo,
      logoDark: publicPaths.logo,
      logoLight: publicPaths.logo,
      wordmark: publicPaths.logo,
      wordmarkDark: publicPaths.logo,
      faviconIco: publicPaths.favicon,
      ...(publicPaths.favicon32 ? { icon32: publicPaths.favicon32 } : {}),
    },
    nav: {
      showAppLinks: false,
      links: [
        {
          labelKey: "home.hero.primaryCta",
          href: LANDING_BOILERPLATE.primaryCta.href,
          variant: "primary",
        },
      ],
      footerLinks: [],
    },
  };
}

function deepMerge(target, patch) {
  const out = { ...target };
  for (const [k, v] of Object.entries(patch)) {
    if (
      v &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      target[k] &&
      typeof target[k] === "object" &&
      !Array.isArray(target[k])
    ) {
      out[k] = deepMerge(target[k], v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

function patchSiteEnHero(filePath, landing) {
  let src = readFileSync(filePath, "utf8");
  const replacements = [
    ["headline", landing.headline],
    ["subhead", landing.subhead],
    ["primaryCta", landing.primaryCta.label],
  ];
  if (landing.secondaryCta?.label) {
    replacements.push(["secondaryCta", landing.secondaryCta.label]);
  }
  for (const [key, value] of replacements) {
    const re = new RegExp(`(${key}:\\s*)([\`"])([\\s\\S]*?)\\2`, "m");
    if (!re.test(src)) {
      console.warn(`Warning: could not patch home.hero.${key} in ${filePath}`);
      continue;
    }
    const escaped = JSON.stringify(value).slice(1, -1);
    src = src.replace(re, `$1$2${escaped}$2`);
  }
  writeFileSync(filePath, src);
}

function writePreview(outDir, pack, packDir, slug, publicPaths, sitePatch) {
  mkdirSync(path.join(outDir, "assets"), { recursive: true });
  writeFileSync(
    path.join(outDir, "site.brand-patch.json"),
    JSON.stringify(sitePatch, null, 2) + "\n",
  );
  writeFileSync(
    path.join(outDir, "brand-landing.json"),
    JSON.stringify(buildBrandLanding(), null, 2) + "\n",
  );
  writeFileSync(
    path.join(outDir, "home.copy.json"),
    JSON.stringify(
      {
        "home.hero.headline": LANDING_BOILERPLATE.headline,
        "home.hero.subhead": LANDING_BOILERPLATE.subhead,
        "home.hero.primaryCta": LANDING_BOILERPLATE.primaryCta.label,
        "home.hero.primaryCtaHref": LANDING_BOILERPLATE.primaryCta.href,
        "home.hero.secondaryCta": LANDING_BOILERPLATE.secondaryCta.label,
        "home.hero.secondaryCtaHref": LANDING_BOILERPLATE.secondaryCta.href,
      },
      null,
      2,
    ) + "\n",
  );

  const logoSrc = resolveAsset(packDir, pack.assets.logo);
  copyFileSync(logoSrc, path.join(outDir, "assets", path.basename(publicPaths.logo)));
  if (pack.assets.favicon) {
    copyFileSync(
      resolveAsset(packDir, pack.assets.favicon),
      path.join(outDir, "assets", path.basename(publicPaths.favicon)),
    );
  }

  writeFileSync(
    path.join(outDir, "APPLY.md"),
    `# Apply ${pack.identity.name}

Preview generated from \`${path.relative(repoRoot, path.join(packDir, "brand-pack.json"))}\`.

## Merge into a starter checkout

\`\`\`bash
node scripts/apply-brand-pack.mjs examples/${slug}/brand-pack.json --merge-into .
\`\`\`

Then wire the locale home to LightBrandHome (see examples/README.md).

Public asset paths expected after merge:
${JSON.stringify(publicPaths, null, 2)}
`,
  );
}

function mergeInto(targetRoot, pack, packDir, slug, publicPaths, sitePatch) {
  const sitePath = path.join(targetRoot, "config/site.json");
  if (!existsSync(sitePath)) die(`No config/site.json under ${targetRoot}`);

  const site = JSON.parse(readFileSync(sitePath, "utf8"));
  const merged = deepMerge(site, sitePatch);
  // Prefer single-locale English for generated light landings
  merged.locales = ["en"];
  merged.defaultLocale = "en";
  writeFileSync(sitePath, JSON.stringify(merged, null, 2) + "\n");

  const publicBrand = path.join(targetRoot, "public/brand");
  mkdirSync(publicBrand, { recursive: true });
  copyFileSync(
    resolveAsset(packDir, pack.assets.logo),
    path.join(targetRoot, "public", publicPaths.logo.replace(/^\//, "")),
  );
  if (pack.assets.favicon) {
    copyFileSync(
      resolveAsset(packDir, pack.assets.favicon),
      path.join(targetRoot, "public", publicPaths.favicon.replace(/^\//, "")),
    );
  }
  if (pack.assets.faviconFallback) {
    const fb = path.basename(pack.assets.faviconFallback);
    copyFileSync(
      resolveAsset(packDir, pack.assets.faviconFallback),
      path.join(targetRoot, "public", fb),
    );
  }
  if (pack.assets.favicon32) {
    copyFileSync(
      resolveAsset(packDir, pack.assets.favicon32),
      path.join(targetRoot, "public/favicon-32x32.png"),
    );
  }

  writeFileSync(
    path.join(targetRoot, "config/brand-landing.json"),
    JSON.stringify(buildBrandLanding(), null, 2) + "\n",
  );

  const enPath = path.join(targetRoot, "src/i18n/messages/site/en.ts");
  if (existsSync(enPath)) {
    patchSiteEnHero(enPath, {
      headline: LANDING_BOILERPLATE.headline,
      subhead: LANDING_BOILERPLATE.subhead,
      primaryCta: LANDING_BOILERPLATE.primaryCta,
      secondaryCta: LANDING_BOILERPLATE.secondaryCta,
    });
  } else {
    console.warn(`No ${enPath}; skipped hero copy patch`);
  }

  const notePath = path.join(targetRoot, "scratchpad/brand-previews", slug, "MERGE-NOTE.md");
  mkdirSync(path.dirname(notePath), { recursive: true });
  writeFileSync(
    notePath,
    `# Merged ${pack.identity.name}

Updated \`config/site.json\`, \`config/brand-landing.json\`, copied brand assets, patched \`home.hero.*\` in site/en.

Switch \`src/pages/[locale]/index.astro\` (and root \`src/pages/index.astro\` if needed) to \`LightBrandHome\` if it still mounts \`StarterHome\`.
Copy is shared boilerplate; only style fields were applied.
`,
  );
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const pack = loadPack(args.pack);
  const packDir = path.dirname(args.pack);
  const slug = slugify(pack.identity.name);
  const publicPaths = publicAssetNames(slug, pack);
  const sitePatch = buildSitePatch(pack, publicPaths);

  const previewDir = path.join(repoRoot, "scratchpad/brand-previews", slug);
  writePreview(previewDir, pack, packDir, slug, publicPaths, sitePatch);
  console.log(`Wrote preview → ${path.relative(repoRoot, previewDir)}`);

  if (args.mergeInto) {
    mergeInto(args.mergeInto, pack, packDir, slug, publicPaths, sitePatch);
    console.log(`Merged brand pack into ${args.mergeInto}`);
  }
}

main();
