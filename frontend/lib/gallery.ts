/**
 * Gallery data contract and pure helpers.
 *
 * The gallery deliberately separates semantic metadata from the image file:
 *
 *   - `id` is the stable identity used by site configuration and future APIs.
 *   - `path` is relative to `frontend/public/` and is therefore portable to a
 *     CDN without changing the manifest or consuming pages.
 *   - collections, roles, tags, and dates are queryable metadata rather than
 *     information inferred from a filename.
 *
 * This module has no filesystem or Next.js imports. It can be used by server
 * loaders, client components, validation scripts, and future CDN tooling.
 */

export const GALLERY_MANIFEST_VERSION = 1 as const;

export const GALLERY_ROLES = [
  "profile",
  "avatar",
  "hero",
  "press",
  "portfolio",
  "event",
] as const;

/** Named derivatives are opt-in; the base asset remains the source of truth. */
export const GALLERY_VARIANTS = [
  "thumbnail",
  "card",
  "profile",
  "lightbox",
] as const;

export type GalleryRole = (typeof GALLERY_ROLES)[number];
export type GalleryVariantName = (typeof GALLERY_VARIANTS)[number];
export type GalleryCollectionKind = "collection" | "event";

export interface GalleryCollection {
  /** Stable identifier referenced by GalleryAsset.collectionIds. */
  id: string;
  /** Display data, intentionally kept out of the UI message bundles. */
  label: string;
  kind?: GalleryCollectionKind;
  date?: string;
  location?: string;
}

export interface GalleryCredit {
  name: string;
  url?: string;
  license?: string;
}

export interface GalleryVariant {
  /** Path relative to frontend/public/, just like GalleryAsset.path. */
  path: string;
  /** Intrinsic dimensions of this exact derivative. */
  width: number;
  height: number;
}

export interface GalleryAsset {
  /** Stable public identity, e.g. `mark-profile-2026`. */
  id: string;
  /** Path relative to `frontend/public/`, e.g. `gallery/profile/mark.jpg`. */
  path: string;
  /** Required accessible description. */
  alt: string;
  title?: string;
  caption?: string;
  /** Intrinsic dimensions prevent layout shift in grid consumers. */
  width?: number;
  height?: number;
  /** ISO date used for recency queries and chronological presentation. */
  date?: string;
  collectionIds?: readonly string[];
  tags?: readonly string[];
  roles?: readonly GalleryRole[];
  /** Optional pre-generated derivatives for CDN/static publishing. */
  variants?: Partial<Record<GalleryVariantName, GalleryVariant>>;
  credit?: GalleryCredit;
  featured?: boolean;
  sortOrder?: number;
}

export interface GalleryManifest {
  version: typeof GALLERY_MANIFEST_VERSION;
  collections: readonly GalleryCollection[];
  assets: readonly GalleryAsset[];
}

/** Client-ready form used by the shared browser and lightbox components. */
export interface GalleryImage extends Omit<GalleryAsset, "path"> {
  /** URL selected for the current display context, usually a card variant. */
  src: string;
  /** Optional higher-resolution URL used when the lightbox opens. */
  lightboxSrc?: string;
}

export interface GalleryAssetFilter {
  collectionId?: string;
  tag?: string;
  role?: GalleryRole;
  featured?: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(
  value: unknown,
  field: string,
  context: string,
): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(
      `[gallery] ${context} must contain a non-empty "${field}" string.`,
    );
  }
  return value.trim();
}

function optionalString(
  value: unknown,
  field: string,
  context: string,
): string | undefined {
  if (value === undefined) return undefined;
  return requiredString(value, field, context);
}

function optionalIsoDate(
  value: unknown,
  field: string,
  context: string,
): string | undefined {
  const date = optionalString(value, field, context);
  if (date !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(
      `[gallery] ${context}.${field} must be an ISO date (YYYY-MM-DD).`,
    );
  }
  return date;
}

function optionalStringArray(
  value: unknown,
  field: string,
  context: string,
): readonly string[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) {
    throw new Error(
      `[gallery] ${context}.${field} must be an array of strings.`,
    );
  }

  const values = value.map((item, index) =>
    requiredString(item, `${field}[${index}]`, context),
  );
  if (new Set(values).size !== values.length) {
    throw new Error(
      `[gallery] ${context}.${field} must not contain duplicates.`,
    );
  }
  return values;
}

function optionalRoles(
  value: unknown,
  context: string,
): readonly GalleryRole[] | undefined {
  const roles = optionalStringArray(value, "roles", context);
  if (!roles) return undefined;
  for (const role of roles) {
    if (!(GALLERY_ROLES as readonly string[]).includes(role)) {
      throw new Error(
        `[gallery] ${context}.roles contains unsupported role "${role}". ` +
          `Expected one of: ${GALLERY_ROLES.join(", ")}.`,
      );
    }
  }
  return roles as GalleryRole[];
}

function optionalPositiveInteger(
  value: unknown,
  field: string,
  context: string,
): number | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    throw new Error(
      `[gallery] ${context}.${field} must be a positive integer when present.`,
    );
  }
  return value;
}

