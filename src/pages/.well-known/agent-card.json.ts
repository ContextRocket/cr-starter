import { buildAgentCard } from "@/lib/agent-card";

/** /.well-known/agent-card.json -- A2A Agent Card discovery mirror. */
export async function GET() {
  return new Response(JSON.stringify(buildAgentCard(), null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
