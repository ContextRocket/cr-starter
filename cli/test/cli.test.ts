import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import * as cli from "../src/cli.js";
import { saveCredentials, loadCredentials, type StoredCredentials } from "../src/credentials.js";
import type { CallbackResult, HttpResponse, HttpTransportPort } from "../src/oauth-flow.js";
import type { RestResponse, RestTransportPort } from "../src/api-client.js";

let home: string;
let outChunks: string[];
let errChunks: string[];
let restore: () => void;

beforeEach(() => {
  home = mkdtempSync(join(tmpdir(), "cr-cli-"));
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
  rmSync(home, { recursive: true, force: true });
});

function stdout(): string {
  return outChunks.join("");
}
function stderr(): string {
  return errChunks.join("");
}

// ── Fakes ────────────────────────────────────────────────────────────────────

class FakeOAuthTransport implements HttpTransportPort {
  async postJson(url: string): Promise<HttpResponse> {
    if (url.endsWith("/oauth/register")) {
      return { statusCode: 201, jsonBody: { client_id: "cid-1" } };
    }
    return { statusCode: 404, jsonBody: {} };
  }
  async postForm(url: string): Promise<HttpResponse> {
    if (url.endsWith("/oauth/token")) {
      return {
        statusCode: 200,
        jsonBody: {
          access_token: "AT.eyJ.sig",
          refresh_token: "RT",
          expires_in: 3600,
          token_type: "Bearer",
          scope: "context_graph:read",
        },
      };
    }
    return { statusCode: 404, jsonBody: {} };
  }
  async getJson(): Promise<HttpResponse> {
    return { statusCode: 404, jsonBody: {} };
  }
}

class FakeListener {
  state = "";
  async allocate(): Promise<number> {
    return 54321;
  }
  async waitForCallback(): Promise<CallbackResult> {
    // Echo the state minted by runLoginFlow (captured via onAuthorizeUrl) --
    // the happy-path CSRF match.
    return { code: "authcode", state: this.state, error: null };
  }
  captureState = (url: string) => {
    this.state = new URL(url).searchParams.get("state") ?? "";
  };
}

/** A fake REST transport for the /api plane (exchange + content + admin). */
class FakeRest implements RestTransportPort {
  requests: Array<{ method: string; url: string; headers: Record<string, string> }> = [];
  constructor(private readonly handler: (method: string, url: string) => RestResponse) {}
  async request(
    method: string,
    url: string,
    opts: { headers: Record<string, string> },
  ): Promise<RestResponse> {
    this.requests.push({ method, url, headers: opts.headers });
    return this.handler(method, url);
  }
}

const SAMPLE_CREDS: StoredCredentials = {
  apiBase: "http://localhost:8000",
  accessToken: "AT",
  refreshToken: "RT",
  expiresAt: 9_999_999_999, // far future -> never expired in these tests
  tokenType: "Bearer",
  scope: "context_graph:read",
  clientId: "cid-1",
  apiToken: "USER-JWT",
};

// ── resolveApiBase -- default-production + --local + precedence ─────────────────

describe("resolveApiBase", () => {
  const ENV = "CONTEXTROCKET_API_BASE";
  afterEach(() => {
    delete process.env[ENV];
  });

  it("defaults to PRODUCTION when nothing is set", () => {
    expect(cli.resolveApiBase({})).toBe("https://app-api.contextrocket.com");
  });

  it("--local targets localhost:8000", () => {
    expect(cli.resolveApiBase({ local: true })).toBe("http://localhost:8000");
  });

  it("explicit --api-base wins over --local", () => {
    expect(cli.resolveApiBase({ apiBase: "https://custom.example", local: true })).toBe(
      "https://custom.example",
    );
  });

  it("CONTEXTROCKET_API_BASE env wins over --local", () => {
    process.env[ENV] = "https://env.example";
    expect(cli.resolveApiBase({ local: true })).toBe("https://env.example");
  });

  it("explicit --api-base wins over the env var", () => {
    process.env[ENV] = "https://env.example";
    expect(cli.resolveApiBase({ apiBase: "https://custom.example" })).toBe(
      "https://custom.example",
    );
  });

  it("trims a trailing slash", () => {
    expect(cli.resolveApiBase({ apiBase: "https://custom.example/" })).toBe(
      "https://custom.example",
    );
  });
});

// ── auth login ────────────────────────────────────────────────────────────────

