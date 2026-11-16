import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const root = new URL("../", import.meta.url);
const contract = JSON.parse(
  await readFile(new URL("contracts/embed-chat.json", root), "utf8"),
);
const fail = (message) => {
  throw new Error(`Invalid embed-chat consumer contract: ${message}`);
};
const source = await readFile(new URL("src/layouts/BaseLayout.astro", root), "utf8");
const emitted = [...new Set(source.match(/data-contextrocket-[a-z-]+/g) ?? [])].sort();
const declared = [...contract.scriptAttributes].sort();
const publishedUrlPattern =
  /^https:\/\/contextrocket\.cdn\.contextrocket\.com\/embeds\/chat\/v\d+\.\d+\.\d+\/widget\.js$/;

if (contract.contract !== "contextrocket.embed-chat.consumer.v1") fail("unexpected contract identifier");
if (!Array.isArray(contract.scriptAttributes) || new Set(declared).size !== declared.length) fail("script attributes must be unique");
if (JSON.stringify(emitted) !== JSON.stringify(declared)) fail("script attributes differ from BaseLayout.astro");
if (!publishedUrlPattern.test(contract.artifact?.publishedCdnUrl ?? "")) fail("published CDN URL must be version-pinned HTTPS");
if (!contract.artifact?.localSource || !existsSync(new URL(`public${contract.artifact.localSource}`, root))) fail("checked-in widget source is missing");
const siteConfig = JSON.parse(await readFile(new URL("config/site.json", root), "utf8"));
if (siteConfig.chat?.widgetSrc !== contract.artifact.localSource) fail("local widget source differs from config/site.json");
const docs = await readFile(new URL("docs/embed-direction.md", root), "utf8");
if (!docs.includes(contract.artifact.publishedCdnUrl)) fail("published CDN URL differs from embed direction");
console.log(`Embed-chat consumer contract is current for ${contract.consumer}.`);
