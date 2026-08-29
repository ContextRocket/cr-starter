/**
 * Landing-page manifest adapter — maps typed sections onto shared components.
 *
 * Never invents copy. Missing/unsupported sections are omitted. Lead forms are
 * not rendered live in this proof (fail-closed on the product side); CTA-only
 * contact is explicit in the reviewed manifest.
 */

import type {
  AssetRef,
  ContentFeedSection,
  CtaSection,
  FaqSection,
  FeatureGridSection,
  HeroSection,
  LandingPageManifest,
  LandingPageSection,
  LogoStripSection,
  MediaSection,
  ProofStatSection,
  RichTextSection,
  TestimonialSection,
} from "@/lib/generated/landing-page-manifest";

export type { LandingPageManifest, LandingPageSection };

const PUBLIC_ASSET_PREFIX = "/landing-page";

export function assetPublicPath(asset: AssetRef): string {
  const path = asset.local_path.replace(/^\/+/, "");
  return `${PUBLIC_ASSET_PREFIX}/${path}`;
}

export function assetById(
  manifest: LandingPageManifest,
  assetId: string | null | undefined,
): AssetRef | undefined {
  if (!assetId) return undefined;
  return manifest.assets.find((a) => a.asset_id === assetId);
}

export function visibleSections(
  manifest: LandingPageManifest,
): LandingPageSection[] {
  return [...manifest.sections]
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}

export interface ResolvedHero {
  kind: "hero";
  id: string;
  title: string;
  description: string;
  body: string[];
  actions: { label: string; href: string; variant?: "primary" | "outline" }[];
}

export interface ResolvedProof {
  kind: "proof_stat";
  id: string;
  title?: string;
  items: { value: string; label: string }[];
}

export interface ResolvedRichText {
  kind: "rich_text";
  id: string;
  title?: string;
  paragraphs: string[];
}

export interface ResolvedMedia {
  kind: "media";
  id: string;
  title?: string;
  eyebrow?: string;
  body: string[];
  images: { src: string; alt: string; width?: number; height?: number }[];
}

export interface ResolvedLogoStrip {
  kind: "logo_strip";
  id: string;
  title?: string;
  logos: { src: string; alt: string }[];
}

export interface ResolvedFeatureGrid {
  kind: "feature_grid";
  id: string;
  title: string;
  subtitle?: string;
  items: { title: string; description: string }[];
  columns: 2 | 3 | 4;
}

export interface ResolvedTestimonial {
  kind: "testimonial";
  id: string;
  title: string;
  items: {
    id: string;
    author: string;
    quote: string;
    company?: string;
    role?: string;
    avatar?: string;
    rating?: number;
  }[];
}

export interface ResolvedFaq {
  kind: "faq";
  id: string;
  title: string;
  items: { question: string; answer: string }[];
}

export interface ResolvedContentFeed {
  kind: "content_feed";
  id: string;
  title: string;
  items: { title: string; href: string; summary?: string }[];
  viewAllLabel?: string;
  viewAllHref?: string;
}

export interface ResolvedCta {
  kind: "cta";
  id: string;
  title: string;
  description: string;
  action: { label: string; href: string };
}

/** Sections the adapter knows how to render. lead_form is intentionally omitted. */
export type ResolvedSection =
  | ResolvedHero
  | ResolvedProof
  | ResolvedRichText
  | ResolvedMedia
  | ResolvedLogoStrip
  | ResolvedFeatureGrid
  | ResolvedTestimonial
  | ResolvedFaq
  | ResolvedContentFeed
  | ResolvedCta;

function resolveHero(section: HeroSection): ResolvedHero {
  const description =
    section.subhead?.trim() ||
    section.body?.[0]?.trim() ||
    section.headline;
  return {
    kind: "hero",
    id: section.id,
    title: section.headline,
    description,
    body: (section.body ?? []).filter((p) => p.trim().length > 0),
    actions: (section.actions ?? []).map((a) => ({
      label: a.label,
      href: a.href,
      variant: "primary" as const,
    })),
  };
}

function resolveProof(section: ProofStatSection): ResolvedProof {
  return {
    kind: "proof_stat",
    id: section.id,
    title: section.title ?? undefined,
    items: section.items.map((i) => ({ value: i.value, label: i.label })),
  };
}

function resolveRichText(section: RichTextSection): ResolvedRichText {
  return {
    kind: "rich_text",
    id: section.id,
    title: section.title ?? undefined,
    paragraphs: section.paragraphs,
  };
}

