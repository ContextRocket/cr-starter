"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { t } from "@/i18n/keys";

import { cn } from "@/lib/utils";

/**
 * ProbeTerminal -- a terminal-styled, static Probe input for the home hero.
 *
 * UI-only: there is NO backend call. Submitting (button or Enter) reveals a
 * stubbed "scan starting" output block plus a waitlist nudge, so the surface
 * reads as a genuine preview without pretending to run a real brand scan.
 *
 * Styling leans on the shared terminal utilities in globals.css
 * (`.terminal-card`, `.terminal-card__chrome`, `.terminal-card__dot`) and
 * theme tokens only -- no hardcoded colors.
 */
type ProbeTab = "company" | "personal";

export function ProbeTerminal() {

  const [tab, setTab] = useState<ProbeTab>("company");
  const [value, setValue] = useState("");
  const [scanned, setScanned] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    // Static preview only -- never hit a backend.
    setScanned(trimmed);
  }

  return (
    <div className="terminal-card w-full text-left text-sm shadow-lg">
      {/* Chrome bar: window dots + system label + Cmd hint */}
      <div className="terminal-card__chrome justify-between">
        <div className="flex items-center gap-1.5">
          <span className="terminal-card__dot" />
          <span className="terminal-card__dot" />
          <span className="terminal-card__dot" />
          <span className="ml-2 text-xs text-muted-foreground">
            {t("home.probe.systemLine")}
          </span>
        </div>
        <span className="text-[0.7rem] text-muted-foreground">
          {t("home.probe.cmdHint")}
        </span>
      </div>

      <div className="p-4 sm:p-5">
        {/* Tabs -- purely cosmetic scope toggle */}
        <div className="flex items-center gap-4 border-b border-border pb-3 text-xs">
          <button
            type="button"
            onClick={() => setTab("company")}
            aria-pressed={tab === "company"}
            className={cn(
              "pb-1 transition-colors",
              tab === "company"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t("home.probe.tabCompany")}
          </button>
          <button
            type="button"
            onClick={() => setTab("personal")}
            aria-pressed={tab === "personal"}
            className={cn(
              "pb-1 transition-colors",
              tab === "personal"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t("home.probe.tabPersonal")}
          </button>
        </div>

        {/* Prompt row: caret + input + Analyze */}
        <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
          <span aria-hidden="true" className="text-primary select-none">
            &gt;
          </span>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={t("home.probe.placeholder")}
            aria-label={t("home.probe.placeholder")}
            className="min-w-0 flex-1 bg-transparent font-mono text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {t("home.probe.analyze")}
          </button>
        </form>

        {/* Hint line */}
        <p className="mt-2 text-xs text-muted-foreground">
          {t("home.probe.hint")}
        </p>

        {/* Static stubbed output -- obviously a preview */}
        {scanned && (
          <div className="mt-4 space-y-1 border-t border-border pt-3 text-xs">
            <p className="text-muted-foreground">
              <span className="text-primary">&gt;</span> scanning {scanned}…
            </p>
            <p className="text-muted-foreground">
              {t("home.probe.demoNote")}{" "}
              <Link
                href="/waitlist"
                className="text-primary underline hover:opacity-80"
              >
                /waitlist
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
