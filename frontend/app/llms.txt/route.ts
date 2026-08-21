import { buildLlmsTxt } from "@/lib/public-site";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "cache-control": "public, max-age=3600",
      "content-type": "text/markdown; charset=utf-8",
    },
  });
}