describe("auth login", () => {
  it("stores credentials + api_token and prints branding to stderr only", async () => {
    const transport = new FakeOAuthTransport();
    const listener = new FakeListener();

    const code = await cli.cmdAuthLogin(
      {},
      {
        transport,
        listener: { allocate: () => listener.allocate(), waitForCallback: () => listener.waitForCallback() },
        onAuthorizeUrl: listener.captureState,
        browserOpener: () => {},
        exchange: async () => "EXCHANGED-USER-JWT",
        now: 1000,
      },
    );
    expect(code).toBe(0);

    const stored = loadCredentials(home);
    expect(stored.accessToken).toBe("AT.eyJ.sig");
    expect(stored.apiToken).toBe("EXCHANGED-USER-JWT");
    expect(stored.expiresAt).toBe(1000 + 3600);

    // Branding (footer, success glyph) is on stderr, not stdout.
    expect(stderr()).toContain("Powered by ContextRocket");
    expect(stderr()).toContain("Login successful");
    expect(stdout()).toBe("");
  });

  it("--no-launch-browser prints the URL to stdout and does NOT auto-open the browser", async () => {
    const transport = new FakeOAuthTransport();
    const listener = new FakeListener();

    // The browser opener spy must NEVER be called on the --no-launch-browser path.
    const opener = vi.fn();
    const code = await cli.cmdAuthLogin(
      { noLaunchBrowser: true },
      {
        transport,
        listener: { allocate: () => listener.allocate(), waitForCallback: () => listener.waitForCallback() },
        onAuthorizeUrl: listener.captureState,
        browserOpener: opener,
        exchange: async () => "JWT",
        now: 0,
      },
    );
    expect(code).toBe(0);
    expect(opener).not.toHaveBeenCalled();
    // The authorize URL is printed for the user to open manually.
    expect(stdout()).toContain("Open this URL in your browser");
    expect(stdout()).toContain("/oauth/authorize");
  });
});

// ── auth print-access-token (clean stdout) ────────────────────────────────────

describe("auth print-access-token", () => {
  it("prints ONLY the raw token to stdout; branding goes to stderr", async () => {
    saveCredentials(home, SAMPLE_CREDS);
    const code = await cli.cmdAuthPrintAccessToken({}, { now: 0 });
    expect(code).toBe(0);
    // stdout is exactly the token + newline -- pipeable, un-emoji'd.
    expect(stdout()).toBe("AT\n");
    expect(stdout()).not.toContain("🚀");
    expect(stderr()).toContain("Powered by ContextRocket");
  });

  it("fails with exit 1 when not logged in", async () => {
    const code = await cli.cmdAuthPrintAccessToken({});
    expect(code).toBe(1);
    expect(stderr()).toContain("Not logged in");
  });
});

// ── auth whoami / logout ──────────────────────────────────────────────────────

describe("auth whoami + logout", () => {
  it("whoami reports valid access token to stderr", () => {
    saveCredentials(home, SAMPLE_CREDS);
    const code = cli.cmdAuthWhoami({}, { now: 0 });
    expect(code).toBe(0);
    expect(stderr()).toContain("Signed in to the ContextRocket CLI");
    expect(stderr()).toContain("valid");
  });

  it("logout removes the stored credentials", () => {
    saveCredentials(home, SAMPLE_CREDS);
    expect(cli.cmdAuthLogout({})).toBe(0);
    expect(cli.cmdAuthLogout({})).toBe(0);
    expect(stderr()).toContain("Already logged out");
  });
});

// ── content + admin -- bearer attach + fail-closed ─────────────────────────────

describe("content ls -- authenticated bearer attach", () => {
  it("sends Authorization: Bearer <api_token> and lists objects", async () => {
    saveCredentials(home, SAMPLE_CREDS);
    const rest = new FakeRest(() => ({
      statusCode: 200,
      jsonBody: { objects: [{ byte_size: 42, address: "cr://acme/gtm/x.md" }] },
      content: Buffer.from(""),
    }));
    cli.setRestTransportFactory(() => rest);

    const code = await cli.cmdContentLs({}, "cr://acme/gtm/");
    expect(code).toBe(0);
    expect(rest.requests[0].headers.Authorization).toBe("Bearer USER-JWT");
    // The listing line is machine-readable stdout (no emoji).
    expect(stdout()).toContain("cr://acme/gtm/x.md");
    expect(stdout()).not.toContain("🧠");
  });

  it("fails closed with exit 1 when the api_token is absent (pre-two-token login)", async () => {
    saveCredentials(home, { ...SAMPLE_CREDS, apiToken: "" });
    const code = await cli.cmdContentLs({}, "cr://acme/gtm/");
    expect(code).toBe(1);
    expect(stderr()).toContain("Run 'contextrocket auth login'");
  });
});

describe("admin create-org -- bearer attach", () => {
  it("posts to /api/admin/orgs with the USER JWT bearer", async () => {
    saveCredentials(home, SAMPLE_CREDS);
    const rest = new FakeRest(() => ({
      statusCode: 200,
      jsonBody: { created: true, org_id: "org-1", slug: "acme" },
      content: Buffer.from(""),
    }));
    cli.setRestTransportFactory(() => rest);

    const code = await cli.cmdAdminCreateOrg({}, "acme", "Acme Inc");
    expect(code).toBe(0);
    expect(rest.requests[0].url).toBe("http://localhost:8000/api/admin/orgs");
    expect(rest.requests[0].headers.Authorization).toBe("Bearer USER-JWT");
    expect(stderr()).toContain("org created");
  });
});

describe("content query -- fails loudly (no silent DB fallback)", () => {
  it("returns exit 2 with a typed unavailable message", () => {
    const code = cli.cmdContentQuery({});
    expect(code).toBe(2);
    expect(stderr()).toContain("not yet available over the authenticated API");
  });
});
