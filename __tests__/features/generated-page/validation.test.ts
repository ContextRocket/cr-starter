import { afterEach, expect, it } from "vitest";
import { mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { fixtureInput, root } from "./support";
import {
  validateInputs,
  validateManifest,
} from "../../../scripts/generated-page/validate";
const dirs: string[] = [];
afterEach(async () => {
  for (const d of dirs.splice(0)) await rm(d, { recursive: true, force: true });
});
async function fixture() {
  await mkdir(join(root, "scratchpad"), { recursive: true });
  const dir = await mkdtemp(join(root, "scratchpad/generated-validation-"));
  dirs.push(dir);
  return fixtureInput(dir);
}
const schema = JSON.parse(
  await readFile(
    join(root, "schemas/landing-page-manifest.schema.json"),
    "utf8",
  ),
);
it("GENERATED-001: accepts the supplied English manifest and exact App binding", async () => {
  const { manifest, input } = await fixture();
  expect(validateManifest(manifest, schema, validateInputs(input)).route).toBe(
    "/p/workshop/",
  );
});
it("GENERATED-001: accepts a source-matching article route outside the landing namespace", async () => {
  const { manifest, input } = await fixture();
  const articleMount = "/journal/solar-storage/";
  manifest.route = articleMount;
  input.mount = articleMount;
  expect(validateManifest(manifest, schema, validateInputs(input)).route).toBe(
    articleMount,
  );
});
it("GENERATED-001: accepts the organization root when explicitly selected", async () => {
  const { input } = await fixture();
  expect(validateInputs({ ...input, mount: "/" }).mount).toBe("/");
});
it.each([
  [
    "wrong locale",
    (m: Record<string, unknown>) => {
      m.locale = "de";
    },
    "UNSUPPORTED_LOCALE",
  ],
  [
    "unsupported visible section",
    (m: Record<string, unknown>) => {
      m.sections = [
        {
          id: "quotes",
          order: 0,
          type: "testimonial",
          title: "Quotes",
          items: [{ id: "one", author: "Fiction", quote: "Quote" }],
        },
      ];
    },
    "UNSUPPORTED_SECTION",
  ],
  [
    "executable field",
    (m: Record<string, unknown>) => {
      m.html = "<script />";
    },
    "MANIFEST_SCHEMA",
  ],
  [
    "foreign App",
    (m: Record<string, unknown>) => {
      (
        (m.sections as Record<string, unknown>[])[2].binding as Record<
          string,
          unknown
        >
      ).public_app_ref = "22222222-2222-4222-8222-222222222222";
    },
    "CAPABILITY_BINDING",
  ],
  [
    "route cutover",
    (m: Record<string, unknown>) => {
      m.route = "/cr/workshop/";
    },
    "SUBJECT_ROUTE_MISMATCH",
  ],
  [
    "unsafe CTA",
    (m: Record<string, unknown>) => {
      (m.sections as Record<string, unknown>[])[0].actions = [
        { label: "Unsafe", href: "javascript:alert(1)", kind: "external_url" },
      ];
    },
    "UNSAFE_LINK",
  ],
])("GENERATED-001: refuses %s", async (_name, edit, code) => {
  const { manifest, input } = await fixture();
  edit(manifest);
  expect(() => validateManifest(manifest, schema, input)).toThrow(code);
});
it("GENERATED-001: refuses absent contact authority and wrong configured origin", async () => {
  const { manifest, input } = await fixture();
  expect(() =>
    validateManifest(manifest, schema, { ...input, contact: undefined }),
  ).toThrow("CAPABILITY_BINDING");
  expect(() =>
    validateInputs({
      ...input,
      contact: { ...input.contact, publicOrigin: "https://other.test" },
    }),
  ).toThrow("CAPABILITY_BINDING");
});

it("GENERATED-001: requires product admission for the pinned canonical asset bytes", async () => {
  const { input } = await fixture();
  expect(() =>
    validateInputs({ ...input, assetAdmissionReceiptId: "" }),
  ).toThrow("ASSET_ADMISSION_REQUIRED");
});

it.each([
  "journal/solar-storage/",
  "/journal//solar/",
  "/journal/../solar/",
  "/facts/article/",
])("GENERATED-001: refuses unsafe or reserved page mount %s", async (mount) => {
  const { input } = await fixture();
  expect(() => validateInputs({ ...input, mount })).toThrow(
    "UNSUPPORTED_ROUTE",
  );
});
