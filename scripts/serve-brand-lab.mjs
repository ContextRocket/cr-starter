#!/usr/bin/env node
/**
 * Build + serve examples/lab/dist on port 3199 (Brand Lab).
 * Usage: node scripts/serve-brand-lab.mjs
 */

import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const dist = path.join(repoRoot, "examples/lab/dist");
const port = Number(process.env.BRAND_LAB_PORT || 3199);

const built = spawnSync(process.execPath, [path.join(__dirname, "build-brand-lab.mjs")], {
  stdio: "inherit",
  cwd: repoRoot,
});
if (built.status !== 0) process.exit(built.status ?? 1);

const types = {
  ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
};

const server = createServer((req, res) => {
  try {
    const url = new URL(req.url || "/", `http://127.0.0.1:${port}`);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith("/")) pathname += "index.html";
    if (pathname === "") pathname = "/index.html";
    const filePath = path.normalize(path.join(dist, pathname));
    if (!filePath.startsWith(dist)) {
      res.writeHead(403).end("Forbidden");
      return;
    }
    if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
      res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
    res.end(readFileSync(filePath));
  } catch (err) {
    res.writeHead(500).end(String(err));
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Brand Lab → http://127.0.0.1:${port}/`);
  console.log(`  index:  http://127.0.0.1:${port}/index.html`);
  console.log(`  rebuild + refresh after adding examples/*/brand-pack.json`);
});
