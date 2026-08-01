"use client";

import { useState, useEffect, useRef } from "react";
import { t } from "@/i18n/keys";
import { Brain } from "lucide-react";

export function ThinkingPill() {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <span
      data-testid="thinking-pill"
      className="mb-2 inline-flex shrink-0 items-center gap-2 rounded-full border border-border/60 bg-background/80 px-2.5 py-1.5 text-[12px] font-semibold text-[#666666] shadow-sm backdrop-blur-sm transition-all duration-200"
      role="status"
      aria-live="polite"
    >
      <Brain className="h-3.5 w-3.5 opacity-70" />
      <span>{t("CHAT_THINKING")}</span>
      <span className="text-[#8e8e8e]">·</span>
      <span className="tabular-nums text-[#8e8e8e]">{elapsed}s</span>
    </span>
  );
}
