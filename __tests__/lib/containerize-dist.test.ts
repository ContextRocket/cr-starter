import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { it } from "vitest";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

it("rewrites meta refresh targets along with links for a mounted container build", () => {
  mkdirSync(path.join(root, "scratchpad"), { recursive: true });
  const scratch = mkdtempSync(path.join(root, "scratchpad/containerize-dist-"));
  const dist = path.join(scratch, "dist");
  mkdirSync(dist);
  writeFileSync(
    path.join(dist, "index.html"),
    '<!doctype html><meta http-equiv="refresh" content="2;url=/en/"><a href="/en/">Continue</a>',
  );

  try {
    execFileSync("node", ["scripts/containerize-dist.mjs"], {
      cwd: root,
      env: {
        ...process.env,
        CONTAINER_BASE: "/site",
        CONTAINER_DIST: path.relative(root, dist),
      },
    });
    const html = readFileSync(path.join(dist, "index.html"), "utf8");
    assert.match(html, /content="2;url=\/site\/en\/"/);
    assert.match(html, /href="\/site\/en\/"/);
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
});
