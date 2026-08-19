import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import * as cli from "../src/cli.js";
import { buildTarGz, tarStaticExport, SiteDirError } from "../src/site-tar.js";
import { saveCredentials, type StoredCredentials } from "../src/credentials.js";
import type { FilePart, RestResponse, RestTransportPort } from "../src/api-client.js";

let home: string;
let workdir: string;
let outChunks: string[];
let errChunks: string[];
let restore: () => void;

beforeEach(() => {
  home = mkdtempSync(join(tmpdir(), "cr-cli-home-"));
  workdir = mkdtempSync(join(tmpdir(), "cr-cli-work-"));
  process.env.CONTEXTROCKET_HOME = home;
  outChunks = [];
  errChunks = [];
  const outSpy = vi
    .spyOn(process.stdout, "write")
    .mockImplementation((chunk: string | Uint8Array): boolean => {
      outChunks.push(typeof chunk === "string" ? chunk : Buffer.from(chunk).toString("utf-8"));
      return true;
    });
  const errSpy = vi
    .spyOn(process.stderr, "write")
    .mockImplementation((chunk: string | Uint8Array): boolean => {
      errChunks.push(typeof chunk === "string" ? chunk : Buffer.from(chunk).toString("utf-8"));
      return true;
    });
  restore = () => {
    outSpy.mockRestore();
    errSpy.mockRestore();
  };
});

afterEach(() => {
  restore();
  delete process.env.CONTEXTROCKET_HOME;
  delete process.env.CONTEXTROCKET_API_KEY;
  rmSync(home, { recursive: true, force: true });
  rmSync(workdir, { recursive: true, force: true });
});

function stdout(): string {
  return outChunks.join("");
}
function stderr(): string {
  return errChunks.join("");
}

const SAMPLE_CREDS: StoredCredentials = {
  apiBase: "http://localhost:8000",
  accessToken: "AT",
  refreshToken: "RT",
  expiresAt: 9_999_999_999,
  tokenType: "Bearer",
  scope: "context_graph:read",
  clientId: "cid-1",
  apiToken: "USER-JWT",
};

/** REST fake that captures the full request incl. multipart file parts. */
class CapturingRest implements RestTransportPort {
  requests: Array<{
    method: string;
    url: string;
    headers: Record<string, string>;
    files?: Record<string, FilePart>;
  }> = [];
  constructor(private readonly response: RestResponse) {}
  async request(
    method: string,
    url: string,
    opts: { headers: Record<string, string>; files?: Record<string, FilePart> },
  ): Promise<RestResponse> {
    this.requests.push({ method, url, headers: opts.headers, files: opts.files });
    return this.response;
  }
}

function makeStaticExport(dir: string): void {
  writeFileSync(join(dir, "index.html"), "<html>home</html>");
  mkdirSync(join(dir, "_next", "static", "chunks"), { recursive: true });
  writeFileSync(join(dir, "_next", "static", "chunks", "main-abc.js"), "x=1");
}

// ── tar builder (pure) ────────────────────────────────────────────────────────

describe("site-tar buildTarGz", () => {
  it("produces a gzip stream the standard tar reader accepts and refuses '..'", () => {
    const gz = buildTarGz([{ name: "index.html", data: Buffer.from("hi") }]);
    // gzip magic bytes
    expect(gz[0]).toBe(0x1f);
    expect(gz[1]).toBe(0x8b);
    // and it inflates to a non-empty tar payload
    expect(gunzipSync(gz).length).toBeGreaterThan(512);

    expect(() => buildTarGz([{ name: "../evil", data: Buffer.from("x") }])).toThrow(SiteDirError);
  });
});

describe("tarStaticExport dir validation", () => {
  it("rejects a missing index.html", () => {
    expect(() => tarStaticExport(workdir)).toThrow(SiteDirError);
    expect(() => tarStaticExport(workdir)).toThrow(/index\.html/);
  });

  it("rejects a server build (_next/server present)", () => {
    writeFileSync(join(workdir, "index.html"), "<html></html>");
    mkdirSync(join(workdir, "_next", "server"), { recursive: true });
    expect(() => tarStaticExport(workdir)).toThrow(/_next\/server/);
  });

  it("archives a valid static export", () => {
    makeStaticExport(workdir);
    const { bytes, fileCount } = tarStaticExport(workdir);
    expect(fileCount).toBe(2);
    expect(bytes.length).toBeGreaterThan(0);
  });
});

// ── sites publish command ──────────────────────────────────────────────────────

