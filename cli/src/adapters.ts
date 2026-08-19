/**
 * Production side-effect adapters for the `contextrocket` CLI.
 *
 * Concrete implementations of the injectable seams in `oauth-flow` and
 * `api-client` -- kept out of the flow logic so the flow stays hermetically
 * testable. Only this module opens real sockets / launches a real browser.
 *
 * SSRF posture: fetch does not auto-follow redirects here (`redirect: "manual"`
 * where a body is expected). The OAuth server issues 302s the loopback catches,
 * not the HTTP client.
 */

import { spawn } from "node:child_process";
import { createServer, type Server } from "node:http";
import { platform } from "node:os";

import type { HttpResponse, HttpTransportPort, CallbackResult } from "./oauth-flow.js";
import { CALLBACK_PATH } from "./oauth-flow.js";
import type {
  FilePart,
  RestResponse,
  RestTransportPort,
} from "./api-client.js";

// Loopback is bound to 127.0.0.1 ONLY -- never 0.0.0.0 (RFC 8252 §7.3 + the
// load-bearing security requirement). Port 0 asks the OS for an ephemeral port.
const LOOPBACK_HOST = "127.0.0.1";

// ── OAuth-server transport (form/json) ──────────────────────────────────────

async function toHttpResponse(resp: Response): Promise<HttpResponse> {
  let body: unknown;
  try {
    const text = await resp.text();
    body = text ? JSON.parse(text) : {};
  } catch {
    body = {};
  }
  if (typeof body !== "object" || body === null) body = {};
  return { statusCode: resp.status, jsonBody: body as Record<string, unknown> };
}

/** `fetch`-backed transport with redirects handled manually (no auto-follow). */
export class FetchTransport implements HttpTransportPort {
  constructor(private readonly timeoutMs = 30000) {}

  private controller(): { signal: AbortSignal; done: () => void } {
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), this.timeoutMs);
    return { signal: ac.signal, done: () => clearTimeout(timer) };
  }

  async postForm(url: string, data: Record<string, string>): Promise<HttpResponse> {
    const { signal, done } = this.controller();
    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString(),
        redirect: "manual",
        signal,
      });
      return await toHttpResponse(resp);
    } finally {
      done();
    }
  }

  async postJson(url: string, jsonBody: Record<string, unknown>): Promise<HttpResponse> {
    const { signal, done } = this.controller();
    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonBody),
        redirect: "manual",
        signal,
      });
      return await toHttpResponse(resp);
    } finally {
      done();
    }
  }

  async getJson(url: string, headers: Record<string, string>): Promise<HttpResponse> {
    const { signal, done } = this.controller();
    try {
      const resp = await fetch(url, { method: "GET", headers, redirect: "manual", signal });
      return await toHttpResponse(resp);
    } finally {
      done();
    }
  }
}

// ── Authenticated /api REST transport (json/multipart/download) ──────────────

/** `fetch`-backed REST transport with redirects DISABLED (SSRF-safe default). */
export class FetchRestTransport implements RestTransportPort {
  constructor(private readonly timeoutMs = 60000) {}

  async request(
    method: string,
    url: string,
    opts: {
      headers: Record<string, string>;
      params?: Record<string, string>;
      jsonBody?: Record<string, unknown>;
      files?: Record<string, FilePart>;
      form?: Record<string, string>;
    },
  ): Promise<RestResponse> {
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), this.timeoutMs);
    try {
      let fullUrl = url;
      if (opts.params && Object.keys(opts.params).length) {
        const qs = new URLSearchParams(opts.params).toString();
        fullUrl = `${url}?${qs}`;
      }

      const headers: Record<string, string> = { ...opts.headers };
      let body: FormData | string | undefined;

      if (opts.files) {
        const fd = new FormData();
        for (const [field, [filename, bytes]] of Object.entries(opts.files)) {
          fd.append(field, new Blob([new Uint8Array(bytes)]), filename);
        }
        for (const [key, value] of Object.entries(opts.form ?? {})) {
          fd.append(key, value);
        }
        body = fd; // fetch sets the multipart boundary Content-Type
      } else if (opts.jsonBody !== undefined) {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(opts.jsonBody);
      }

      const resp = await fetch(fullUrl, {
        method,
        headers,
        body,
        redirect: "manual",
        signal: ac.signal,
      });
      const buf = Buffer.from(await resp.arrayBuffer());
      let json: unknown = {};
      try {
        json = buf.length ? JSON.parse(buf.toString("utf-8")) : {};
      } catch {
        json = {};
      }
      if (typeof json !== "object" || json === null) json = {};
      return {
        statusCode: resp.status,
        jsonBody: json as Record<string, unknown>,
        content: buf,
      };
    } finally {
      clearTimeout(timer);
    }
  }
}

