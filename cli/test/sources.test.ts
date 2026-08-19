import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import * as cli from "../src/cli.js";
import { saveCredentials, type StoredCredentials } from "../src/credentials.js";
import type { FilePart, RestResponse, RestTransportPort } from "../src/api-client.js";

let home: string;
let workdir: string;
let output: string[];
let errors: string[];
let restore: () => void;

const credentials: StoredCredentials = {
  apiBase: "http://localhost:8000",
  accessToken: "AT",
  refreshToken: "RT",
  expiresAt: 9_999_999_999,
  tokenType: "Bearer",
  scope: "context_graph:read",
  clientId: "cli-test",
  apiToken: "USER-JWT",
};

class CapturingRest implements RestTransportPort {
  requests: Array<{
    method: string;
    url: string;
    headers: Record<string, string>;
    params?: Record<string, string>;
    files?: Record<string, FilePart>;
    form?: Record<string, string>;
  }> = [];

  constructor(private readonly response: RestResponse) {}

  async request(
    method: string,
    url: string,
    opts: {
      headers: Record<string, string>;
      params?: Record<string, string>;
      files?: Record<string, FilePart>;
      form?: Record<string, string>;
    },
  ): Promise<RestResponse> {
    this.requests.push({ method, url, ...opts });
    return this.response;
  }
}

beforeEach(() => {
  home = mkdtempSync(join(tmpdir(), "cr-cli-sources-home-"));
  workdir = mkdtempSync(join(tmpdir(), "cr-cli-sources-work-"));
  process.env.CONTEXTROCKET_HOME = home;
  output = [];
  errors = [];
  const outSpy = vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
    output.push(typeof chunk === "string" ? chunk : Buffer.from(chunk).toString());
    return true;
  });
  const errSpy = vi.spyOn(process.stderr, "write").mockImplementation((chunk) => {
    errors.push(typeof chunk === "string" ? chunk : Buffer.from(chunk).toString());
    return true;
  });
  restore = () => {
    outSpy.mockRestore();
    errSpy.mockRestore();
  };
  saveCredentials(home, credentials);
});

afterEach(() => {
  restore();
  delete process.env.CONTEXTROCKET_HOME;
  rmSync(home, { recursive: true, force: true });
  rmSync(workdir, { recursive: true, force: true });
});

describe("sources commands", () => {
  it("lists source records as scriptable tab-separated lines", async () => {
    const rest = new CapturingRest({
      statusCode: 200,
      jsonBody: { items: [{ id: "src-1", source_type: "uploaded_document", title: "About" }] },
      content: Buffer.from(""),
    });
    cli.setRestTransportFactory(() => rest);

    expect(await cli.cmdSourcesLs({}, { org: "acme", limit: "10" })).toBe(0);
    expect(rest.requests[0]).toMatchObject({
      method: "GET",
      url: "http://localhost:8000/api/orgs/acme/sources",
      params: { limit: "10" },
    });
    expect(output.join("").trim()).toBe("src-1\tuploaded_document\tAbout");
  });

  it("uploads a source with the documented multipart fields", async () => {
    const file = join(workdir, "about.md");
    writeFileSync(file, "# About");
    const rest = new CapturingRest({
      statusCode: 201,
      jsonBody: { id: "src-uploaded" },
      content: Buffer.from(""),
    });
    cli.setRestTransportFactory(() => rest);

    expect(
      await cli.cmdSourcesUpload({}, {
        org: "acme",
        file,
        sourceType: "uploaded_document",
        contextScope: "company",
        description: "Brand facts",
      }),
    ).toBe(0);
    expect(rest.requests[0]).toMatchObject({
      method: "POST",
      url: "http://localhost:8000/api/orgs/acme/sources/uploads/file",
      form: { source_type: "uploaded_document", context_scope: "company", description: "Brand facts" },
    });
    expect(rest.requests[0].files?.file?.[0]).toBe("about.md");
    expect(rest.requests[0].files?.file?.[1].toString()).toBe("# About");
    expect(output.join("").trim()).toBe("src-uploaded");
  });

  it("downloads and removes a source by ID", async () => {
    const outputFile = join(workdir, "download.md");
    const rest = new CapturingRest({
      statusCode: 200,
      jsonBody: { bytes_deleted: 7 },
      content: Buffer.from("# Downloaded"),
    });
    cli.setRestTransportFactory(() => rest);

    expect(await cli.cmdSourcesDownload({}, { org: "acme", id: "src-1", out: outputFile })).toBe(0);
    expect(readFileSync(outputFile, "utf8")).toBe("# Downloaded");
    expect(await cli.cmdSourcesRm({}, { org: "acme", id: "src-1" })).toBe(0);
    expect(rest.requests.map((request) => `${request.method} ${request.url}`)).toEqual([
      "GET http://localhost:8000/api/orgs/acme/sources/documents/src-1",
      "DELETE http://localhost:8000/api/orgs/acme/sources/src-1",
    ]);
    expect(errors.join(" ")).toContain("removed source src-1");
  });

  it("rejects unsupported source types before network access", async () => {
    const rest = new CapturingRest({ statusCode: 200, jsonBody: {}, content: Buffer.from("") });
    cli.setRestTransportFactory(() => rest);
    const file = join(workdir, "about.md");
    writeFileSync(file, "# About");

    expect(
      await cli.cmdSourcesUpload({}, {
        org: "acme",
        file,
        sourceType: "unknown",
        contextScope: "company",
      }),
    ).toBe(2);
    expect(rest.requests).toHaveLength(0);
    expect(errors.join(" ")).toContain("unsupported source type");
  });
});
