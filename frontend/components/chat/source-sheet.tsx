"use client";

import { useState } from "react";
import { ExternalLinkIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "@/i18n/keys";
import { safeHref } from "@/lib/safe-href";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SourceRef } from "@/lib/a2a-client";

/**
 * Deduplicated source document for the source sheet.
 * Multiple SourceRef entries with the same url/document are merged here.
 */
export interface DeduplicatedSource {
  /** Canonical source identifier (url preferred, sourceRefId fallback). */
  key: string;
  /** Display title for the source document. */
  title: string;
  /** URL for the "Open source" link. May be absent for internal sources. */
  url?: string;
  /** All cited section excerpts from this source document. */
  excerpts: string[];
  /** Publisher / provenance fields from the platform, when present. */
  publisher?: string;
  date?: string;
  license?: string;
}

/**
 * Deduplicate an array of SourceRef entries by URL (preferred) or sourceRefId.
 * Multiple refs pointing at the same document are merged; their excerpts are collected.
 */
export function deduplicateSourceRefs(refs: SourceRef[]): DeduplicatedSource[] {
  const seen = new Map<string, DeduplicatedSource>();

  for (const ref of refs) {
    // Canonical key: url beats sourceRefId for dedup purposes.
    const key = ref.url ?? ref.sourceRefId;
    const existing = seen.get(key);

    if (existing) {
      if (ref.excerpt) {
        existing.excerpts.push(ref.excerpt);
      }
    } else {
      // Provenance fields: not part of the current SourceRef named properties but
      // may arrive via the index signature ([key: string]: unknown) on extended refs.
      // Cast through unknown to avoid the TS overlap error on the named-type cast.
      const extended = ref as unknown as Record<string, unknown>;
      seen.set(key, {
        key,
        title: ref.title ?? ref.url ?? ref.sourceRefId,
        url: ref.url,
        excerpts: ref.excerpt ? [ref.excerpt] : [],
        publisher:
          typeof extended.publisher === "string"
            ? extended.publisher
            : undefined,
        date: typeof extended.date === "string" ? extended.date : undefined,
        license:
          typeof extended.license === "string" ? extended.license : undefined,
      });
    }
  }

  return Array.from(seen.values());
}

interface SourceSheetProps {
  sources: DeduplicatedSource[];
  /**
   * "new-tab"  -- all source links open in a new tab (default, embed-safe).
   * "preview"  -- clicking a source shows a preview row with "open in new tab".
   */
  linkMode?: "new-tab" | "preview";
  /** Controlled open state (the citation pills own it). */
  open: boolean;
  onClose: () => void;
}

/**
 * Source sheet: a modal dialog listing all cited source documents.
 * Shown when the user taps a citation pill in the message bubble.
 *
 * Built on the Radix Dialog primitive (components/ui/dialog):
 * - portals out of the transformed drawer container, so position: fixed
 *   works regardless of ancestor transforms;
 * - focus is trapped inside the sheet, moved into it on open, and returned
 *   to the trigger on close;
 * - Escape closes the sheet without also closing the chat drawer (the
 *   drawer's Escape handler skips defaultPrevented events).
 *
 * All source URLs pass through safeHref(): only http/https targets are
 * opened; javascript:/data:/other schemes render no open action.
 */
export function SourceSheet({
  sources,
  linkMode = "new-tab",
  open,
  onClose,
}: SourceSheetProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent
        data-testid="source-sheet"
        aria-describedby={undefined}
        showCloseButton={false}
        className={cn(
          "flex max-h-[80dvh] w-full max-w-lg flex-col gap-0 overflow-hidden p-0",
          "rounded-2xl border-border/60",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <DialogTitle className="text-sm font-semibold text-foreground">
            {t("chat.source.sheet.title")}
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              ({sources.length})
            </span>
          </DialogTitle>
          <DialogClose
            aria-label={t("chat.close")}
            className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            data-testid="source-sheet-close"
          >
            <XIcon className="size-4" aria-hidden />
          </DialogClose>
        </div>

        {/* Source list */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <ul className="flex flex-col gap-4" data-testid="source-sheet-list">
            {sources.map((source, index) => (
              <SourceItem
                key={source.key}
                source={source}
                index={index}
                linkMode={linkMode}
              />
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface SourceItemProps {
  source: DeduplicatedSource;
  index: number;
  linkMode: "new-tab" | "preview";
}

function SourceItem({ source, index, linkMode }: SourceItemProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  // Scheme guard: metadata URLs are external input. Only http/https may be
  // opened; anything else renders no open action at all.
  const href = safeHref(source.url);

  const openLink = () => {
    if (!href) return;
    if (linkMode === "new-tab") {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      setPreviewOpen((prev) => !prev);
    }
  };

  return (
    <li
      data-testid={`source-item-${index + 1}`}
      className="rounded-xl border border-border/60 bg-card/60 p-3"
    >
      {/* Source title row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white"
            aria-hidden="true"
          >
            {index + 1}
          </span>
          <span className="text-sm font-medium text-foreground leading-tight">
            {source.title}
          </span>
        </div>

        {href && (
          <button
            onClick={openLink}
            aria-label={t("chat.source.sheet.open")}
            className="shrink-0 flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
            data-testid={`source-open-${index + 1}`}
          >
            <ExternalLinkIcon className="size-3" aria-hidden />
            {t("chat.source.sheet.open")}
          </button>
        )}
      </div>

      {/* Provenance fields: only render non-empty rows */}
      {(source.publisher || source.date || source.license) && (
        <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
          {source.publisher && (
            <div className="flex gap-1">
              <dt className="font-medium">{t("chat.source.publisher")}:</dt>
              <dd>{source.publisher}</dd>
            </div>
          )}
          {source.date && (
            <div className="flex gap-1">
              <dt className="font-medium">{t("chat.source.date")}:</dt>
              <dd>{source.date}</dd>
            </div>
          )}
          {source.license && (
            <div className="flex gap-1">
              <dt className="font-medium">{t("chat.source.license")}:</dt>
              <dd>{source.license}</dd>
            </div>
          )}
        </dl>
      )}

      {/* Cited section excerpts */}
      {source.excerpts.length > 0 && (
        <div className="mt-2 space-y-1.5">
          {source.excerpts.map((excerpt, ei) => (
            <blockquote
              key={ei}
              className="border-l-2 border-primary/30 pl-2 text-xs leading-relaxed text-muted-foreground italic"
              data-testid={`source-excerpt-${index + 1}-${ei + 1}`}
            >
              {excerpt}
            </blockquote>
          ))}
        </div>
      )}

      {/* In-panel preview (linkMode === "preview" only) */}
      {previewOpen && href && linkMode === "preview" && (
        <div
          className="mt-2 rounded-lg border border-border/60 bg-muted/40 p-2"
          data-testid={`source-preview-${index + 1}`}
        >
          <p className="text-xs text-muted-foreground break-all">{href}</p>
          <button
            onClick={() => window.open(href, "_blank", "noopener,noreferrer")}
            className="mt-1.5 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <ExternalLinkIcon className="size-3" aria-hidden />
            {t("chat.sourceSheet.openNewTab")}
          </button>
        </div>
      )}
    </li>
  );
}
