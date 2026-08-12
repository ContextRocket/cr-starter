/**
 * Tests for cr-sdk credentials module.
 *
 * Covers the seam fix: when NEXT_PUBLIC_BACKEND_ENABLED=true and no token
 * is stored, the first chat open calls POST /auth/guest on port 8100,
 * stores the JWT, and returns it for use in A2A requests.
 */

import {
  getStoredToken,
  setStoredToken,
  clearStoredToken,
  ensureToken,
} from "@/lib/cr-sdk/credentials";

const BACKEND_URL = "http://localhost:8100";

// ── localStorage setup ────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ── Storage helpers ───────────────────────────────────────────────────────────

describe("getStoredToken / setStoredToken / clearStoredToken", () => {
  it("returns null when no token is stored", () => {
    expect(getStoredToken()).toBeNull();
  });

  it("returns the token after setStoredToken", () => {
    setStoredToken("test-jwt-123");
    expect(getStoredToken()).toBe("test-jwt-123");
  });

  it("returns null after clearStoredToken", () => {
    setStoredToken("test-jwt-123");
    clearStoredToken();
    expect(getStoredToken()).toBeNull();
  });
});

// ── ensureToken — backend disabled ────────────────────────────────────────────

describe("ensureToken -- backend disabled", () => {
  it("returns null when backendEnabled=false and no token stored", async () => {
    const token = await ensureToken(false, BACKEND_URL);
    expect(token).toBeNull();
  });

  it("returns the stored token even when backendEnabled=false", async () => {
    setStoredToken("existing-token");
    const token = await ensureToken(false, BACKEND_URL);
    expect(token).toBe("existing-token");
  });
});

// ── ensureToken — backend enabled, first open ─────────────────────────────────

describe("ensureToken -- backend enabled, unauthenticated (guest auth seam fix)", () => {
  it("calls POST /auth/guest when no token is stored and backend is enabled", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: "guest-jwt-abc",
        token_type: "bearer",
      }),
    });
    global.fetch = fetchMock;

    const token = await ensureToken(true, BACKEND_URL);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      `${BACKEND_URL}/auth/guest`,
      expect.objectContaining({ method: "POST" }),
    );
    expect(token).toBe("guest-jwt-abc");
  });

  it("stores the guest JWT after provisioning", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: "guest-jwt-stored",
        token_type: "bearer",
      }),
    });

    await ensureToken(true, BACKEND_URL);

    expect(getStoredToken()).toBe("guest-jwt-stored");
  });

  it("does not call POST /auth/guest when a token is already stored", async () => {
    setStoredToken("already-have-token");
    const fetchMock = vi.fn();
    global.fetch = fetchMock;

    const token = await ensureToken(true, BACKEND_URL);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(token).toBe("already-have-token");
  });

  it("throws when POST /auth/guest returns a non-ok status", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 503,
      statusText: "Service Unavailable",
    });

    await expect(ensureToken(true, BACKEND_URL)).rejects.toThrow(
      "Guest auth failed: 503",
    );
  });
});

// ── ensureToken — de-duplication of concurrent calls ─────────────────────────

describe("ensureToken -- concurrent call de-duplication", () => {
  it("issues only ONE POST /auth/guest when called concurrently before the first resolves", async () => {
    let resolveFirst!: (v: object) => void;
    const firstFetchPromise = new Promise<object>((resolve) => {
      resolveFirst = resolve;
    });

    const fetchMock = vi.fn().mockReturnValueOnce(firstFetchPromise);
    global.fetch = fetchMock;

    // Fire two concurrent calls before the first resolves.
    const p1 = ensureToken(true, BACKEND_URL);
    const p2 = ensureToken(true, BACKEND_URL);

    // Only one fetch should have been initiated.
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Resolve the fetch.
    resolveFirst({
      ok: true,
      json: async () => ({ access_token: "dedup-token", token_type: "bearer" }),
    });

    const [t1, t2] = await Promise.all([p1, p2]);
    expect(t1).toBe("dedup-token");
    expect(t2).toBe("dedup-token");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
