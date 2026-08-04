"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqSectionProps {
  label?: string;
  title: string;
  items: FaqItem[];
  className?: string;
}

export function FaqSection({
  label,
  title,
  items,
  className = "",
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className={`px-6 py-24 sm:py-32 max-w-3xl mx-auto ${className}`}>
      {label && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary text-center">
          {label}
        </p>
      )}
      <h2 className="mt-4 text-3xl font-bold text-center sm:text-4xl">{title}</h2>
      <dl className="mt-14 divide-y divide-border">
        {items.map((item, i) => (
          <div key={i} className="py-1">
            <dt>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-primary"
              >
                <span className="text-base font-semibold pr-4">{item.question}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-primary transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
            </dt>
            <dd
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === i ? "max-h-96 pb-5" : "max-h-0"
              }`}
            >
              <p className="text-sm leading-7 text-muted-foreground">{item.answer}</p>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
