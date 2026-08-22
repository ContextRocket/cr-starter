/**
 * /.well-known/agent-card.json -- current A2A Agent Card discovery endpoint.
 *
 * ContextRocket remains the hosted A2A server. This static card is a
 * configuration-bound discovery mirror at the customer site origin; it must
 * stay structurally aligned with ContextRocket's current card contract.
 */

import { NextResponse } from "next/server";
import { buildAgentCard } from "@/lib/agent-card";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(buildAgentCard(), {
    headers: {
      "cache-control": "public, max-age=3600",
      "access-control-allow-origin": "*",
    },
  });
}
