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
      <ConversionNudge isGuest={false} onAction={jest.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders for a guest user after mount delay", async () => {
    jest.useFakeTimers();
    render(<ConversionNudge isGuest onAction={jest.fn()} />);

    // Before the delay the component is present but not yet visible.
    expect(screen.getByTestId("conversion-nudge")).toBeInTheDocument();

    // Advance past the 400ms mount delay.
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(screen.getByTestId("conversion-nudge")).toBeInTheDocument();
    jest.useRealTimers();
  });

  it("disappears when dismiss button is clicked", async () => {
    jest.useFakeTimers();
    render(<ConversionNudge isGuest onAction={jest.fn()} />);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    fireEvent.click(screen.getByTestId("conversion-nudge-dismiss"));

    // After dismissal the component returns null.
    expect(screen.queryByTestId("conversion-nudge")).not.toBeInTheDocument();
    jest.useRealTimers();
  });

  it("calls onAction when the CTA is clicked", async () => {
    jest.useFakeTimers();
    const handleAction = jest.fn();
    render(<ConversionNudge isGuest onAction={handleAction} />);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    fireEvent.click(screen.getByTestId("conversion-nudge-action"));
    expect(handleAction).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it("does not show when session key is already set (dismissed this session)", () => {
    sessionStorage.setItem("cr_nudge_dismissed", "1");
    const { container } = render(
      <ConversionNudge isGuest onAction={jest.fn()} />,
    );
    // Dismissed flag is read synchronously in useEffect; the component returns null.
    expect(container.firstChild).toBeNull();
  });

  it("sets session key on dismiss", async () => {
    jest.useFakeTimers();
    render(<ConversionNudge isGuest onAction={jest.fn()} />);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    fireEvent.click(screen.getByTestId("conversion-nudge-dismiss"));
    expect(sessionStorage.getItem("cr_nudge_dismissed")).toBe("1");
    jest.useRealTimers();
  });
});