function requiredPositiveInteger(
  value: unknown,
  field: string,
  context: string,
): number {
  const result = optionalPositiveInteger(value, field, context);
  if (result === undefined) {
    throw new Error(
      `[gallery] ${context}.${field} is required for a gallery variant.`,
    );
  }
  return result;
}

function optionalNonNegativeInteger(
  value: unknown,
  field: string,
  context: string,
): number | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    throw new Error(
      `[gallery] ${context}.${field} must be a non-negative integer when present.`,
    );
  }
  return value;
}

function optionalBoolean(
  value: unknown,
  field: string,
  context: string,
): boolean | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "boolean") {
    throw new Error(
      `[gallery] ${context}.${field} must be a boolean when present.`,
    );
  }
  return value;
}

function optionalCredit(
  value: unknown,
  context: string,
): GalleryCredit | undefined {
  if (value === undefined) return undefined;
  if (!isRecord(value)) {
    throw new Error(`[gallery] ${context}.credit must be an object.`);
  }
  return {
    name: requiredString(value.name, "name", `${context}.credit`),
    url: optionalString(value.url, "url", `${context}.credit`),
    license: optionalString(value.license, "license", `${context}.credit`),
  };
}

function publicRelativePath(
  value: unknown,
  field: string,
  context: string,
): string {
  const assetPath = requiredString(value, field, context);
  if (
    assetPath.startsWith("/") ||
    assetPath.includes("\\") ||
    assetPath.split("/").some((part) => !part || part === ".." || part === ".")
  ) {
    throw new Error(
      `[gallery] ${context}.${field} must be a normalized relative path under public/.`,
    );
  }
  return assetPath;
}

function optionalVariants(
  value: unknown,
  context: string,
): Partial<Record<GalleryVariantName, GalleryVariant>> | undefined {
  if (value === undefined) return undefined;
  if (!isRecord(value)) {
    throw new Error(`[gallery] ${context}.variants must be an object.`);
  }

  const variants: Partial<Record<GalleryVariantName, GalleryVariant>> = {};
  for (const [name, raw] of Object.entries(value)) {
    if (!(GALLERY_VARIANTS as readonly string[]).includes(name)) {
      throw new Error(
        `[gallery] ${context}.variants contains unsupported variant "${name}". ` +
          `Expected one of: ${GALLERY_VARIANTS.join(", ")}.`,
      );
    }
    if (!isRecord(raw)) {
      throw new Error(
        `[gallery] ${context}.variants.${name} must be an object.`,
      );
    }
    variants[name as GalleryVariantName] = {
      path: publicRelativePath(raw.path, "path", `${context}.variants.${name}`),
      width: requiredPositiveInteger(
        raw.width,
        "width",
        `${context}.variants.${name}`,
      ),
      height: requiredPositiveInteger(
        raw.height,
        "height",
        `${context}.variants.${name}`,
      ),
    };
  }
  return variants;
}

function validateCollection(
  value: unknown,
  index: number,
  filePath: string,
): GalleryCollection {
  const context = `collections[${index}] in ${filePath}`;
  if (!isRecord(value)) {
    throw new Error(`[gallery] ${context} must be an object.`);
  }

  const kind = value.kind;
  if (kind !== undefined && kind !== "collection" && kind !== "event") {
    throw new Error(
      `[gallery] ${context}.kind must be "collection" or "event".`,
    );
  }

  return {
    id: requiredString(value.id, "id", context),
    label: requiredString(value.label, "label", context),
    kind,
    date: optionalIsoDate(value.date, "date", context),
    location: optionalString(value.location, "location", context),
  };
}

function validateAsset(
  value: unknown,
  index: number,
  filePath: string,
): GalleryAsset {
  const context = `assets[${index}] in ${filePath}`;
  if (!isRecord(value)) {
    throw new Error(`[gallery] ${context} must be an object.`);
  }

  const assetPath = publicRelativePath(value.path, "path", context);

  const tags = optionalStringArray(value.tags, "tags", context);
  const collectionIds = optionalStringArray(
    value.collectionIds,
    "collectionIds",
    context,
  );
  const roles = optionalRoles(value.roles, context);

  return {
    id: requiredString(value.id, "id", context),
    path: assetPath,
    alt: requiredString(value.alt, "alt", context),
    title: optionalString(value.title, "title", context),
    caption: optionalString(value.caption, "caption", context),
    width: optionalPositiveInteger(value.width, "width", context),
    height: optionalPositiveInteger(value.height, "height", context),
    date: optionalIsoDate(value.date, "date", context),
    collectionIds,
    tags,
    roles,
    variants: optionalVariants(value.variants, context),
    credit: optionalCredit(value.credit, context),
    featured: optionalBoolean(value.featured, "featured", context),
    sortOrder: optionalNonNegativeInteger(
      value.sortOrder,
      "sortOrder",
      context,
    ),
  };
}

