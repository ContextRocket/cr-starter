"use client";

import { useState } from "react";
import { t } from "@/i18n/keys";

import type { SourceRef } from "@/lib/a2a-client";
import {
  SourceSheet,
  deduplicateSourceRefs,
} from "@/components/shared/chat/source-sheet";

interface CitationPillsProps {
  sourceRefs: SourceRef[];
  /**
   * "new-tab"  -- source links open in a new tab (default, embed-safe).
   * "preview"  -- in-panel preview sheet with "open in new tab" action.
   */
  linkMode?: "new-tab" | "preview";
}

/**
 * Numbered citation pills deduped by source document.
 *
 * One pill per source document even when multiple sections were cited; the
 * source sheet lists the specific cited sections and provenance fields.
 * Tapping a pill opens the source sheet positioned over the chat surface.
 */
export function CitationPills({
  sourceRefs,
  linkMode = "new-tab",
}: CitationPillsProps) {

  const [sheetOpen, setSheetOpen] = useState(false);

  if (!sourceRefs.length) return null;

  const sources = deduplicateSourceRefs(sourceRefs);

  return (
    <>
      <div
        data-testid="citation-pills"
        className="flex flex-wrap items-center gap-1.5 pt-1"
        aria-label={t("chat.sources")}
      >
        {sources.map((source, i) => {
          const label = `[${i + 1}]`;
          const title = source.title;

          return (
            <button
              key={source.key}
              onClick={() => setSheetOpen(true)}
              className="inline-flex items-center rounded-full bg-[#e7f2ff] px-2 py-0.5 transition-opacity hover:opacity-80"
              aria-label={`${label} ${title}`}
              data-testid={`citation-pill-${i + 1}`}
            >
              <span className="flex items-center gap-1.5 text-[12px] font-semibold text-primary">
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                  {i + 1}
                </span>
                <span className="max-w-[160px] truncate">{title}</span>
              </span>
            </button>
          );
        })}
      </div>

      <SourceSheet
        sources={sources}
        linkMode={linkMode}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </>
  );
}
