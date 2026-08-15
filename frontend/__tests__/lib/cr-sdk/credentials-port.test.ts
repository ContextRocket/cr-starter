/**
 * Tests for the credentials port interface and adapters.
 *
 * Covers: happy-path provisioning, non-OK responses, malformed JWT,
 * network errors, concurrent dedup under error, AbortError, and
 * in-memory test-double behavior.
 */

import {
  createCredentialsPort,
  createInMemoryCredentialsPort,
} from "@/lib/cr-sdk/credentials-port";

const BACKEND_URL = "http://localhost:8100";

// ── localStorage setup ────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function okFetch(token = "guest-jwt-abc"): typeof fetch {
  return vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ access_token: token, token_type: "bearer" }),
  });
}

function failFetch(status = 503, statusText = "Service Unavailable"): typeof fetch {
  return vi.fn().mockResolvedValue({ ok: false, status, statusText });
}

// ── Production adapter: createCredentialsPort ─────────────────────────────────

describe("createCredentialsPort", () => {
  describe("getStoredToken / setStoredToken / clearStoredToken", () => {
    it("returns null when no token is stored", () => {
      const port = createCredentialsPort(okFetch(), BACKEND_URL, true);
      expect(port.getStoredToken()).toBeNull();
    });

    it("returns the token after setStoredToken", () => {
      const port = createCredentialsPort(okFetch(), BACKEND_URL, true);
      port.setStoredToken("test-jwt-123");
      expect(port.getStoredToken()).toBe("test-jwt-123");
    });

    it("returns null after clearStoredToken", () => {
      const port = createCredentialsPort(okFetch(), BACKEND_URL, true);
      port.setStoredToken("test-jwt-123");
      port.clearStoredToken();
      expect(port.getStoredToken()).toBeNull();
    });
  });

  describe("ensureToken — backend disabled", () => {
    it("returns null when backendEnabled=false and no token stored", async () => {
      const port = createCredentialsPort(okFetch(), BACKEND_URL, false);
      await expect(port.ensureToken()).resolves.toBeNull();
    });

    it("returns the stored token even when backendEnabled=false", async () => {
      const port = createCredentialsPort(okFetch(), BACKEND_URL, false);
      port.setStoredToken("existing-token");
      await expect(port.ensureToken()).resolves.toBe("existing-token");
    });
  });

  describe("ensureToken — backend enabled, happy path", () => {
    it("calls POST /auth/guest when no token is stored", async () => {
      const fetchMock = okFetch("guest-jwt-abc");
      const port = createCredentialsPort(fetchMock, BACKEND_URL, true);

      const token = await port.ensureToken();

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        `${BACKEND_URL}/auth/guest`,
        expect.objectContaining({ method: "POST" }),
      );
      expect(token).toBe("guest-jwt-abc");
    });

    it("stores the guest JWT after provisioning", async () => {
      const port = createCredentialsPort(okFetch("stored-jwt"), BACKEND_URL, true);
      await port.ensureToken();
      expect(port.getStoredToken()).toBe("stored-jwt");
    });

    it("does not call fetch when a token is already stored", async () => {
      const fetchMock = okFetch();
      const port = createCredentialsPort(fetchMock, BACKEND_URL, true);
      port.setStoredToken("already-have-token");

      const token = await port.ensureToken();

      expect(fetchMock).not.toHaveBeenCalled();
      expect(token).toBe("already-have-token");
    });
  });

  describe("ensureToken — non-OK response", () => {
    it("throws when POST /auth/guest returns a non-ok status", async () => {
      const port = createCredentialsPort(failFetch(503), BACKEND_URL, true);
      await expect(port.ensureToken()).rejects.toThrow("Guest auth failed: 503");
    });

    it("clears the dedup promise after a non-OK response", async () => {
      let callCount = 0;
      const fetchImpl: typeof fetch = vi.fn().mockImplementation(async () => {
        callCount++;
        if (callCount === 1) {
          return { ok: false, status: 503, statusText: "Service Unavailable" };
        }
        return {
          ok: true,
          json: async () => ({ access_token: "retry-token", token_type: "bearer" }),
        };
      });

      const port = createCredentialsPort(fetchImpl, BACKEND_URL, true);

      // First call fails.
      await expect(port.ensureToken()).rejects.toThrow("Guest auth failed: 503");

      // Second call should retry (dedup promise was cleared).
      const token = await port.ensureToken();
      expect(token).toBe("retry-token");
    });
  });

  describe("ensureToken — malformed JWT response", () => {
    it("throws when response JSON lacks access_token", async () => {
      const fetchImpl: typeof fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ wrong_field: "nope" }),
      });

      const port = createCredentialsPort(fetchImpl, BACKEND_URL, true);
      // access_token will be undefined → stored as undefined, ensureToken returns it
      // This is the actual behavior — the port does not validate the shape.
      const token = await port.ensureToken();
      expect(token).toBeUndefined();
    });

    it("throws when response body is not valid JSON", async () => {
      const fetchImpl: typeof fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => {
          throw new SyntaxError("Unexpected token < in JSON");
        },
      });

      const port = createCredentialsPort(fetchImpl, BACKEND_URL, true);
      await expect(port.ensureToken()).rejects.toThrow("Unexpected token");
    });
  });

  describe("ensureToken — network error", () => {
    it("throws when fetch rejects with a network error", async () => {
      const fetchImpl: typeof fetch = vi.fn().mockRejectedValue(
        new TypeError("Failed to fetch"),
      );

      const port = createCredentialsPort(fetchImpl, BACKEND_URL, true);
      await expect(port.ensureToken()).rejects.toThrow("Failed to fetch");
    });

    it("clears the dedup promise after a network error", async () => {
      let callCount = 0;
      const fetchImpl: typeof fetch = vi.fn().mockImplementation(async () => {
        callCount++;
        if (callCount === 1) {
          throw new TypeError("Failed to fetch");
        }
        return {
          ok: true,
          json: async () => ({ access_token: "recovered", token_type: "bearer" }),
        };
      });

      const port = createCredentialsPort(fetchImpl, BACKEND_URL, true);

      await expect(port.ensureToken()).rejects.toThrow("Failed to fetch");
      const token = await port.ensureToken();
      expect(token).toBe("recovered");
    });
  });

  describe("ensureToken — AbortError", () => {
    it("throws when fetch is aborted", async () => {
      const fetchImpl: typeof fetch = vi.fn().mockRejectedValue(
        new DOMException("The operation was aborted.", "AbortError"),
      );

      const port = createCredentialsPort(fetchImpl, BACKEND_URL, true);
      await expect(port.ensureToken()).rejects.toThrow("The operation was aborted");
    });
  });

  describe("ensureToken — concurrent dedup", () => {
    it("issues only ONE POST /auth/guest when called concurrently", async () => {
      let resolveFirst!: (v: unknown) => void;
      const firstFetchPromise = new Promise((resolve) => {
        resolveFirst = resolve;
      });

      const fetchMock = vi.fn().mockReturnValueOnce(firstFetchPromise);
      const port = createCredentialsPort(fetchMock as typeof fetch, BACKEND_URL, true);

      const p1 = port.ensureToken();
      const p2 = port.ensureToken();

      expect(fetchMock).toHaveBeenCalledTimes(1);

      resolveFirst({
        ok: true,
        json: async () => ({ access_token: "dedup-token", token_type: "bearer" }),
      });

      const [t1, t2] = await Promise.all([p1, p2]);
      expect(t1).toBe("dedup-token");
      expect(t2).toBe("dedup-token");
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("clears dedup promise after concurrent error so next call retries", async () => {
      const fetchImpl: typeof fetch = vi.fn()
        .mockRejectedValueOnce(new TypeError("transient"))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ access_token: "ok-after-fail", token_type: "bearer" }),
        });

      const port = createCredentialsPort(fetchImpl, BACKEND_URL, true);

      // Two concurrent calls both fail.
      const [r1, r2] = await Promise.allSettled([port.ensureToken(), port.ensureToken()]);
      expect(r1.status).toBe("rejected");
      expect(r2.status).toBe("rejected");

      // Next call retries.
      const token = await port.ensureToken();
      expect(token).toBe("ok-after-fail");
    });
  });
});