/** Parse and validate a gallery manifest without touching the filesystem. */
export function parseGalleryManifest(
  source: string,
  filePath: string,
): GalleryManifest {
  let parsed: unknown;
  try {
    parsed = JSON.parse(source);
  } catch (error) {
    throw new Error(`[gallery] Invalid JSON in ${filePath}.`, { cause: error });
  }

  if (!isRecord(parsed)) {
    throw new Error(`[gallery] Root of ${filePath} must be an object.`);
  }
  if (parsed.version !== GALLERY_MANIFEST_VERSION) {
    throw new Error(
      `[gallery] ${filePath} must declare version ${GALLERY_MANIFEST_VERSION}.`,
    );
  }
  if (!Array.isArray(parsed.collections)) {
    throw new Error(`[gallery] "collections" in ${filePath} must be an array.`);
  }
  if (!Array.isArray(parsed.assets)) {
    throw new Error(`[gallery] "assets" in ${filePath} must be an array.`);
  }

  const collections = parsed.collections.map((value, index) =>
    validateCollection(value, index, filePath),
  );
  const collectionIds = new Set(collections.map((collection) => collection.id));
  if (collectionIds.size !== collections.length) {
    throw new Error(`[gallery] Collection IDs in ${filePath} must be unique.`);
  }

  const assets = parsed.assets.map((value, index) =>
    validateAsset(value, index, filePath),
  );
  const assetIds = new Set(assets.map((asset) => asset.id));
  if (assetIds.size !== assets.length) {
    throw new Error(`[gallery] Asset IDs in ${filePath} must be unique.`);
  }

  for (const asset of assets) {
    for (const collectionId of asset.collectionIds ?? []) {
      if (!collectionIds.has(collectionId)) {
        throw new Error(
          `[gallery] Asset "${asset.id}" references unknown collection "${collectionId}".`,
        );
      }
    }
  }

  return { version: GALLERY_MANIFEST_VERSION, collections, assets };
}

/** Return the asset with an exact stable ID. */
export function getGalleryAssetById(
  assets: readonly GalleryAsset[],
  id: string | undefined,
): GalleryAsset | undefined {
  if (!id) return undefined;
  return assets.find((asset) => asset.id === id);
}

/** Return assets matching all supplied filter fields. */
export function filterGalleryAssets(
  assets: readonly GalleryAsset[],
  filter: GalleryAssetFilter = {},
): GalleryAsset[] {
  return assets.filter((asset) => {
    if (
      filter.collectionId &&
      !asset.collectionIds?.includes(filter.collectionId)
    ) {
      return false;
    }
    if (filter.tag && !asset.tags?.includes(filter.tag)) return false;
    if (filter.role && !asset.roles?.includes(filter.role)) return false;
    if (filter.featured !== undefined && asset.featured !== filter.featured) {
      return false;
    }
    return true;
  });
}

/**
 * Return the newest dated asset matching a filter. Explicit site-config IDs
 * should remain the canonical choice for a profile image; this helper is for
 * queries such as "show the latest press image" or tooling.
 */
export function getLatestGalleryAsset(
  assets: readonly GalleryAsset[],
  filter: GalleryAssetFilter = {},
): GalleryAsset | undefined {
  return [...filterGalleryAssets(assets, filter)].sort((a, b) => {
    const dateA = a.date ?? "";
    const dateB = b.date ?? "";
    if (dateA !== dateB) return dateB.localeCompare(dateA);
    return (
      (a.sortOrder ?? Number.MAX_SAFE_INTEGER) -
      (b.sortOrder ?? Number.MAX_SAFE_INTEGER)
    );
  })[0];
}

/**
 * Map a manifest path to a local public URL or a future CDN URL.
 *
 * `baseUrl` can be empty for the local site (`/gallery/...`) or an absolute
 * CDN root (`https://cdn.example.com/site-assets`). The manifest path remains
 * unchanged in both cases.
 */
export function galleryAssetUrl(
  asset: GalleryAsset,
  baseUrl = "",
  variant?: GalleryVariantName,
): string {
  const root = baseUrl.replace(/\/$/, "");
  const variantPath = variant ? asset.variants?.[variant]?.path : undefined;
  return `${root}/${variantPath ?? asset.path}`;
}

/** Convert a manifest asset into the transport shape used by client UI. */
export function toGalleryImage(
  asset: GalleryAsset,
  baseUrl = "",
  variant?: GalleryVariantName,
): GalleryImage {
  const { path: _path, ...metadata } = asset;
  const selectedVariant = variant ? asset.variants?.[variant] : undefined;
  const src = galleryAssetUrl(asset, baseUrl, variant);
  const originalSrc = galleryAssetUrl(asset, baseUrl);
  const lightboxSrc = asset.variants?.lightbox
    ? galleryAssetUrl(asset, baseUrl, "lightbox")
    : originalSrc;
  return {
    ...metadata,
    width: selectedVariant?.width ?? asset.width,
    height: selectedVariant?.height ?? asset.height,
    src,
    ...(src !== lightboxSrc ? { lightboxSrc } : {}),
  };
}
