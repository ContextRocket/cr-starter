/**
 * Component tests for TestimonialsSection.
 *
 * The component is i18n-agnostic: it takes already-resolved chrome strings and
 * resolved testimonial items. These tests verify:
 *   - renders one card per item (N cards)
 *   - empty items -> renders nothing (no heading, no layout shift)
 *   - avatar image when provided; initials fallback otherwise
 *   - star rating group is exposed with the caller's accessible label
 */

import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom/vitest";

import { TestimonialsSection } from "@/components/shared/sections/testimonials-section";
import type { Testimonial } from "@/lib/testimonials";

function item(overrides: Partial<Testimonial> = {}): Testimonial {
  return {
    id: "jane-doe",
    author: "Jane Doe",
    company: "Acme Inc",
    role: "Head of Growth",
    quote: "A great placeholder quote.",
    featured: false,
    order: 1,
    ...overrides,
  };
}

function renderSection(items: Testimonial[]) {
  return render(
    <TestimonialsSection
      eyebrow="Testimonials"
      title="What our customers say"
      items={items}
      regionLabel="Customer testimonials"
      ratingLabel={(r) => `Rated ${r} out of 5`}
    />,
  );
}

describe("TestimonialsSection", () => {
  it("renders one card per item", () => {
    renderSection([
      item({ id: "a", author: "Author A" }),
      item({ id: "b", author: "Author B" }),
      item({ id: "c", author: "Author C" }),
    ]);
    const cards = screen.getAllByRole("listitem");
    expect(cards).toHaveLength(3);
    expect(screen.getByText("Author A")).toBeInTheDocument();
    expect(screen.getByText("Author B")).toBeInTheDocument();
    expect(screen.getByText("Author C")).toBeInTheDocument();
  });

  it("renders nothing when there are no items", () => {
    const { container } = renderSection([]);
    expect(container).toBeEmptyDOMElement();
    expect(
      screen.queryByText("What our customers say"),
    ).not.toBeInTheDocument();
  });

  it("renders an avatar image when provided", () => {
    // The avatar is decorative (alt=""): the author name is already in text,
    // so the <img> is presentational and carries no accessible name. Query the
    // DOM element directly rather than by role.
    const { container } = renderSection([
      item({ avatar: "/testimonials/example.jpg" }),
    ]);
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("src");
  });

  it("falls back to author initials when no avatar", () => {
    renderSection([item({ avatar: undefined, author: "Jane Doe" })]);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("exposes the star rating with the caller's accessible label", () => {
    renderSection([item({ rating: 5 })]);
    expect(
      screen.getByRole("img", { name: "Rated 5 out of 5" }),
    ).toBeInTheDocument();
  });

  it("shows role and company together in the affiliation line", () => {
    renderSection([item({ role: "Head of Growth", company: "Acme Inc" })]);
    expect(screen.getByText("Head of Growth, Acme Inc")).toBeInTheDocument();
  });
});
