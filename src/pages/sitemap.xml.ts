import { buildSitemapEntries, renderSitemapXml } from "@/lib/public-site";

export async function GET() {
  const body = renderSitemapXml(buildSitemapEntries());
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
