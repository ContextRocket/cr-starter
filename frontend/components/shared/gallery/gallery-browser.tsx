"use client";

/**
 * Filterable gallery browser backed by the generic GalleryImage contract.
 * Collections of kind `event` are presented in exactly the same control as
 * other collections, so a fork can start with events and grow into press,
 * portfolio, or profile collections without another component.
 */

import { useMemo, useState } from "react";
import { t } from "@/i18n/keys";
import type { GalleryCollection, GalleryImage } from "@/lib/gallery";
import { ImageLightbox } from "@/components/shared/gallery/image-lightbox";

interface GalleryBrowserProps {
  images: readonly GalleryImage[];
  collections?: readonly GalleryCollection[];
  className?: string;
}

export function GalleryBrowser({
  images,
  collections = [],
  className,
}: GalleryBrowserProps) {
  const [selectedCollection, setSelectedCollection] = useState("all");

  const availableCollections = useMemo(
    () =>
      collections.filter((collection) =>
        images.some((image) => image.collectionIds?.includes(collection.id)),
      ),
    [collections, images],
  );

  const visibleImages = useMemo(
    () =>
      selectedCollection === "all"
        ? images
        : images.filter((image) =>
            image.collectionIds?.includes(selectedCollection),
          ),
    [images, selectedCollection],
  );

  const lightboxImages = useMemo(
    () =>
      visibleImages.map((image) => ({
        ...image,
        src: image.lightboxSrc ?? image.src,
      })),
    [visibleImages],
  );

  return (
    <section className={className} data-testid="gallery-browser">
      {availableCollections.length > 0 ? (
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <label
            htmlFor="gallery-collection"
            className="text-sm font-medium text-foreground"
          >
            {t("gallery.filter")}
          </label>
          <select
            id="gallery-collection"
            value={selectedCollection}
            onChange={(event) => setSelectedCollection(event.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">{t("gallery.all")}</option>
            {availableCollections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.label}
              </option>
            ))}
          </select>
          <span className="text-sm text-muted-foreground" aria-live="polite">
            {t("gallery.imageCount", { count: String(visibleImages.length) })}
          </span>
        </div>
      ) : null}

      {visibleImages.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleImages.map((image, index) => (
            <ImageLightbox
              key={image.id || image.src}
              images={lightboxImages}
              initialIndex={index}
              className="group block w-full overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <figure>
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                {image.title || image.caption ? (
                  <figcaption className="px-4 py-3 text-sm text-muted-foreground">
                    {image.title || image.caption}
                  </figcaption>
                ) : null}
              </figure>
            </ImageLightbox>
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
          {t("gallery.noImages")}
        </p>
      )}
    </section>
  );
}
