/**
 * profile.config.ts — OPTIONAL person single-source-of-truth for
 * personal-brand forks.
 *
 * A personal-brand site is about a person, so it needs a home for the person's
 * identity (name, bio, social, images) the same way `site.config.ts` is the
 * home for the SITE/brand identity (domain, theme, legal, SEO). Wire a fork's
 * home page + `Person` JSON-LD to read from `profile`, and derive the public
 * name/social in `site.config.ts` from it, so there is exactly one place to
 * edit the person.
 *
 * DESIGN INTENT: this object mirrors the shape of the ContextRocket **Profile**
 * (the personal-brand Context Graph identity). Today it is a static config read
 * at build time; the migration path is to source these fields FROM the
 * ContextRocket Profile so the site and the graph share one identity. Keep the
 * field names aligned with the CR Profile as it lands.
 *
 * ORG / PRODUCT FORKS: delete this file — it is only for personal-brand sites.
 * Replace every placeholder below before launch.
 */

/** Social + contact links. Leave a field undefined to omit it. */
export interface SocialLinks {
  linkedin?: string; // full URL
  x?: string; // full URL (formerly Twitter)
  github?: string; // full URL
  instagram?: string; // full URL
  email?: string; // bare address (rendered as mailto:)
  website?: string; // canonical personal site URL
}

/** A profile / avatar image (files live under frontend/public/). */
export interface ProfileImage {
  /** Path under /public, e.g. "/images/me.jpg". */
  src: string;
  /** Alt text. */
  alt: string;
}

export interface ProfileConfig {
  /** Full name. */
  fullName: string;
  /** Preferred short name. */
  preferredName: string;
  /** One-line headline: who you are / what you do. */
  headline: string;
  /** 1–2 sentence bio (cards, meta description, hero subhead). */
  shortBio: string;
  /** Paragraph bio (about section, JSON-LD `Person.description`). */
  longBio: string;
  /** City / base. */
  location: string;
  /** Current roles / affiliations. */
  roles: string[];
  /**
   * Home hero intro — Markdown content (inline links + line breaks). Rendered
   * with lib/inline-markdown. Content, not UI chrome, so author it here.
   */
  homeIntro: string;
  /** Social + contact links. */
  social: SocialLinks;
  /** Profile images; the first is the primary avatar. */
  images: ProfileImage[];
}

export const profile: ProfileConfig = {
  fullName: "Your Name", // PLACEHOLDER
  preferredName: "Your", // PLACEHOLDER
  headline: "What you do, in one line.", // PLACEHOLDER
  shortBio: "A one- or two-sentence bio for cards and meta descriptions.", // PLACEHOLDER
  longBio:
    "A short paragraph about who you are and what you work on. Used in the " +
    "about section and Person JSON-LD.", // PLACEHOLDER
  location: "City, Country", // PLACEHOLDER
  roles: ["Role, Company"], // PLACEHOLDER
  homeIntro:
    "Your intro line with a [link](https://example.com).\n" +
    "A second line about what you do.\n" +
    "A third line about what you write.", // PLACEHOLDER
  social: {
    linkedin: "", // PLACEHOLDER e.g. "https://www.linkedin.com/in/you"
    x: "", // PLACEHOLDER e.g. "https://x.com/you"
    github: "", // PLACEHOLDER e.g. "https://github.com/you"
    instagram: "", // PLACEHOLDER
    email: "", // PLACEHOLDER e.g. "you@example.com"
    website: "", // PLACEHOLDER e.g. "https://example.com"
  },
  images: [
    // PLACEHOLDER: add an image to /public and update src.
    { src: "/images/profile.jpg", alt: "Your Name" },
  ],
};