describe("sites publish", () => {
  it("tars the export and POSTs it with the Bearer token to the org endpoint", async () => {
    saveCredentials(home, SAMPLE_CREDS);
    makeStaticExport(workdir);
    const rest = new CapturingRest({
      statusCode: 200,
      jsonBody: {
        org_slug: "acme",
        url: "https://acme.cdn.contextrocket.com",
        files: 2,
        bytes: 20,
        invalidation_id: "INV-1",
      },
      content: Buffer.from(""),
    });
    cli.setRestTransportFactory(() => rest);

    const code = await cli.cmdSitesPublish({}, { org: "acme", dir: workdir });

    expect(code).toBe(0);
    const req = rest.requests[0];
    expect(req.method).toBe("POST");
    expect(req.url).toBe("http://localhost:8000/api/orgs/acme/sites/publish");
    expect(req.headers.Authorization).toBe("Bearer USER-JWT");
    // The tarball rides as a multipart file part named "tarball".
    expect(req.files?.tarball?.[0]).toBe("site.tar.gz");
    expect(req.files?.tarball?.[1].length).toBeGreaterThan(0);
    // stdout is the site URL only (scriptable); progress is on stderr.
    expect(stdout().trim().split("\n")[0]).toBe("https://acme.cdn.contextrocket.com");
    expect(stderr()).toContain("published");
  });

  it("fails closed with exit 2 on a directory that is not a static export", async () => {
    saveCredentials(home, SAMPLE_CREDS);
    // workdir has no index.html
    const code = await cli.cmdSitesPublish({}, { org: "acme", dir: workdir });
    expect(code).toBe(2);
    expect(stderr()).toContain("index.html");
  });

  it("fails closed with exit 1 when not logged in (empty api token)", async () => {
    saveCredentials(home, { ...SAMPLE_CREDS, apiToken: "" });
    makeStaticExport(workdir);
    const code = await cli.cmdSitesPublish({}, { org: "acme", dir: workdir });
    expect(code).toBe(1);
    expect(stderr()).toContain("Run 'contextrocket auth login'");
  });

  it("uses CONTEXTROCKET_API_KEY (crk_) directly and skips the OAuth store (CI path)", async () => {
    // No stored credentials AT ALL -- the env key is the only auth. This is the
    // headless CI / GitHub Actions flow: OAuth loopback cannot run.
    process.env.CONTEXTROCKET_API_KEY = "crk_ci_key_body";
    makeStaticExport(workdir);
    const rest = new CapturingRest({
      statusCode: 200,
      jsonBody: { org_slug: "kleos", url: "https://kleos.cdn.contextrocket.com", files: 2 },
      content: Buffer.from(""),
    });
    cli.setRestTransportFactory(() => rest);

    const code = await cli.cmdSitesPublish({}, { org: "kleos", dir: workdir });

    expect(code).toBe(0);
    const req = rest.requests[0];
    // The crk_ key rides as the Bearer -- the backend tiered path accepts it.
    expect(req.headers.Authorization).toBe("Bearer crk_ci_key_body");
    // No stored creds and no target flag -> the CLI defaults to PRODUCTION.
    expect(req.url).toBe("https://app-api.contextrocket.com/api/orgs/kleos/sites/publish");
  });

  it("trims the CONTEXTROCKET_API_KEY before attaching it", async () => {
    process.env.CONTEXTROCKET_API_KEY = "  crk_padded_key  ";
    makeStaticExport(workdir);
    const rest = new CapturingRest({
      statusCode: 200,
      jsonBody: { org_slug: "kleos", url: "https://kleos.cdn.contextrocket.com" },
      content: Buffer.from(""),
    });
    cli.setRestTransportFactory(() => rest);

    const code = await cli.cmdSitesPublish({}, { org: "kleos", dir: workdir });
    expect(code).toBe(0);
    expect(rest.requests[0].headers.Authorization).toBe("Bearer crk_padded_key");
  });

  it("falls back to the stored USER JWT when CONTEXTROCKET_API_KEY is empty", async () => {
    // Empty/whitespace env key must NOT be treated as an auth source; fall
    // through to the stored token so a set-but-blank var does not lock the user
    // out of their normal login.
    process.env.CONTEXTROCKET_API_KEY = "   ";
    saveCredentials(home, SAMPLE_CREDS);
    makeStaticExport(workdir);
    const rest = new CapturingRest({
      statusCode: 200,
      jsonBody: { org_slug: "acme", url: "https://acme.cdn.contextrocket.com" },
      content: Buffer.from(""),
    });
    cli.setRestTransportFactory(() => rest);

    const code = await cli.cmdSitesPublish({}, { org: "acme", dir: workdir });
    expect(code).toBe(0);
    expect(rest.requests[0].headers.Authorization).toBe("Bearer USER-JWT");
  });

  it("fails closed (exit 1) with empty env key AND not logged in", async () => {
    process.env.CONTEXTROCKET_API_KEY = "   ";
    // No stored credentials -- neither auth source is usable.
    makeStaticExport(workdir);
    const code = await cli.cmdSitesPublish({}, { org: "acme", dir: workdir });
    expect(code).toBe(1);
    expect(stderr()).toContain("Run 'contextrocket auth login'");
  });

  it("surfaces a backend 413 as a typed non-2xx error (exit 1)", async () => {
    saveCredentials(home, SAMPLE_CREDS);
    makeStaticExport(workdir);
    const rest = new CapturingRest({
      statusCode: 413,
      jsonBody: { detail: "ERROR_SITE_PUBLISH_TOO_LARGE" },
      content: Buffer.from(""),
    });
    cli.setRestTransportFactory(() => rest);

    const code = await cli.cmdSitesPublish({}, { org: "acme", dir: workdir });
    expect(code).toBe(1);
    expect(stderr()).toContain("ERROR_SITE_PUBLISH_TOO_LARGE");
  });
});
