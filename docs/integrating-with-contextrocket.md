# Integrating with ContextRocket

This is the single integration reference for `cr-starter`. Everything in this
file is derived from the real code in `frontend/lib/cr-sdk/` and
`frontend/lib/a2a-client.ts`. No endpoints or field names are invented.

---

## What you need from the ContextRocket dashboard

1. **An org credential.** Go to your ContextRocket dashboard, navigate to
   Settings, and mint a machine credential for your org. You get two values:
   - `NEXT_PUBLIC_CR_AGENT_URL`: the A2A endpoint for your org's agent
     (e.g. `https://api.contextrocket.com`).
   - `NEXT_PUBLIC_CR_ORG_KEY`: a `crk_`-prefixed machine key (optional;
     needed for org-scoped access when the local backend is disabled).

   Provisioning UI is tracked as CR bead `cr-gv9.30`; credential classes
   are tracked as `cr-06p.8`.

2. **An org Context Pack.** The agent answers from your org's verified
   brand knowledge. Configure sources in the ContextRocket dashboard.

---

## Environment variable contract

Set these in `frontend/.env.local` (copy from `frontend/.env.example`):

```bash
# Required: the A2A endpoint for your org's ContextRocket agent.
NEXT_PUBLIC_CR_AGENT_URL=https://api.contextrocket.com

# Optional: org machine credential key (crk_-prefixed).
# When set, A2A calls include this as the OrgCredential header.
NEXT_PUBLIC_CR_ORG_KEY=crk_your_key_here

# Set to "true" to show the Chat FAB on every page.
NEXT_PUBLIC_CHAT_FAB_ENABLED=true

# Set to "true" to enable the optional local fastapi-users backend.
# When false (default), guest auth is skipped and A2A runs without identity.
NEXT_PUBLIC_BACKEND_ENABLED=false

# Backend URL (only used when NEXT_PUBLIC_BACKEND_ENABLED=true).
NEXT_PUBLIC_BACKEND_URL=http://localhost:8100
```

These vars are read in `frontend/lib/cr-sdk/config.ts` by `resolveCRConfig()`.
All have safe defaults so the app builds without them.

---

## What A2A gives you

A2A is the JSON-RPC 2.0 + SSE protocol between this starter and the
ContextRocket backend. The real implementation is in `frontend/lib/a2a-client.ts`.

**Two call modes:**

- `tasks/send` (POST, sync): fire and wait for the completed task.
- `tasks/sendSubscribe` (POST, SSE): token streaming. The server opens an
  event stream and emits a sequence of typed events.

**SSE event sequence for a streaming turn:**

```
TaskStatusUpdateEvent  { state: "submitted", final: false }
TaskStatusUpdateEvent  { state: "working",   final: false }
TaskArtifactUpdateEvent { artifact: { append: false, lastChunk: false }, ... }  <- first token chunk
TaskArtifactUpdateEvent { artifact: { append: true,  lastChunk: false }, ... }  <- subsequent chunks
TaskArtifactUpdateEvent { artifact: { append: true,  lastChunk: true  }, ... }  <- final chunk
TaskStatusUpdateEvent  { state: "completed", final: true, metadata: { thread_id, source_refs } }
```

`final: true` closes the stream. `artifact.append=false` on the first chunk
means replace; `append=true` means concatenate.

**Citations** arrive in `metadata.source_refs` on the final `TaskStatusUpdateEvent`:
```ts
source_refs: [{ sourceRefId, kind, title, url, score }]
```

**Thread continuity.** The server assigns a `thread_id` in the completed
event's metadata. Pass it as `contextId` on the next turn's message to
continue the conversation:
```ts
buildTextTurnParams(text, { threadId: "thread-xyz" })
```

---

## Using the cr-sdk

Import from `@/lib/cr-sdk`, not from `@/lib/a2a-client` directly.

```ts
import { createCRClient, resolveCRConfig, buildTextTurnParams } from "@/lib/cr-sdk";

// Read env vars into a typed config object.
const config = resolveCRConfig();

// Build a client for this config.
const client = createCRClient(config);

// Ensure a token is available (provisions a guest JWT if the backend is enabled).
await client.ensureToken();

// Build a text turn (with optional thread context).
const params = buildTextTurnParams("What does ContextRocket do?", {
  threadId: currentThreadId,   // optional: carry conversation state
  orgId: "my-org-slug",        // optional: explicit org scoping
});

// Stream the response.
for await (const event of client.streamTurn(params)) {
  if (event.type === "TaskArtifactUpdateEvent") {
    // Append text token to UI.
    const chunk = event.artifact.parts.map((p) => ("text" in p ? p.text : "")).join("");
    appendToChat(chunk, event.artifact.append);
  }
  if (event.type === "TaskStatusUpdateEvent" && event.final) {
    // Turn complete; citations are in event.metadata?.source_refs
    finalizeTurn(event.metadata?.source_refs);
  }
}

// Fetch the agent card (no auth required).
const card = await client.agentCard();
// card matches /.well-known/agent.json shape.
```

The `useA2AStream` hook in `frontend/hooks/use-a2a-stream.ts` wraps this
pattern with React state management (streaming phase, error kind, citation list,
slow-response timers). New component code should use the hook or `createCRClient`
rather than calling `streamTask` from a2a-client directly.

---

## Demo credential (out-of-box mode)

The OOB zero-config experience (clone, start, chat works immediately) will use
a public demo mode served by ContextRocket's showcase org. Until that ships, set
`NEXT_PUBLIC_CR_AGENT_URL` + `NEXT_PUBLIC_CR_ORG_KEY` in `frontend/.env.local`
to your own org credential. The FAB becomes your brand's agent immediately with
no other setup.

---

## Honest failure modes

**What the FAB shows on 401 (authentication required):**

The A2A client receives a JSON-RPC error envelope:
```json
{ "error": { "code": -32603, "message": "authentication required" } }
```
`parseA2AEvent` maps this to a `TaskStatusUpdateEvent` with `state: "failed"`,
`final: true`, and `metadata.reason = "authentication required"`.

The `useA2AStream` hook catches this and sets `error.kind = "auth"`. The
`ChatPanel` component renders the error message from `i18n/keys.ts` in the
message list. The FAB remains open; the user can retry.

**What the FAB shows on rate-limit (429 / too many requests):**

The HTTP layer throws before SSE begins: `A2A tasks/sendSubscribe failed: 429`.
The hook catches the error and sets `error.kind = "network"` (rate-limit is not
separately classified in the current hook -- it surfaces as a generic network
error with the raw status in the message). The chat stays functional; the user
can send another message after backing off.

**No agent URL configured:**

When `NEXT_PUBLIC_CR_AGENT_URL` is empty, `resolveCRConfig()` returns
`agentUrl: ""`. The `ChatPanel` detects an empty URL and renders the
`CHAT_CONNECT_REQUIRED_TITLE` / `CHAT_CONNECT_REQUIRED_BODY` prompt from
`i18n/keys.ts` instead of the composer. No A2A calls are made.

---

## CR-side contract bead references

This doc is kept in lockstep with CR integrator-docs contract (CR bead
`cr-gv9.31`). If the A2A wire format or env var names change in the CR backend,
update this file in the same lane.
