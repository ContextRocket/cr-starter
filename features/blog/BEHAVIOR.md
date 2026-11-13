# Blog: behavior contract

Owner-readable expectations for Markdown posts. Tests reference IDs below.

## BLOG-001: Locale-specific post wins over shared

Given a shared post file `slug.md` and a locale file `slug.en.md`,
When the site lists or loads posts for `en`,
Then the locale-specific title, excerpt, and body are used,
And other locales without their own file still receive the shared post.

Never merge fields from both files; one winning file supplies the whole post.

## BLOG-002: Cover image is optional metadata

Given a post declares `image` in frontmatter with a root-relative public path,
When the post is listed or opened,
Then that path is available to the page as cover metadata.

Given a post omits `image`,
When the post is listed or opened,
Then cover metadata is absent (no invented default path).

Never invent a cover path when frontmatter has none.

## BLOG-003: Posts order newest first

Given multiple posts with different `date` values,
When the blog index lists posts for a locale,
Then they are ordered by date descending (newest first).

## BLOG-004: Featured posts are explicit

Given a post sets `featured: true`,
When home or featured surfaces ask for featured posts,
Then that post is marked featured.

Never treat “has an image” or “is first in the folder” as featured.

## BLOG-005: Evergreen topics are optional and separately indexed

Given `features.topics` is enabled and a topic has valid title, description,
and `updated` frontmatter,
When the site is built,
Then its topic index and article route are emitted and listed in the sitemap
and `llms.txt`,
And it is excluded from the dated post listing and RSS feed.

Given a topic is marked `draft: true`,
When a production build runs,
Then its article route and discovery entries are omitted.

Given `features.topics` is disabled,
When the site is built,
Then no topic routes are emitted.

## BLOG-006: Long articles have responsive section navigation

Given a published article has at least four non-empty section headings,
When its static page is built,
Then a localized contents navigation lists those headings in source order,
And every link targets the matching heading in the article body,
And the navigation sits above the article on narrow screens and beside it on
wide screens.

Given an article has fewer than four section headings,
When its page is built,
Then the compact reading layout is retained without an empty contents panel.
