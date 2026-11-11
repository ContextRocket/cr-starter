/**
 * Site (@content-owners) copy for the blog. Site copy MAY ship a
 * locale subset ahead of full translation (parity is warn-only for site).
 *
 * Fork-owned site copy. Keep brand language here rather than in shared code.
 * The merge barrel (../en.ts) re-merges shared+app+site into `en`,
 * so runtime key resolution is unchanged; this file only decides ownership.
 */

export const siteEn = {
  blog: {
    title: "Blog",
    subtitle: "Articles, guides, and product updates.",
    description: "Articles, guides, and updates.",
    featured: "Featured",
    all_posts: "All posts",
    topics: "Topics",
    topics_description: "Evergreen guides and reference articles.",
    topics_empty: "No published topics yet.",
    updated: "Updated",
    empty: "No posts yet. Check back soon.",
    back: {
      home: "Back to home",
      to: {
        list: "All posts",
      },
    },
    not: {
      found: "Post not found",
    },
    min: {
      read: "min read",
    },
  },
} as const;
