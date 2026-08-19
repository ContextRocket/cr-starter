import { describe, expect, it } from "vitest";
import {
  buildAuthorizeUrl,
  OAuthFlowError,
  runLoginFlow,
  type CallbackResult,
  type HttpResponse,
  type HttpTransportPort,
} from "../src/oauth-flow.js";

interface RecordedForm {
  url: string;
  data: Record<string, string>;
}
interface RecordedJson {
  url: string;
  body: Record<string, unknown>;
}

/** A fake OAuth-server transport that records requests and replays canned responses. */
class FakeTransport implements HttpTransportPort {
  forms: RecordedForm[] = [];
  jsons: RecordedJson[] = [];
  constructor(
    private readonly responses: {
      register?: HttpResponse;
      token?: HttpResponse;
    } = {},
  ) {}

  async postJson(url: string, jsonBody: Record<string, unknown>): Promise<HttpResponse> {
    this.jsons.push({ url, body: jsonBody });
    if (url.endsWith("/oauth/register")) {
      return this.responses.register ?? { statusCode: 201, jsonBody: { client_id: "cid-123" } };
    }
    return { statusCode: 404, jsonBody: {} };
  }

  async postForm(url: string, data: Record<string, string>): Promise<HttpResponse> {
    this.forms.push({ url, data });
    if (url.endsWith("/oauth/token")) {
      return (
        this.responses.token ?? {
          statusCode: 200,
          jsonBody: {
            access_token: "AT",
            refresh_token: "RT",
            expires_in: 3600,
            token_type: "Bearer",
            scope: "context_graph:read",
          },
        }
      );
    }
    return { statusCode: 404, jsonBody: {} };
  }

  async getJson(): Promise<HttpResponse> {
    return { statusCode: 404, jsonBody: {} };
  }
}

const API_BASE = "http://localhost:8000";
const REDIRECT = "http://127.0.0.1:54321/callback";

function loginArgs(transport: FakeTransport, waitResult: (state: string) => CallbackResult) {
  // Capture the state from the authorize URL so the callback can echo it (happy
  // path) or corrupt it (CSRF path).
  let capturedState = "";
  return {
    transport,
    apiBase: API_BASE,
    redirectUri: REDIRECT,
    clientName: "ContextRocket CLI",
    openAuthorizeUrl: (url: string) => {
      capturedState = new URL(url).searchParams.get("state") ?? "";
    },
    waitForCallback: async (): Promise<CallbackResult> => waitResult(capturedState),
  };
}

describe("runLoginFlow -- happy path", () => {
  it("registers a public client, exchanges the code, returns tokens", async () => {
    const transport = new FakeTransport();
    const result = await runLoginFlow(
      loginArgs(transport, (state) => ({ code: "authcode", state, error: null })),
    );

    expect(result.clientId).toBe("cid-123");
    expect(result.tokens.accessToken).toBe("AT");
    expect(result.tokens.refreshToken).toBe("RT");

    // Registration request shape: public (PKCE) client, loopback redirect.
    expect(transport.jsons).toHaveLength(1);
    expect(transport.jsons[0].url).toBe(`${API_BASE}/oauth/register`);
    expect(transport.jsons[0].body).toMatchObject({
      redirect_uris: [REDIRECT],
      token_endpoint_auth_method: "none",
      grant_types: ["authorization_code", "refresh_token"],
    });

    // Token-exchange request shape: authorization_code grant + code_verifier + redirect_uri.
    expect(transport.forms).toHaveLength(1);
    expect(transport.forms[0].url).toBe(`${API_BASE}/oauth/token`);
    expect(transport.forms[0].data.grant_type).toBe("authorization_code");
    expect(transport.forms[0].data.code).toBe("authcode");
    expect(transport.forms[0].data.redirect_uri).toBe(REDIRECT);
    expect(transport.forms[0].data.client_id).toBe("cid-123");
    // The PKCE proof MUST be present (the verifier is never logged, only sent).
    expect(transport.forms[0].data.code_verifier).toBeTruthy();
  });
});

describe("runLoginFlow -- CSRF state check (RED-verify target)", () => {
  it("REJECTS a state mismatch and does NOT exchange the code", async () => {
    const transport = new FakeTransport();
    await expect(
      runLoginFlow(
        // Callback echoes a DIFFERENT state than the one minted -> CSRF.
        loginArgs(transport, () => ({ code: "authcode", state: "attacker-state", error: null })),
      ),
    ).rejects.toThrow(OAuthFlowError);

    // Load-bearing: the token endpoint must NEVER have been hit on a CSRF fail.
    expect(transport.forms).toHaveLength(0);
  });

  it("surfaces an authorization-server error and does not exchange", async () => {
    const transport = new FakeTransport();
    await expect(
      runLoginFlow(loginArgs(transport, (state) => ({ code: null, state, error: "access_denied" }))),
    ).rejects.toThrow(/access_denied/);
    expect(transport.forms).toHaveLength(0);
  });

  it("rejects a missing code even when state matches", async () => {
    const transport = new FakeTransport();
    await expect(
      runLoginFlow(loginArgs(transport, (state) => ({ code: null, state, error: null }))),
    ).rejects.toThrow(/no code/);
    expect(transport.forms).toHaveLength(0);
  });
});

describe("runLoginFlow -- failure surfacing", () => {
  it("throws on a non-201 registration", async () => {
    const transport = new FakeTransport({ register: { statusCode: 400, jsonBody: { error: "invalid" } } });
    await expect(
      runLoginFlow(loginArgs(transport, (state) => ({ code: "c", state, error: null }))),
    ).rejects.toThrow(/Client registration failed/);
  });

  it("throws on a non-200 token exchange", async () => {
    const transport = new FakeTransport({ token: { statusCode: 400, jsonBody: { error: "invalid_grant" } } });
    await expect(
      runLoginFlow(loginArgs(transport, (state) => ({ code: "c", state, error: null }))),
    ).rejects.toThrow(/Token exchange failed/);
  });
});

describe("buildAuthorizeUrl", () => {
  it("pins S256 and includes every PKCE + CSRF param", () => {
    const url = buildAuthorizeUrl({
      apiBase: API_BASE,
      clientId: "cid",
      redirectUri: REDIRECT,
      codeChallenge: "CHAL",
      state: "STATE",
    });
    const parsed = new URL(url);
    expect(parsed.pathname).toBe("/oauth/authorize");
    expect(parsed.searchParams.get("response_type")).toBe("code");
    expect(parsed.searchParams.get("code_challenge_method")).toBe("S256");
    expect(parsed.searchParams.get("code_challenge")).toBe("CHAL");
    expect(parsed.searchParams.get("state")).toBe("STATE");
    expect(parsed.searchParams.get("redirect_uri")).toBe(REDIRECT);
  });
});
