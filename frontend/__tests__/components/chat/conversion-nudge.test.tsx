/**
 * Tests for ConversionNudge -- guest->registered upgrade nudge.
 */

import { render, screen, fireEvent, act } from "@testing-library/react";
import { ConversionNudge } from "@/components/chat/conversion-nudge";

// Clear sessionStorage before each test to reset the per-session dismiss gate.
beforeEach(() => {
  sessionStorage.clear();
});

describe("ConversionNudge", () => {
  it("renders nothing when isGuest is false", () => {
    const { container } = render(
      <ConversionNudge isGuest={false} onAction={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders for a guest user after mount delay", async () => {
    vi.useFakeTimers();
    render(<ConversionNudge isGuest onAction={vi.fn()} />);

    // Before the delay the component is present but not yet visible.
    expect(screen.getByTestId("conversion-nudge")).toBeInTheDocument();

    // Advance past the 400ms mount delay.
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.getByTestId("conversion-nudge")).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("disappears when dismiss button is clicked", async () => {
    vi.useFakeTimers();
    render(<ConversionNudge isGuest onAction={vi.fn()} />);
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    fireEvent.click(screen.getByTestId("conversion-nudge-dismiss"));

    // After dismissal the component returns null.
    expect(screen.queryByTestId("conversion-nudge")).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it("calls onAction when the CTA is clicked", async () => {
    vi.useFakeTimers();
    const handleAction = vi.fn();
    render(<ConversionNudge isGuest onAction={handleAction} />);
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    fireEvent.click(screen.getByTestId("conversion-nudge-action"));
    expect(handleAction).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("does not show when session key is already set (dismissed this session)", () => {
    sessionStorage.setItem("cr_nudge_dismissed", "1");
    const { container } = render(
      <ConversionNudge isGuest onAction={vi.fn()} />,
    );
    // Dismissed flag is read synchronously in useEffect; the component returns null.
    expect(container.firstChild).toBeNull();
  });

  it("sets session key on dismiss", async () => {
    vi.useFakeTimers();
    render(<ConversionNudge isGuest onAction={vi.fn()} />);
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    fireEvent.click(screen.getByTestId("conversion-nudge-dismiss"));
    expect(sessionStorage.getItem("cr_nudge_dismissed")).toBe("1");
    vi.useRealTimers();
  });
});
