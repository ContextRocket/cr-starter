import { siteConfig } from "@/config/site.config";
import { getDefaultLocale } from "@/i18n/locales";
import { listPosts } from "@/lib/blog";
import { absoluteUrl, blogPostHref, blogIndexHref } from "@/lib/paths";

/** RSS feed for the blog — website hygiene for subscribers and aggregators. */
export async function GET() {
  if (!siteConfig.features.blog) {
    return new Response("Blog disabled", { status: 404 });
  }
  const locale = getDefaultLocale();
  const posts = listPosts(locale).slice(0, 50);
  const channelLink = absoluteUrl(blogIndexHref(locale));
  const items = posts
    .map((post) => {
      const link = absoluteUrl(blogPostHref(locale, post.slug));
      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.excerpt ? `<description><![CDATA[${post.excerpt}]]></description>` : ""}
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title><![CDATA[${siteConfig.companyName} · ${siteConfig.blog.title}]]></title>
    <link>${channelLink}</link>
    <description><![CDATA[${siteConfig.description}]]></description>
${items}
  </channel>
</rss>
`;
  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
