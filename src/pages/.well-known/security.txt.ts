import { buildSecurityTxt } from "@/lib/public-site";

/** Website hygiene: security.txt for responsible disclosure (RFC 9116). */
export async function GET() {
  return new Response(buildSecurityTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
