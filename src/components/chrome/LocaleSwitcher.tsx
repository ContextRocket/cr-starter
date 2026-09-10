"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export type LocaleOption = {
  code: string;
  label: string;
  href: string;
};

interface LocaleSwitcherProps {
  locale: string;
  options: LocaleOption[];
  changeLanguageLabel?: string;
  className?: string;
}

export function LocaleSwitcher({
  locale,
  options,
  changeLanguageLabel = "Change language",
  className,
}: LocaleSwitcherProps) {
  if (options.length < 2) return null;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    right: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  function setOpen(next: boolean) {
    setDropdownOpen(next);
    if (buttonRef.current && next) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
  }

  return (
    <div ref={containerRef} className={cn("relative z-[70]", className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
        aria-haspopup="menu"
        aria-label={changeLanguageLabel}
        title={changeLanguageLabel}
        data-testid="locale-switcher"
        className="flex h-9 min-w-[3rem] items-center gap-1 rounded px-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <Globe aria-hidden="true" className="h-4 w-4 shrink-0" />
        <span className="text-xs font-medium uppercase">{locale}</span>
      </button>

      {dropdownOpen ? (
        <div
          role="menu"
          data-testid="locale-switcher-menu"
          className="fixed z-[9999] w-40 rounded border border-border bg-card py-1 shadow-lg"
          style={{
            top: dropdownPosition.top,
            right: dropdownPosition.right,
          }}
        >
          {options.map((option) => (
            <a
              key={option.code}
              role="menuitem"
              href={option.href}
              data-testid={`locale-switcher-option-${option.code}`}
              className={cn(
                "block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-foreground/5",
                option.code === locale
                  ? "font-medium text-primary"
                  : "text-foreground",
              )}
            >
              {option.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
