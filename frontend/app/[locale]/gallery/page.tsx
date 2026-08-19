/**
 * Gallery page -- /{locale}/gallery.
 *
 * The route is optional and feature-gated. Forks that only need the shared
 * lightbox can leave it off; forks with a manifest can enable it and add a
 * normal site.json nav link. The content remains a static JSON atom, so this
 * also works in a static export.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setLocale, t } from "@/i18n/keys";
import { resolveLocale } from "@/i18n/messages";
import { siteConfig } from "@/config/site.config";
import { loadGalleryManifest } from "@/lib/gallery-server";
import { toGalleryImage } from "@/lib/gallery";
import { buildAlternates } from "@/lib/seo";
import { GalleryBrowser } from "@/components/shared/gallery";
import { SectionWrapper } from "@/components/shared/sections/section-wrapper";

interface GalleryPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: GalleryPageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  setLocale(locale);
  if (!siteConfig.features.gallery) {
    return { robots: { index: false, follow: false } };
  }
  return {
    title: t("gallery.title"),
    description: t("gallery.subtitle"),
    alternates: buildAlternates(locale, siteConfig.paths.gallery),
    robots: { index: true, follow: true },
  };
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const locale = resolveLocale((await params).locale);
  setLocale(locale);
  if (!siteConfig.features.gallery) notFound();

  const manifest = loadGalleryManifest();
  const images = manifest.assets.map((asset) =>
    toGalleryImage(asset, siteConfig.gallery.assetBaseUrl, "card"),
  );

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      data-testid="gallery-page"
    >
      <SectionWrapper padding="loose" backgroundClass="bg-muted">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">
            {t("gallery.title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {t("gallery.subtitle")}
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper padding="loose">
        <div className="mx-auto max-w-6xl">
          <GalleryBrowser images={images} collections={manifest.collections} />
        </div>
      </SectionWrapper>
    </main>
  );
}
