import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";

import {
  NotificationBarStack,
  type NotificationItem,
} from "@/components/sections/notification-bar";

const DISMISSED_KEY = "cr-dismissed-notifications";

function items(): NotificationItem[] {
  return [
    { id: "a", tone: "info", message: "First bar" },
    { id: "b", tone: "warning", message: "Second bar" },
  ];
}

function renderStack(props: Partial<React.ComponentProps<typeof NotificationBarStack>> = {}) {
  return render(
    <NotificationBarStack
      items={items()}
      regionLabel="Site notifications"
      dismissLabel="Dismiss notification"
      {...props}
    />,
  );
}

describe("NotificationBarStack", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders one bar per item, in order", () => {
    renderStack();
    const bars = screen.getAllByTestId("notification-bar");
    expect(bars).toHaveLength(2);
    expect(bars[0]).toHaveTextContent("First bar");
    expect(bars[1]).toHaveTextContent("Second bar");
  });

  it("exposes a labelled region wrapper", () => {
    renderStack();
    expect(
      screen.getByRole("region", { name: "Site notifications" }),
    ).toBeInTheDocument();
  });

  it("renders nothing when items is empty (no wrapper)", () => {
    const { container } = renderStack({ items: [] });
    expect(container.innerHTML).toBe("");
    expect(screen.queryByTestId("notification-bar-stack")).not.toBeInTheDocument();
  });

  it("dismiss removes a bar and leaves the others", async () => {
    const user = userEvent.setup();
    renderStack();
    const dismissButtons = screen.getAllByLabelText("Dismiss notification");
    await user.click(dismissButtons[0]);

    const bars = screen.getAllByTestId("notification-bar");
    expect(bars).toHaveLength(1);
    expect(bars[0]).toHaveTextContent("Second bar");
  });

  it("renders an inline action link when action is provided", () => {
    render(
      <NotificationBarStack
        items={[
          {
            id: "a",
            message: "Has action",
            action: { label: "Learn more", href: "/blog" },
          },
        ]}
        regionLabel="Site notifications"
        dismissLabel="Dismiss notification"
      />,
    );
    const link = screen.getByRole("link", { name: "Learn more" });
    expect(link).toHaveAttribute("href", "/blog");
  });

  it("omits the dismiss button when dismissible is false", () => {
    render(
      <NotificationBarStack
        items={[{ id: "a", message: "Sticky", dismissible: false }]}
        regionLabel="Site notifications"
        dismissLabel="Dismiss notification"
      />,
    );
    expect(
      screen.queryByTestId("notification-bar-dismiss"),
    ).not.toBeInTheDocument();
  });

  it("persists a dismissal to localStorage", async () => {
    const user = userEvent.setup();
    renderStack();
    await user.click(screen.getAllByLabelText("Dismiss notification")[0]);

    const raw = window.localStorage.getItem(DISMISSED_KEY);
    expect(JSON.parse(raw ?? "[]")).toContain("a");
  });

  it("keeps a persisted dismissal hidden after remount", () => {
    window.localStorage.setItem(DISMISSED_KEY, JSON.stringify(["a"]));
    renderStack();
    const bars = screen.getAllByTestId("notification-bar");
    expect(bars).toHaveLength(1);
    expect(bars[0]).toHaveTextContent("Second bar");
  });

  it("does not persist when persist is false", async () => {
    const user = userEvent.setup();
    renderStack({ persist: false });
    await user.click(screen.getAllByLabelText("Dismiss notification")[0]);
    expect(window.localStorage.getItem(DISMISSED_KEY)).toBeNull();
  });

  it("ignores a persisted dismissal when persist is false", () => {
    window.localStorage.setItem(DISMISSED_KEY, JSON.stringify(["a"]));
    renderStack({ persist: false });
    expect(screen.getAllByTestId("notification-bar")).toHaveLength(2);
  });
});
