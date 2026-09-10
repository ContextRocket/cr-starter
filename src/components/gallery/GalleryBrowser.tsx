"use client";

/**
 * Filterable gallery browser backed by the generic GalleryImage contract.
 * Collections of kind `event` are presented in exactly the same control as
 * other collections, so a fork can start with events and grow into press,
 * portfolio, or profile collections without another component.
 *
 * Labels are passed in so Astro islands do not need an i18n React provider.
 */

import { useMemo, useState } from "react";
import type { GalleryCollection, GalleryImage } from "@/lib/gallery";
import {
  ImageLightbox,
  type ImageLightboxLabels,
} from "@/components/gallery/ImageLightbox";

export interface GalleryBrowserLabels {
  filter: string;
  all: string;
  imageCount: string; // may include {count}
  noImages: string;
  lightbox?: Partial<ImageLightboxLabels>;
}

interface GalleryBrowserProps {
  images: readonly GalleryImage[];
  collections?: readonly GalleryCollection[];
  className?: string;
  labels: GalleryBrowserLabels;
}

function formatLabel(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    values[key] !== undefined ? String(values[key]) : `{${key}}`,
  );
}

export function GalleryBrowser({
  images,
  collections = [],
  className,
  labels,
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
            {labels.filter}
          </label>
          <select
            id="gallery-collection"
            value={selectedCollection}
            onChange={(event) => setSelectedCollection(event.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">{labels.all}</option>
            {availableCollections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.label}
              </option>
            ))}
          </select>
          <span className="text-sm text-muted-foreground" aria-live="polite">
            {formatLabel(labels.imageCount, {
              count: String(visibleImages.length),
            })}
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
              labels={labels.lightbox}
              className="group block w-full overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <figure>
                <div className="aspect-[4/3] overflow-hidden bg-muted">
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
          {labels.noImages}
        </p>
      )}
    </section>
  );
}
