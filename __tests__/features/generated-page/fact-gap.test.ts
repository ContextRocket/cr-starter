import { afterAll, expect, it } from "vitest";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import GeneratedPage from "../../../src/components/generated/GeneratedPage.astro";
import { fixtureInput, root } from "./support";

// A gap is our prompt, not the customer's copy. The generic renderer would
// otherwise print the question as page copy, which would leak our internal
// "we need this" note onto a published page.
//
// Rendered in-process rather than through a site build: the assertion is about
// which branch the component takes, and a build costs minutes to prove the
// same thing.
const QUESTION = "How do B2B teams reach their buying committee?";
const UNANSWERED = "Which proof point should we lead with?";
const FALLBACK = "We work with teams that need to reach specialist audiences.";

const dirs: string[] = [];

afterAll(async () => {
  for (const dir of dirs.splice(0)) await rm(dir, { recursive: true, force: true });
});

async function manifestWithGaps() {
  await mkdir(join(root, "scratchpad"), { recursive: true });
  const dir = await mkdtemp(join(root, "scratchpad/generated-fact-gap-"));
  dirs.push(dir);
  const { manifest, input } = await fixtureInput(dir);
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
      question: UNANSWERED,
    },
  ];
  return { manifest, input };
}

it("GENERATED-004: a private render marks our question; a public render shows its fallback or omits it", async () => {
  const container = await AstroContainer.create();

  const privateFixture = await manifestWithGaps();
  const privateInput = {
    ...privateFixture.input,
    visibility: "private",
  } as Record<string, unknown>;
  // A contact-enabled build counts as public, so the marked branch needs both.
  delete privateInput.contact;
  delete privateInput.chat;
  const privateHtml = await container.renderToString(GeneratedPage, {
    props: { manifest: privateFixture.manifest, input: privateInput } as never,
  });
  expect(privateHtml).toContain("We need this from you");
  expect(privateHtml).toContain(QUESTION);
  expect(privateHtml).not.toContain(FALLBACK);

  const publicFixture = await manifestWithGaps();
  const publicHtml = await container.renderToString(GeneratedPage, {
    props: {
      manifest: publicFixture.manifest,
      input: publicFixture.input,
    } as never,
  });
  expect(publicHtml).not.toContain("We need this from you");
  expect(publicHtml).not.toContain(QUESTION);
  expect(publicHtml).not.toContain(UNANSWERED);
  expect(publicHtml).toContain(FALLBACK);
  // A gap with no fallback is omitted rather than rendered empty.
  expect(publicHtml).not.toContain('id="gap-proof"');
});

it("GENERATED-004b: a contact-enabled build never shows the question", async () => {
  const container = await AstroContainer.create();
  const { manifest, input } = await manifestWithGaps();
  const html = await container.renderToString(GeneratedPage, {
    props: {
      manifest,
      input: { ...input, visibility: "private" } as never,
    } as never,
  });
  // `contact` is present in the fixture, so even a "private" input is a public
  // surface: the question must not reach it.
  expect(html).not.toContain(QUESTION);
  expect(html).not.toContain("We need this from you");
});
