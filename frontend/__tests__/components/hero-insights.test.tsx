/**
 * Component tests for HeroInsights (grid layout -- the config-driven panel the
 * starter home ships).
 *
 * The grid layout is content-agnostic: it takes a resolved headline/subhead and
 * an array of {label, value, description} items and renders them as a card grid,
 * each wrapped in a ScrollReveal (AOS). These tests verify:
 *   - headline + subhead render
 *   - one card per item, with label / value / description
 *   - an empty items array still renders the heading but no cards
 */

import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom/vitest";

import {
  HeroInsights,
  type HeroInsightItem,
} from "@/components/shared/sections/hero-insights";

function items(): HeroInsightItem[] {
  return [
    {
      label: "Answer readiness",
      value: "92%",
      description: "How much content is ready to be cited.",
      color: "green",
    },
    {
      label: "Sources indexed",
      value: "1,240",
      description: "Pages and documents in the knowledge base.",
      color: "blue",
    },
    {
      label: "Time to answer",
      value: "0.8s",
      description: "Median latency for a grounded response.",
      color: "yellow",
    },
  ];
}

function renderPanel(overrides: Partial<HeroInsightItem>[] = []) {
  const data = overrides.length > 0 ? (overrides as HeroInsightItem[]) : items();
  return render(
    <HeroInsights
      layout="grid"
      headline="Insight at a glance"
      subhead="A few numbers that make the value concrete."
      items={data}
    />,
  );
}

describe("HeroInsights (grid)", () => {
  it("renders the headline and subhead", () => {
    renderPanel();
    expect(screen.getByText("Insight at a glance")).toBeInTheDocument();
    expect(
      screen.getByText("A few numbers that make the value concrete."),
    ).toBeInTheDocument();
  });

  it("renders one card per item with label, value, and description", () => {
    renderPanel();
    for (const item of items()) {
      expect(screen.getByText(item.label)).toBeInTheDocument();
      expect(screen.getByText(item.value)).toBeInTheDocument();
      if (item.description) {
        expect(screen.getByText(item.description)).toBeInTheDocument();
      }
    }
  });

  it("renders the heading but no card values when items is empty", () => {
    render(
      <HeroInsights layout="grid" headline="Empty panel" items={[]} />,
    );
    expect(screen.getByText("Empty panel")).toBeInTheDocument();
    expect(screen.queryByText("92%")).not.toBeInTheDocument();
  });
});
