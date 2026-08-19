"use client";

/**
 * Shared, dependency-free image lightbox.
 *
 * The lightbox knows nothing about the gallery manifest. It accepts any
 * client-ready images, which makes it useful for Markdown images, profile
 * photos, event galleries, and future CDN-backed media alike.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { t } from "@/i18n/keys";
import type { GalleryImage } from "@/lib/gallery";

export type LightboxImage = Pick<
  GalleryImage,
  "src" | "alt" | "caption" | "title"
> & {
  id?: string;
};

interface ImageLightboxProps {
  images: readonly LightboxImage[];
  initialIndex?: number;
  children: ReactNode;
  className?: string;
}

export function ImageLightbox({
  images,
  initialIndex = 0,
  children,
  className,
}: ImageLightboxProps) {
  const [open, setOpen] = useState(false);
  const safeInitialIndex = Math.min(
    Math.max(initialIndex, 0),
    Math.max(images.length - 1, 0),
  );
  const [activeIndex, setActiveIndex] = useState(safeInitialIndex);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const activeImage = images[activeIndex] ?? images[0];
  const hasNavigation = images.length > 1;

  useEffect(() => {
    if (!open && wasOpen.current) triggerRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      } else if (hasNavigation && event.key === "ArrowLeft") {
        setActiveIndex((index) => (index - 1 + images.length) % images.length);
      } else if (hasNavigation && event.key === "ArrowRight") {
        setActiveIndex((index) => (index + 1) % images.length);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasNavigation, images.length, open]);

  if (!activeImage) return <>{children}</>;

  const close = () => setOpen(false);
  const previous = () =>
    setActiveIndex((index) => (index - 1 + images.length) % images.length);
  const next = () => setActiveIndex((index) => (index + 1) % images.length);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={className}
        aria-label={t("gallery.viewImage", { alt: activeImage.alt })}
        onClick={() => {
          setActiveIndex(safeInitialIndex);
          setOpen(true);
        }}
      >
        {children}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.title || activeImage.alt}
          data-testid="gallery-lightbox"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <button
            ref={closeButtonRef}
            type="button"
            className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label={t("gallery.close")}
            onClick={close}
          >
            <span aria-hidden="true">×</span>
          </button>

          {hasNavigation ? (
            <button
              type="button"
              className="absolute left-2 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-3xl text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-6"
              aria-label={t("gallery.previous")}
              onClick={previous}
            >
              <span aria-hidden="true">‹</span>
            </button>
          ) : null}

          <figure className="flex max-h-full max-w-full flex-col items-center gap-3">
            <div className="flex max-h-[calc(100vh-10rem)] max-w-[calc(100vw-4rem)] items-center justify-center sm:max-w-[calc(100vw-10rem)]">
              {/* A plain img keeps this portable to arbitrary future CDN hosts. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeImage.src}
                alt={activeImage.alt}
                className="max-h-[calc(100vh-10rem)] max-w-full object-contain"
              />
            </div>
            <figcaption className="max-w-2xl text-center text-sm text-white/85">
              {activeImage.caption || activeImage.title ? (
                <p>{activeImage.caption || activeImage.title}</p>
              ) : null}
              {hasNavigation ? (
                <p className="mt-1 text-xs text-white/60">
                  {t("gallery.counter", {
                    current: String(activeIndex + 1),
                    total: String(images.length),
                  })}
                </p>
              ) : null}
            </figcaption>
          </figure>

          {hasNavigation ? (
            <button
              type="button"
              className="absolute right-2 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-3xl text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6"
              aria-label={t("gallery.next")}
              onClick={next}
            >
              <span aria-hidden="true">›</span>
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