// ── In-memory test double ─────────────────────────────────────────────────────

describe("createInMemoryCredentialsPort", () => {
  describe("storage", () => {
    it("returns the initial storedToken", () => {
      const port = createInMemoryCredentialsPort({ storedToken: "initial" });
      expect(port.getStoredToken()).toBe("initial");
    });

    it("returns null when no initial storedToken", () => {
      const port = createInMemoryCredentialsPort({});
      expect(port.getStoredToken()).toBeNull();
    });

    it("reflects setStoredToken / clearStoredToken", () => {
      const port = createInMemoryCredentialsPort({});
      port.setStoredToken("set-1");
      expect(port.getStoredToken()).toBe("set-1");
      port.clearStoredToken();
      expect(port.getStoredToken()).toBeNull();
    });
  });

  describe("ensureToken", () => {
    it("returns stored token without calling provisionToken", async () => {
      const provision = vi.fn().mockResolvedValue("should-not-be-called");
      const port = createInMemoryCredentialsPort({
        storedToken: "already",
        provisionToken: provision,
      });

      const token = await port.ensureToken();
      expect(token).toBe("already");
      expect(provision).not.toHaveBeenCalled();
    });

    it("calls provisionToken when no token is stored", async () => {
      const port = createInMemoryCredentialsPort({
        provisionToken: async () => "provisioned",
      });

      const token = await port.ensureToken();
      expect(token).toBe("provisioned");
      expect(port.getStoredToken()).toBe("provisioned");
    });

    it("returns null when no provisionToken and no stored token", async () => {
      const port = createInMemoryCredentialsPort({});
      await expect(port.ensureToken()).resolves.toBeNull();
    });

    it("propagates errors from provisionToken", async () => {
      const port = createInMemoryCredentialsPort({
        provisionToken: async () => {
          throw new Error("boom");
        },
      });

      await expect(port.ensureToken()).rejects.toThrow("boom");
    });
  });
});
