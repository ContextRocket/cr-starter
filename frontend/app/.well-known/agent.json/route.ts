/**
 * /.well-known/agent.json -- A2A agent card discovery endpoint.
 *
 * Serves an A2A-spec AgentCard describing the site's chat agent and pointing
 * at the configured ContextRocket A2A endpoint.
 *
 * Card shape mirrors the CR backend's AgentCard Pydantic model:
 *   backend/app/modules/agent/a2a/types.py (AgentCard, AgentCapabilities,
 *   AgentAuthentication, AgentSkill, AgentProvider)
 *
 * When NEXT_PUBLIC_CR_AGENT_URL is unset at build time, the card is still
 * served as valid JSON with url=null. This allows discovery tooling to find
 * and parse the card even before the site owner has configured their endpoint.
 *
 * The card builder lives in lib/agent-card.ts (pure, no server imports)
 * so unit tests can import it without a Next.js server runtime.
 *
 * A2A spec reference: https://google.github.io/A2A/
 */

import { NextResponse } from "next/server";
import { buildAgentCard } from "@/lib/agent-card";

// force-static so the card is pre-rendered at build time when env is baked in.
// Forks that set NEXT_PUBLIC_CR_AGENT_URL at runtime should remove this.
export const dynamic = "force-static";

export function GET() {
  const card = buildAgentCard();

  return NextResponse.json(card, {
    headers: {
      "cache-control": "public, max-age=3600",
      // CORS: allow any agent runtime to fetch the card unauthenticated.
      "access-control-allow-origin": "*",
    },
  });
}
