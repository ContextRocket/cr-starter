import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GalleryBrowser } from "@/components/shared/gallery";
import type { GalleryImage } from "@/lib/gallery";

const images: GalleryImage[] = [
  {
    id: "launch-keynote",
    src: "/gallery/launch/keynote.jpg",
    alt: "Launch keynote",
    collectionIds: ["launch"],
    roles: ["event"],
  },
  {
    id: "profile",
    src: "/gallery/profile/mark.jpg",
    alt: "Profile image",
    collectionIds: ["profile"],
    roles: ["profile"],
  },
];

describe("GalleryBrowser", () => {
  it("filters by collection and opens the shared lightbox", () => {
    render(
      <GalleryBrowser
        images={images}
        collections={[
          { id: "launch", label: "Launch", kind: "event" },
          { id: "profile", label: "Profile", kind: "collection" },
        ]}
      />,
    );

    expect(screen.getAllByRole("button")).toHaveLength(2);
    fireEvent.change(screen.getByLabelText("Filter by collection"), {
      target: { value: "launch" },
    });
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(screen.getByAltText("Launch keynote")).toBeInTheDocument();
    expect(screen.queryByAltText("Profile image")).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "View image: Launch keynote" }),
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      within(screen.getByRole("dialog")).getByRole("img", {
        name: "Launch keynote",
      }),
    ).toHaveAttribute("src", "/gallery/launch/keynote.jpg");
    fireEvent.click(screen.getByRole("button", { name: "Close image" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders an explicit empty state", () => {
    render(<GalleryBrowser images={[]} />);
    expect(
      screen.getByText("No images match this filter."),
    ).toBeInTheDocument();
  });
});
