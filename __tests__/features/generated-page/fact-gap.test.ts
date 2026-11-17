import { afterAll, expect, it } from "vitest";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { buildGeneratedPage } from "../../../scripts/generated-page/build";
import { fixtureInput, root } from "./support";

// A gap is our prompt, not the customer's copy. The generic renderer would
// otherwise print the question as page copy, which would leak our internal
// "we need this" note onto a published page.
const QUESTION = "How do B2B teams reach their buying committee?";
const FALLBACK = "We work with teams that need to reach specialist audiences.";

const dirs: string[] = [];
afterAll(async () => {
  for (const d of dirs.splice(0)) await rm(d, { recursive: true, force: true });
});

async function fixtureWithGaps(privateBuild: boolean) {
  await mkdir(join(root, "scratchpad"), { recursive: true });
  const dir = await mkdtemp(join(root, "scratchpad/generated-fact-gap-"));
  dirs.push(dir);
  const inputDir = join(dir, "input");
  const { manifest, input } = await fixtureInput(inputDir);
  manifest.sections = [
    ...manifest.sections.filter(
      (section: Record<string, unknown>) => section.type !== "contact_form",
    ),
    {
      id: "gap-buyers",
      order: 7,
      type: "fact_gap",
      variant: "gap_prompt",
      gap_id: "gap-buyers",
      question: QUESTION,
      fallback: FALLBACK,
    },
    {
      id: "gap-proof",
      order: 8,
      type: "fact_gap",
      variant: "gap_prompt",
      gap_id: "gap-proof",
      question: "Which proof point should we lead with?",
    },
  ];
  if (privateBuild) {
    input.visibility = "private";
    delete input.contact;
    delete input.chat;
    manifest.search = {
      ...manifest.search,
      indexing_intent: "noindex",
      sitemap_include: false,
      robots_intent: "noindex,nofollow",
    };
  }
  await writeFile(join(inputDir, "manifest.json"), JSON.stringify(manifest));
  await writeFile(join(inputDir, "build-input.json"), JSON.stringify(input));
  return { dir, inputDir };
}

async function builtHtml(dir: string, inputDir: string) {
  const artifact = await buildGeneratedPage({
    inputDirectory: inputDir,
    workDirectory: join(dir, "work"),
    outputDirectory: join(dir, "out"),
  });
  return readFile(
    join(artifact.materializedSourceDirectory, "dist/index.html"),
    "utf8",
  );
}

it("GENERATED-004: a private build marks our question, a public build shows its fallback or omits it", async () => {
  const privateBuild = await fixtureWithGaps(true);
  const privateHtml = await builtHtml(privateBuild.dir, privateBuild.inputDir);
  expect(privateHtml).toContain("We need this from you");
  expect(privateHtml).toContain(QUESTION);
  expect(privateHtml).not.toContain(FALLBACK);

  const publicBuild = await fixtureWithGaps(false);
  const publicHtml = await builtHtml(publicBuild.dir, publicBuild.inputDir);
  expect(publicHtml).not.toContain("We need this from you");
  expect(publicHtml).not.toContain(QUESTION);
  expect(publicHtml).not.toContain("Which proof point should we lead with?");
  expect(publicHtml).toContain(FALLBACK);
  // A gap with no fallback is omitted rather than rendered empty.
  expect(publicHtml).not.toContain('id="gap-proof"');
  // Two real Astro builds: one page each, ~130s per build on a cold Vite
  // cache. 180s could never fit both, so the witness could only ever time out
  // rather than fail on its assertions.
}, 600000);
