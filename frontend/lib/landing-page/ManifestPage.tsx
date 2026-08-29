/**
 * Renders a resolved LandingPageManifest onto existing shared sections.
 * Omits missing sections; never invents copy.
 */

import Image from "next/image";
import Link from "next/link";
import {
  CtaSection,
  FaqSection,
  FeatureGrid,
  HeroSection,
  LogoCloud,
  StatsBar,
  TestimonialsSection,
} from "@/components/shared/sections";
import type { LandingPageManifest } from "@/lib/generated/landing-page-manifest";
import {
  resolveManifestSections,
  type ResolvedSection,
} from "@/lib/landing-page/resolve";
import type { Testimonial } from "@/lib/testimonials";

function MediaBlock({
  section,
}: {
  section: Extract<ResolvedSection, { kind: "media" }>;
}) {
  return (
    <section
      className="px-6 py-16 max-w-3xl mx-auto text-center"
      data-section={section.id}
    >
      {section.eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {section.eyebrow}
        </p>
      ) : null}
      {section.title ? (
        <h2 className="mt-3 text-2xl font-bold text-foreground">
          {section.title}
        </h2>
      ) : null}
      <div className="mt-8 space-y-6">
        {section.images.map((img) => (
          <Image
            key={img.src}
            src={img.src}
            alt={img.alt}
            width={img.width ?? 560}
            height={img.height ?? 120}
            className="mx-auto h-auto w-auto max-w-full rounded-lg"
            unoptimized
          />
        ))}
      </div>
      {section.body.length > 0 ? (
        <div className="mt-6 space-y-2 text-sm text-muted-foreground">
          {section.body.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function RichTextBlock({
  section,
}: {
  section: Extract<ResolvedSection, { kind: "rich_text" }>;
}) {
  return (
    <section className="px-6 py-12 max-w-2xl mx-auto" data-section={section.id}>
      {section.title ? (
        <h2 className="text-2xl font-bold text-foreground mb-4">
          {section.title}
        </h2>
      ) : null}
      <div className="space-y-4 text-base leading-7 text-muted-foreground">
        {section.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </section>
  );
}

function ContentFeedBlock({
  section,
}: {
  section: Extract<ResolvedSection, { kind: "content_feed" }>;
}) {
  return (
    <section
      className="px-6 py-16 max-w-3xl mx-auto text-center"
      data-section={section.id}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {section.title}
      </p>
      <ul className="mt-6 space-y-4">
        {section.items.map((item) => (
          <li key={item.href + item.title}>
            <Link
              href={item.href}
              className="text-lg font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4"
            >
              {item.title}
            </Link>
            {item.summary ? (
              <p className="mt-2 text-sm text-muted-foreground">
                {item.summary}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
      {section.viewAllLabel && section.viewAllHref ? (
        <Link
          href={section.viewAllHref}
          className="mt-8 inline-flex items-center rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground"
        >
          {section.viewAllLabel}
        </Link>
      ) : null}
    </section>
  );
}

function renderSection(section: ResolvedSection) {
  switch (section.kind) {
    case "hero":
      return (
        <div key={section.id} data-section={section.id}>
          <HeroSection
            title={section.title}
            description={section.description}
            actions={section.actions}
          >
            {section.body.length > 1 ? (
              <div className="mt-10 space-y-4 text-left text-base leading-7 text-muted-foreground max-w-[560px] mx-auto">
                {section.body
                  .slice(section.description === section.body[0] ? 1 : 0)
                  .map((p) => (
                    <p key={p}>{p}</p>
                  ))}
              </div>
            ) : null}
          </HeroSection>
        </div>
      );
    case "proof_stat":
      return (
        <div key={section.id} data-section={section.id}>
          <StatsBar items={section.items} />
        </div>
      );
    case "rich_text":
      return <RichTextBlock key={section.id} section={section} />;
    case "media":
      return <MediaBlock key={section.id} section={section} />;
    case "logo_strip":
      return (
        <div key={section.id} data-section={section.id}>
          <LogoCloud
            heading={section.title}
            items={section.logos.map((l) => ({ src: l.src, alt: l.alt }))}
          />
        </div>
      );
    case "feature_grid":
      return (
        <div key={section.id} data-section={section.id}>
          <FeatureGrid
            title={section.title}
            subtitle={section.subtitle}
            items={section.items}
            columns={section.columns}
          />
        </div>
      );
    case "testimonial": {
      const items: Testimonial[] = section.items.map((item, order) => ({
        id: item.id,
        author: item.author,
        quote: item.quote,
        company: item.company,
        role: item.role ?? "",
        avatar: item.avatar,
        rating: item.rating,
        featured: false,
        order,
      }));
      return (
        <div key={section.id} data-section={section.id}>
          <TestimonialsSection title={section.title} items={items} />
        </div>
      );
    }
    case "faq":
      return (
        <div key={section.id} data-section={section.id}>
          <FaqSection title={section.title} items={section.items} />
        </div>
      );
    case "content_feed":
      return <ContentFeedBlock key={section.id} section={section} />;
    case "cta":
      return (
        <div key={section.id} data-section={section.id}>
          <CtaSection
            title={section.title}
            description={section.description}
            action={section.action}
          />
        </div>
      );
    default:
      return null;
  }
}

export function ManifestPage({ manifest }: { manifest: LandingPageManifest }) {
  const sections = resolveManifestSections(manifest);
  return (
    <main
      data-landing-page={manifest.page_id}
      data-schema-version={manifest.schema_version}
    >
      {manifest.appearance.missing_inputs &&
      manifest.appearance.missing_inputs.length > 0 ? (
        <p
          className="sr-only"
          data-missing-appearance={manifest.appearance.missing_inputs.join(",")}
        >
          Missing appearance inputs:{" "}
          {manifest.appearance.missing_inputs.join(", ")}
        </p>
      ) : null}
      {sections.map((section) => renderSection(section))}
    </main>
  );
}