function resolveMedia(
  section: MediaSection,
  manifest: LandingPageManifest,
): ResolvedMedia | null {
  const images = section.asset_ids
    .map((id) => assetById(manifest, id))
    .filter((a): a is AssetRef => Boolean(a))
    .map((a) => ({
      src: assetPublicPath(a),
      alt: a.alt_text,
      width: a.width ?? undefined,
      height: a.height ?? undefined,
    }));
  if (images.length === 0) return null;
  return {
    kind: "media",
    id: section.id,
    title: section.title ?? undefined,
    eyebrow: section.eyebrow ?? undefined,
    body: section.body ?? [],
    images,
  };
}

function resolveLogoStrip(
  section: LogoStripSection,
  manifest: LandingPageManifest,
): ResolvedLogoStrip | null {
  const logos = section.asset_ids
    .map((id) => assetById(manifest, id))
    .filter((a): a is AssetRef => Boolean(a))
    .map((a) => ({ src: assetPublicPath(a), alt: a.alt_text }));
  if (logos.length === 0) return null;
  return {
    kind: "logo_strip",
    id: section.id,
    title: section.title ?? undefined,
    logos,
  };
}

function resolveFeatureGrid(section: FeatureGridSection): ResolvedFeatureGrid {
  return {
    kind: "feature_grid",
    id: section.id,
    title: section.title,
    subtitle: section.subtitle ?? undefined,
    items: section.items.map((i) => ({
      title: i.title,
      description: i.description,
    })),
    columns: section.columns ?? 3,
  };
}

function resolveTestimonial(
  section: TestimonialSection,
  manifest: LandingPageManifest,
): ResolvedTestimonial {
  return {
    kind: "testimonial",
    id: section.id,
    title: section.title,
    items: section.items.map((item) => {
      const avatar = assetById(manifest, item.avatar_asset_id ?? undefined);
      return {
        id: item.id,
        author: item.author,
        quote: item.quote,
        company: item.company ?? undefined,
        role: item.role ?? undefined,
        avatar: avatar ? assetPublicPath(avatar) : undefined,
        rating: item.rating ?? undefined,
      };
    }),
  };
}

function resolveFaq(section: FaqSection): ResolvedFaq {
  return {
    kind: "faq",
    id: section.id,
    title: section.title,
    items: section.items.map((i) => ({
      question: i.question,
      answer: i.answer,
    })),
  };
}

function resolveContentFeed(section: ContentFeedSection): ResolvedContentFeed {
  return {
    kind: "content_feed",
    id: section.id,
    title: section.title,
    items: (section.items ?? []).map((i) => ({
      title: i.title,
      href: i.href,
      summary: i.summary ?? undefined,
    })),
    viewAllLabel: section.view_all_label ?? undefined,
    viewAllHref: section.view_all_href ?? undefined,
  };
}

function resolveCta(section: CtaSection): ResolvedCta | null {
  if (!section.href || !section.action_label) return null;
  // Never invent a decorative form — only explicit CTA destinations.
  if (section.destination_kind === "form_binding") return null;
  return {
    kind: "cta",
    id: section.id,
    title: section.title,
    description: section.description?.trim() || section.title,
    action: { label: section.action_label, href: section.href },
  };
}

export function resolveManifestSections(
  manifest: LandingPageManifest,
): ResolvedSection[] {
  const out: ResolvedSection[] = [];
  for (const section of visibleSections(manifest)) {
    switch (section.type) {
      case "hero":
        out.push(resolveHero(section));
        break;
      case "proof_stat":
        out.push(resolveProof(section));
        break;
      case "rich_text":
        out.push(resolveRichText(section));
        break;
      case "media": {
        const media = resolveMedia(section, manifest);
        if (media) out.push(media);
        break;
      }
      case "logo_strip": {
        const logos = resolveLogoStrip(section, manifest);
        if (logos) out.push(logos);
        break;
      }
      case "feature_grid":
        out.push(resolveFeatureGrid(section));
        break;
      case "testimonial":
        out.push(resolveTestimonial(section, manifest));
        break;
      case "faq":
        out.push(resolveFaq(section));
        break;
      case "content_feed":
        out.push(resolveContentFeed(section));
        break;
      case "cta": {
        const cta = resolveCta(section);
        if (cta) out.push(cta);
        break;
      }
      case "lead_form":
        // Intentionally omitted — live Lead Capture is out of scope (cr-1mv.101).
        // Product validation fails closed when a binding cannot resolve.
        break;
      default:
        break;
    }
  }
  return out;
}
