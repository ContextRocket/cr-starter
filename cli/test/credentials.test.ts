import { mkdtempSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  CredentialError,
  credentialsPath,
  deleteCredentials,
  fileMode,
  isAccessExpired,
  loadCredentials,
  saveCredentials,
  toPublicDict,
  type StoredCredentials,
} from "../src/credentials.js";

let home: string;

const SAMPLE: StoredCredentials = {
  apiBase: "http://localhost:8000",
  accessToken: "access-token-secret",
  refreshToken: "refresh-token-secret",
  expiresAt: 2_000_000_000,
  tokenType: "Bearer",
  scope: "context_graph:read",
  clientId: "cid-xyz",
  apiToken: "user-jwt-secret",
};

beforeEach(() => {
  home = mkdtempSync(join(tmpdir(), "cr-cli-creds-"));
});
afterEach(() => {
  rmSync(home, { recursive: true, force: true });
});

describe("saveCredentials -- strict permissions", () => {
  it("writes the file with 0600 perms", () => {
    saveCredentials(home, SAMPLE);
    expect(fileMode(home)).toBe(0o600);
  });

  it("creates the ~/.contextrocket dir with 0700 perms", () => {
    saveCredentials(home, SAMPLE);
    const dirMode = statSync(join(home, ".contextrocket")).mode & 0o777;
    expect(dirMode).toBe(0o700);
  });

  it("round-trips all fields including the two-token-plane api_token", () => {
    saveCredentials(home, SAMPLE);
    expect(loadCredentials(home)).toEqual(SAMPLE);
  });
});

describe("loadCredentials -- fail-closed", () => {
  it("throws when no credentials are stored", () => {
    expect(() => loadCredentials(home)).toThrow(CredentialError);
  });
});

describe("deleteCredentials", () => {
  it("returns true when a file existed, false otherwise", () => {
    saveCredentials(home, SAMPLE);
    expect(deleteCredentials(home)).toBe(true);
    expect(deleteCredentials(home)).toBe(false);
  });
});

describe("expiry + redaction helpers", () => {
  it("isAccessExpired respects the proactive-refresh leeway", () => {
    const creds = { ...SAMPLE, expiresAt: 1000 };
    expect(isAccessExpired(creds, 1000 - 31)).toBe(false);
    expect(isAccessExpired(creds, 1000 - 5)).toBe(true); // within 30s leeway
  });

  it("toPublicDict never exposes token material", () => {
    const pub = JSON.stringify(toPublicDict(SAMPLE));
    expect(pub).not.toContain("access-token-secret");
    expect(pub).not.toContain("refresh-token-secret");
    expect(pub).not.toContain("user-jwt-secret");
  });

  it("credentialsPath points at ~/.contextrocket/credentials.json", () => {
    expect(credentialsPath(home)).toBe(join(home, ".contextrocket", "credentials.json"));
  });
});
