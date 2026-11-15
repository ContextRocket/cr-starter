import { expect, it } from "vitest";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { buildGeneratedPage } from "../../../scripts/generated-page/build";
import { fixtureInput, root } from "./support";
it("GENERATED-002: executes Astro twice and packages only the supplied page, assets and discovery deterministically", async () => {
  await mkdir(join(root, "scratchpad"), { recursive: true });
  const dir = await mkdtemp(join(root, "scratchpad/generated-archive-"));
  try {
    const inputDir = join(dir, "input");
    const { input } = await fixtureInput(inputDir);
    const first = await buildGeneratedPage({
      inputDirectory: inputDir,
      workDirectory: join(dir, "work-a"),
      outputDirectory: join(dir, "out-a"),
    });
    const second = await buildGeneratedPage({
      inputDirectory: inputDir,
      workDirectory: join(dir, "work-b"),
      outputDirectory: join(dir, "out-b"),
    });
    expect(first.build_hash).toBe(second.build_hash);
    expect(first.tar_bytes.equals(second.tar_bytes)).toBe(true);
    expect(first.receipt.routes).toEqual(["/p/workshop/"]);
    expect(first.receipt.renderer_id).toBe("cr-starter");
    expect(first.filePaths.filter((p) => p.endsWith(".html"))).toEqual([
      "p/workshop/index.html",
    ]);
    expect(
      first.filePaths.some(
        (p) => p.includes("facts") || p.includes("blog") || p.includes("/en/"),
      ),
    ).toBe(false);
    const html = await readFile(
      join(first.materializedSourceDirectory, "dist/p/workshop/index.html"),
      "utf8",
    );
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>alert('fixture')");
    expect(html).toContain("https://example.test/facts/");
    expect(html).toContain("11111111-1111-4111-8111-111111111111");
    expect(html).toContain("data-generated-lead-form");
    expect(html).toContain('data-contextrocket-mode="live"');
    expect(html).toContain('data-contextrocket-consent-gate="true"');
    expect(first.filePaths).toContain("embed/widget.js");
    expect(first.filePaths).toContain("embed/site-behaviors.js");
    expect(html).not.toContain('data-mode="demo"');
    expect(html).toContain("https://example.test/p/workshop/");
    input.pins.sdkSha256 = "0".repeat(64);
    await writeFile(join(inputDir, "build-input.json"), JSON.stringify(input));
    await expect(
      buildGeneratedPage({
        inputDirectory: inputDir,
        workDirectory: join(dir, "bad-work"),
        outputDirectory: join(dir, "bad-out"),
      }),
    ).rejects.toThrow("RENDERER_PIN");
    await writeFile(
      join(root, "scratchpad/generated-page-proof.tar.gz"),
      first.tar_bytes,
    );
    await writeFile(
      join(root, "scratchpad/generated-page-proof.json"),
      JSON.stringify(
        {
          build_hash: first.build_hash,
          receipt: first.receipt,
          inputManifest: first.inputManifest,
          filePaths: first.filePaths,
        },
        null,
        2,
      ),
    );
    console.info(
      `Generated page proof: ${first.build_hash}; ${first.filePaths.length} files; ${first.tar_bytes.length} archive bytes`,
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}, 90000);
