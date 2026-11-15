import { mkdir, readFile, writeFile, cp } from "node:fs/promises";
import { resolve, join } from "node:path";
import {
  rendererPins,
  fileInventory,
} from "../../../scripts/generated-page/build.ts";
import type { BuildInputs } from "../../../scripts/generated-page/validate.ts";
export const root = resolve(import.meta.dirname, "../../..");
export async function fixtureInput(directory: string) {
  const manifest = JSON.parse(
    await readFile(
      join(root, "__tests__/fixtures/generated-page/page.json"),
      "utf8",
    ),
  );
  const pins = await rendererPins();
  manifest.renderer_contract.pinned_version = pins.starterSourceSha256;
  await mkdir(join(directory, "theme/icons"), { recursive: true });
  await mkdir(join(directory, "assets/brand"), { recursive: true });
  await cp(
    join(root, "public/brand/logo-h-spark-ink.svg"),
    join(directory, "assets/brand/logo-h-spark-ink.svg"),
  );
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="#123456"/></svg>';
  await writeFile(join(directory, "theme/icons/favicon.svg"), svg);
  await writeFile(
    join(directory, "theme/icons/manifest.json"),
    JSON.stringify({ files: [{ path: "icons/favicon.svg" }] }),
  );
  const site = JSON.parse(
    await readFile(join(root, "config/site.json"), "utf8"),
  );
  const variant = {
    mode: "light",
    tokens: site.theme.tokens,
    radius: "0.5rem",
    warnings: [],
    typography: [],
    nav: null,
    coverage: { score: 1, band: "full" },
    missing_tokens: [],
  };
  await writeFile(
    join(directory, "theme/theme.json"),
    JSON.stringify({
      schema_version: "cr.theme.v1",
      default: "light",
      site_mode: "light",
      variants: { light: variant },
      marks: [],
      fallback_wordmark: null,
      icons: "icons/manifest.json",
    }),
  );
  const input: BuildInputs = {
    format: "cr.generated-page.v1",
    organizationHandle: "example-workshop",
    publicOrigin: "https://example.test",
    mount: "/p/workshop/",
    visibility: "public",
    companyName: "Example workshop",
    pins,
    theme: {
      release: "fixture-theme-v1",
      files: await fileInventory(join(directory, "theme")),
    },
    assetAdmissionReceiptId: "fictional-product-asset-admission",
    assets: await fileInventory(join(directory, "assets")),
    factsLink: { label: "Company facts", href: "https://example.test/facts/" },
    contact: {
      appRef: "11111111-1111-4111-8111-111111111111",
      organizationHandle: "example-workshop",
      publicOrigin: "https://example.test",
      apiOrigin: "https://api.example.test",
      receiptId: "fixture-binding-receipt",
    },
  };
  input.chat = { ...input.contact!, publicApiKey: "fixture-public-key" };
  await writeFile(join(directory, "manifest.json"), JSON.stringify(manifest));
  await writeFile(join(directory, "build-input.json"), JSON.stringify(input));
  return { manifest, input };
}
