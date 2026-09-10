"use client";

/**
 * ThemeToggle -- accessible two-state light ↔ dark toggle.
 *
 * Always renders the real button (never an empty placeholder) so the control
 * is visible even before / without hydration. Icon state syncs after mount
 * from the `.dark` class set by the BaseLayout theme-init script.
 */

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

interface ThemeToggleProps {
  className?: string;
  labelToggle?: string;
  labelLight?: string;
  labelDark?: string;
}

function readIsDark(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

export function ThemeToggle({
  className,
  labelToggle = "Toggle theme",
  labelLight = "Light",
  labelDark = "Dark",
}: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(readIsDark());
  }, []);

  const nextTheme = isDark ? "light" : "dark";
  const Icon = isDark ? Sun : Moon;
  const label = `${labelToggle}: ${isDark ? labelLight : labelDark}`;

  return (
    <button
      type="button"
      onClick={() => {
        const next = !isDark;
        document.documentElement.classList.toggle("dark", next);
        try {
          localStorage.setItem("theme", next ? "dark" : "light");
        } catch {
          /* ignore */
        }
        setIsDark(next);
      }}
      aria-label={label}
      title={label}
      data-testid="theme-toggle"
      data-theme-value={isDark ? "dark" : "light"}
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
    >
      <Icon aria-hidden="true" className="h-4 w-4" />
      <span className="sr-only">{nextTheme}</span>
    </button>
  );
}