// ── Browser open ────────────────────────────────────────────────────────────

/** Launch the system browser at `url` (best-effort, cross-platform). */
export function openSystemBrowser(url: string): void {
  const p = platform();
  let cmd: string;
  let args: string[];
  if (p === "darwin") {
    cmd = "open";
    args = [url];
  } else if (p === "win32") {
    cmd = "cmd";
    args = ["/c", "start", "", url];
  } else {
    cmd = "xdg-open";
    args = [url];
  }
  try {
    const child = spawn(cmd, args, { stdio: "ignore", detached: true });
    child.on("error", () => {
      /* best-effort: a missing opener is not fatal */
    });
    child.unref();
  } catch {
    /* best-effort */
  }
}

// ── Loopback listener ───────────────────────────────────────────────────────

const COMPLETION_HTML =
  "<!doctype html><html><head><meta charset='utf-8'>" +
  "<title>ContextRocket CLI</title></head>" +
  "<body style='font-family:system-ui;padding:2rem'>" +
  "<h2>You're signed in to the ContextRocket CLI.</h2>" +
  "<p>You can close this tab and return to your terminal.</p>" +
  "</body></html>";

/**
 * One-shot loopback HTTP server that captures the OAuth redirect.
 *
 * Binds an ephemeral port on 127.0.0.1 ONLY. `allocate` reserves the port so
 * the caller can build the exact `redirect_uri` the server will register (the
 * redirect rule is exact-match). `waitForCallback` serves exactly one request,
 * returns the parsed params, then shuts down.
 */
export class LoopbackListener {
  private server: Server | null = null;
  private result: CallbackResult | null = null;
  private port = 0;

  constructor(private readonly timeoutMs = 300000) {}

  /** Bind an ephemeral 127.0.0.1 port and return it. */
  allocate(): Promise<number> {
    return new Promise((resolve, reject) => {
      const server = createServer((req, res) => {
        const parsed = new URL(req.url ?? "/", `http://${LOOPBACK_HOST}`);
        if (parsed.pathname !== CALLBACK_PATH) {
          res.statusCode = 404;
          res.end();
          return;
        }
        this.result = {
          code: parsed.searchParams.get("code"),
          state: parsed.searchParams.get("state"),
          error: parsed.searchParams.get("error"),
        };
        const body = Buffer.from(COMPLETION_HTML, "utf-8");
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Content-Length", String(body.length));
        res.end(body);
      });
      server.on("error", reject);
      // Bind 127.0.0.1 ONLY -- never all interfaces.
      server.listen(0, LOOPBACK_HOST, () => {
        const addr = server.address();
        if (addr && typeof addr === "object") {
          this.port = addr.port;
          this.server = server;
          resolve(this.port);
        } else {
          reject(new Error("failed to bind loopback port"));
        }
      });
    });
  }

  /** Serve one request (blocking up to the timeout) and return its params. */
  waitForCallback(): Promise<CallbackResult> {
    const server = this.server;
    if (!server) {
      return Promise.reject(new Error("allocate() must be called before waitForCallback()."));
    }
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        server.close();
        reject(new Error("Timed out waiting for the browser to complete authorization."));
      }, this.timeoutMs);

      const poll = setInterval(() => {
        if (this.result !== null) {
          clearInterval(poll);
          clearTimeout(timer);
          server.close();
          resolve(this.result);
        }
      }, 25);
    });
  }
}
