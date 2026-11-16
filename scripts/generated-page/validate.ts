import { Ajv2020 } from "ajv/dist/2020.js";
import type { AnySchema } from "ajv";
import formats from "ajv-formats";

export type JsonObject = Record<string, unknown>;
export class GeneratedPageError extends Error {
  code: string;
  constructor(code: string, detail: string) {
    super(`${code}: ${detail}`);
    this.code = code;
  }
}
export function fail(code: string, detail: string): never {
  throw new GeneratedPageError(code, detail);
}
export function object(value: unknown): JsonObject {
  if (!value || typeof value !== "object" || Array.isArray(value))
    fail("INVALID_INPUT", "Expected an object");
  return value as JsonObject;
}
export function text(value: unknown): string {
  if (typeof value !== "string") fail("INVALID_INPUT", "Expected text");
  return value;
}
export function array(value: unknown): unknown[] {
  if (!Array.isArray(value)) fail("INVALID_INPUT", "Expected a list");
  return value;
}
export function safePath(value: string): string {
  if (
    !/^[a-zA-Z0-9][a-zA-Z0-9_./-]*$/.test(value) ||
    value.split("/").some((p) => !p || p === "." || p === "..")
  )
    fail("UNSAFE_PATH", value);
  return value;
}
export function httpsOrigin(value: string): string {
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    url.origin !== value ||
    url.username ||
    url.password
  )
    fail("UNSAFE_ORIGIN", value);
  return value;
}
export function validatePageMount(value: unknown): string {
  const mount = text(value);
  if (mount === "/") return mount;
  if (
    mount.length > 512 ||
    !mount.startsWith("/") ||
    !mount.endsWith("/") ||
    mount.includes("//")
  )
    fail("UNSUPPORTED_ROUTE", "Expected a safe absolute page mount");
  const segments = mount.slice(1, -1).split("/");
  if (
    segments.some(
      (segment) =>
        !/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(segment) ||
        segment === "." ||
        segment === "..",
    ) ||
    ["facts", "theme", "_releases"].includes(segments[0]!)
  )
    fail("UNSUPPORTED_ROUTE", "Page mount is unsafe or reserved");
  return mount;
}
export function safeHref(value: string): string {
  if (
    /^#[a-zA-Z][\w-]*$/.test(value) ||
    /^\/[a-zA-Z0-9][a-zA-Z0-9_/-]*\/?(?:#[\w-]+)?$/.test(value)
  )
    return value;
  if (/^mailto:[^\s<>"'?#]+@[^\s<>"'?#]+$/.test(value)) return value;
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password)
    fail("UNSAFE_LINK", value);
  return value;
}
export interface CapabilityBinding {
  appRef: string;
  organizationHandle: string;
  publicOrigin: string;
  apiOrigin: string;
  receiptId: string;
}
export interface BuildInputs {
  format: "cr.generated-page.v1";
  organizationHandle: string;
  publicOrigin: string;
  mount: string;
  visibility: "public" | "private";
  companyName: string;
  pins: Record<string, string>;
  theme: { release: string; files: Record<string, string> };
  assets: Record<string, string>;
  /** Upstream product admission, including SVG safety; hashes alone do not establish admission. */
  assetAdmissionReceiptId: string;
  factsLink?: { label: string; href: string };
  contact?: CapabilityBinding;
  chat?: CapabilityBinding & { publicApiKey: string };
}
export function validateInputs(raw: unknown): BuildInputs {
  const o = object(raw);
  const allowed = [
    "format",
    "organizationHandle",
    "publicOrigin",
    "mount",
    "visibility",
    "companyName",
    "pins",
    "theme",
    "assets",
    "assetAdmissionReceiptId",
    "factsLink",
    "contact",
    "chat",
  ];
  if (Object.keys(o).some((k) => !allowed.includes(k)))
    fail("INVALID_INPUT", "Unknown build input");
  if (
    o.format !== "cr.generated-page.v1" ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(text(o.organizationHandle))
  )
    fail("INVALID_INPUT", "Format or Organization handle");
  if (!text(o.assetAdmissionReceiptId).trim())
    fail(
      "ASSET_ADMISSION_REQUIRED",
      "Product-admitted canonical asset bytes are required",
    );
  httpsOrigin(text(o.publicOrigin));
  validatePageMount(o.mount);
  if (
    !["public", "private"].includes(text(o.visibility)) ||
    !text(o.companyName).trim()
  )
    fail("INVALID_INPUT", "Visibility or company name");
  for (const hashes of [
    object(o.pins),
    object(o.assets),
    object(object(o.theme).files),
  ]) {
    for (const value of Object.values(hashes))
      if (!text(value)) fail("MISSING_PIN", "Empty pin");
  }
  if (!text(object(o.theme).release)) fail("MISSING_PIN", "Theme release");
  if (o.factsLink) {
    const link = object(o.factsLink);
    text(link.label);
    safeHref(text(link.href));
  }
  for (const key of ["contact", "chat"]) {
    if (!o[key]) continue;
    const binding = object(o[key]);
    const allowedBinding = [
      "appRef",
      "organizationHandle",
      "publicOrigin",
      "apiOrigin",
      "receiptId",
      ...(key === "chat" ? ["publicApiKey"] : []),
    ];
    if (Object.keys(binding).some((k) => !allowedBinding.includes(k)))
      fail("CAPABILITY_BINDING", "Unexpected credential or binding field");
    if (
      binding.organizationHandle !== o.organizationHandle ||
      binding.publicOrigin !== o.publicOrigin ||
      !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(
        text(binding.appRef),
      ) ||
      !text(binding.receiptId)
    )
      fail("CAPABILITY_BINDING", key);
    httpsOrigin(text(binding.apiOrigin));
    if (
      key === "chat" &&
      !/^[A-Za-z0-9_.-]{8,4096}$/.test(text(binding.publicApiKey))
    )
      fail("CAPABILITY_BINDING", "Chat publishable key");
  }
  return o as unknown as BuildInputs;
}
const supported = new Set([
  "hero",
  "rich_text",
  "media",
  "logo_strip",
  "proof_stat",
  "feature_grid",
  "faq",
  "cta",
  "lead_form",
]);
export function validateManifest(
  raw: unknown,
  schema: unknown,
  input: BuildInputs,
): JsonObject {
  const ajv = new Ajv2020({ strict: false, allErrors: true });
  formats.default(ajv);
  const validate = ajv.compile(schema as AnySchema);
  if (!validate(raw)) fail("MANIFEST_SCHEMA", ajv.errorsText(validate.errors));
  const manifest = object(raw);
  if (manifest.locale !== "en")
    fail("UNSUPPORTED_LOCALE", "Only English is supported");
  if (
    manifest.route !== input.mount ||
    manifest.organization_ref !== input.organizationHandle
  )
    fail("SUBJECT_ROUTE_MISMATCH", "Manifest and build target differ");
  const renderer = object(manifest.renderer_contract);
  if (
    renderer.renderer_id !== "cr-starter" ||
    renderer.min_version !== input.pins.starterVersion ||
    renderer.pinned_version !== input.pins.starterSourceSha256
  )
    fail("RENDERER_PIN", "Manifest must select this exact starter source");
  if (object(manifest.analytics ?? {}).enabled)
    fail("UNSUPPORTED_ANALYTICS", "No configured analytics adapter");
  const search = object(manifest.search);
  if (search.canonical_intent !== "self")
    fail("UNSUPPORTED_CANONICAL", "Only explicit self canonical is supported");
  if (
    input.visibility === "private" &&
    (search.sitemap_include ||
      search.indexing_intent !== "noindex" ||
      search.robots_intent !== "noindex,nofollow")
  )
    fail("PRIVATE_INDEXING", "Private builds must not be indexed");
  const assets = array(manifest.assets ?? []).map(object);
  const ids = new Set<string>();
  for (const asset of assets) {
    const id = text(asset.asset_id);
    if (ids.has(id)) fail("DUPLICATE_ASSET", id);
    ids.add(id);
    safePath(text(asset.local_path));
    if (
      !input.assets[text(asset.local_path)] ||
      asset.review_state !== "approved" ||
      !["owned", "licensed"].includes(text(asset.rights_posture))
    )
      fail("ASSET_PIN", id);
  }
  const sections = array(manifest.sections ?? [])
    .map(object)
    .filter((s) => s.visible !== false);
  const sectionIds = new Set<string>();
  for (const section of sections) {
    const id = text(section.id);
    if (!/^[a-zA-Z][\w-]*$/.test(id) || sectionIds.has(id))
      fail("SECTION_ID", id);
    sectionIds.add(id);
    const kind = text(section.type);
    if (
      !supported.has(kind) ||
      (section.variant !== undefined && section.variant !== "default")
    )
      fail("UNSUPPORTED_SECTION", kind);
    for (const id of array(section.asset_ids ?? []))
      if (!ids.has(text(id))) fail("UNRESOLVED_ASSET", text(id));
    for (const action of array(section.actions ?? []).map(object))
      safeHref(text(action.href));
    if (kind === "cta" && section.destination_kind !== "form_binding")
      safeHref(text(section.href));
    if (kind === "lead_form") {
      const binding = object(section.binding);
      if (!input.contact || binding.public_app_ref !== input.contact.appRef)
        fail("CAPABILITY_BINDING", "Lead form App mismatch or missing binding");
      safeHref(text(binding.privacy_url));
      const fields = array(binding.fields).map(object);
      // These are canonical Contact fields, not a second form-data model.
      const allowed = new Set(["name", "email", "phone", "company", "message"]);
      const names = fields.map((f) => text(f.name));
      if (
        new Set(names).size !== names.length ||
        names.some((n) => !allowed.has(n)) ||
        !fields.some((f) => f.name === "name" && f.required !== false)
      )
        fail(
          "UNSUPPORTED_FORM_FIELDS",
          "A required name and canonical Contact fields are supported",
        );
    }
  }
  for (const section of sections.filter(
    (s) => s.type === "cta" && s.destination_kind === "form_binding",
  )) {
    if (
      !sections.some(
        (s) =>
          s.type === "lead_form" &&
          object(s.binding).binding_id === section.form_binding_id,
      )
    )
      fail("CAPABILITY_BINDING", "CTA has no visible form");
  }
  for (const binding of array(manifest.form_bindings ?? []).map(object)) {
    if (!input.contact || binding.public_app_ref !== input.contact.appRef)
      fail("CAPABILITY_BINDING", "Top-level App binding mismatch");
  }
  return manifest;
}
