import { expect, it } from "vitest";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join, extname, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { Window } from "happy-dom";
import { buildGeneratedPage } from "../../../scripts/generated-page/build";
import { fixtureInput, root } from "./support";
async function mountedArchiveSmoke(
  archivePath: string,
  directory: string,
  mount: string,
) {
  await mkdir(directory);
  execFileSync("tar", ["-xzf", archivePath, "-C", directory]);
  const served = new Set<string>();
  const server = createServer(async (request, response) => {
    const path = new URL(request.url ?? "/", "http://fixture.test").pathname;
    if (!path.startsWith(mount)) {
      response.writeHead(404).end();
      return;
    }
    const file = resolve(directory, path.slice(mount.length) || "index.html");
    if (!file.startsWith(resolve(directory) + "/")) {
      response.writeHead(404).end();
      return;
    }
    try {
      const bytes = await readFile(file);
      const mime: Record<string, string> = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".svg": "image/svg+xml",
      };
      response
        .writeHead(200, {
          "content-type": mime[extname(file)] ?? "application/octet-stream",
        })
        .end(bytes);
      served.add(path);
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string")
    throw new Error("No fixture listener");
  const origin = `http://127.0.0.1:${address.port}`;
  const window = new Window({
    settings: {
      enableJavaScriptEvaluation: false,
      disableJavaScriptFileLoading: true,
      enableCSSFileLoading: false,
      enableImageFileLoading: false,
      enableIframePageLoading: false,
    },
  });
  try {
    const page = await fetch(origin + mount);
    expect(page.status).toBe(200);
    const html = await page.text();
    const document = new window.DOMParser().parseFromString(html, "text/html");
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    ).toBe("https://example.test" + mount);
    const resources = Array.from(
      document.querySelectorAll(
        'script[src], img[src], link[rel="stylesheet"], link[rel="modulepreload"], link[rel="preload"], link[rel="icon"], link[rel="manifest"]',
      ),
    ).map((node) => node.getAttribute("src") ?? node.getAttribute("href")!);
    for (const resource of resources) {
      // Only local reads: no script execution, capability requests or external fetches.
      expect(resource.startsWith(mount)).toBe(true);
      expect(resource).not.toContain(mount + mount.slice(1));
      const response = await fetch(origin + resource);
      expect(response.status, resource).toBe(200);
      if (resource.endsWith(".css")) {
        const css = await response.text();
        for (const match of css.matchAll(
          /url\(\s*["']?([^"')\s]+)["']?\s*\)/g,
        )) {
          if (match[1].startsWith("data:")) continue;
          const url = new URL(match[1], origin + resource);
          expect(url.origin).toBe(origin);
          expect((await fetch(url)).status, url.pathname).toBe(200);
        }
      }
    }
    expect([...served].some((p) => p.endsWith(".css"))).toBe(true);
    expect(
      [...served].some(
        (p) => p.includes("GeneratedContactForm") && p.endsWith(".js"),
      ),
    ).toBe(true);
    expect(served.has(mount + "embed/widget.js")).toBe(true);
    expect(served.has(mount + "embed/site-behaviors.js")).toBe(true);
    // The build packages a supplied asset even when this fixture's sections do
    // not reference it, so read it directly: nothing in the page links to it,
    // and asserting on `served` only ever described what the page linked to.
    const brandAsset = await fetch(
      origin + mount + "assets/brand/logo-h-spark-ink.svg",
    );
    expect(brandAsset.status, "supplied brand asset").toBe(200);
    expect((await fetch(origin + "/facts/")).status).toBe(404);
    expect((await fetch(origin + mount + "facts/")).status).toBe(404);
    return [...served].sort();
  } finally {
    await window.happyDOM.close();
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
}
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
      "index.html",
    ]);
    expect(
      first.filePaths.some(
        (p) => p.includes("facts") || p.includes("blog") || p.includes("/en/"),
      ),
    ).toBe(false);
    const html = await readFile(
      join(first.materializedSourceDirectory, "dist/index.html"),
      "utf8",
    );
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>alert('fixture')");
    expect(html).toContain("https://example.test/facts/");
    expect(html).toContain("11111111-1111-4111-8111-111111111111");
    expect(html).toContain("data-generated-contact-form");
    expect(html).toContain('data-contextrocket-mode="live"');
    expect(html).toContain('data-contextrocket-consent-gate="true"');
    expect(first.filePaths).toContain("embed/widget.js");
    expect(first.filePaths).toContain("embed/site-behaviors.js");
    expect(html).not.toContain('data-mode="demo"');
    expect(html).toContain("https://example.test/p/workshop/");
    const mountedResources = await mountedArchiveSmoke(
      first.archivePath,
      join(dir, "mounted"),
      input.mount,
    );
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
          mountedResources,
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
  // Two full Astro builds to prove byte-identical output, plus a third that
  // fails at the renderer-pin check. 90s could not fit one build here, so the
  // case could only ever time out rather than fail on its assertions.
}, 900000);
