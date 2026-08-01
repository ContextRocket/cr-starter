"use client";

import { t } from "@/i18n/keys";
import type { SourceRef } from "@/lib/a2a-client";

interface CitationPillsProps {
  sourceRefs: SourceRef[];
}

/**
 * Horizontal scrollable row of numbered citation badges.
 * Design notes:
 * - Each chip is a numbered badge [1], [2] etc. in a pill shape
 * - Tappable when a URL is present
 * - "Brand Answered" tint (#e7f2ff bg, primary text) for verified citations
 */
export function CitationPills({ sourceRefs }: CitationPillsProps) {
  if (!sourceRefs.length) return null;

  return (
    <div
      data-testid="citation-pills"
      className="flex flex-wrap items-center gap-1.5 pt-1"
      aria-label={t("CHAT_SOURCES")}
    >
      {sourceRefs.map((ref, i) => {
        const label = `[${i + 1}]`;
        const title = ref.title ?? ref.url ?? ref.sourceRefId;

        const inner = (
          <span className="flex items-center gap-1.5 text-[12px] font-semibold text-primary">
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
              {i + 1}
            </span>
            <span className="max-w-[160px] truncate">{title}</span>
          </span>
        );

        const pillClass =
          "inline-flex items-center rounded-full bg-[#e7f2ff] px-2 py-0.5 transition-opacity hover:opacity-80";

        return ref.url ? (
          <a
            key={ref.sourceRefId}
            href={ref.url}
            target="_blank"
            rel="noopener noreferrer"
            className={pillClass}
            aria-label={`${label} ${title}`}
            data-testid={`citation-pill-${i + 1}`}
          >
            {inner}
          </a>
        ) : (
          <span
            key={ref.sourceRefId}
            className={pillClass}
            aria-label={`${label} ${title}`}
            data-testid={`citation-pill-${i + 1}`}
          >
            {inner}
          </span>
        );
      })}
    </div>
  );
}
