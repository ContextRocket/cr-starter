/**
 * /feed.xml route -- RSS 2.0 feed of the public blog.
 *
 * A Route Handler that returns the blog as an RSS 2.0 channel so feed
 * readers and AI agents can subscribe to new posts. The feed body is built
 * in lib/feed.ts (unit-testable, Next-runtime-free); this handler only wires
 * the response headers.
 *
 * Mirrors app/llms.txt/route.ts conventions (force-static + cache headers).
 * Discovery is advertised via `alternates.types` in the root layout metadata.
 */

import { buildRssFeed } from "@/lib/feed";
import { siteConfig } from "@/config/site.config";

export const dynamic = "force-static";

export function GET() {
  if (!siteConfig.features.blog) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(buildRssFeed({ selfPath: "/feed.xml" }), {
    headers: {
      "cache-control": "public, max-age=3600",
      "content-type": "application/rss+xml; charset=utf-8",
    },
  });
}
