/**
 * Tests for StreamStatusStack -- the three-tier latency stack.
 *
 * The regression under test: the hook sets isThinking and
 * isWaitingForResponse TOGETHER, so any tier gated on
 * `isWaitingForResponse && !isThinking` could never render. The slow and
 * very-slow hints must be reachable alongside the thinking pill.
 */

import { render, screen } from "@testing-library/react";
import { StreamStatusStack } from "@/components/shared/chat/stream-status-stack";

const baseProps = {
  isThinking: false,
  isWaitingForResponse: false,
  isSlowResponse: false,
  isVerySlowResponse: false,
  hasStreamingText: false,
};

describe("StreamStatusStack", () => {
  it("renders nothing prominent when idle", () => {
    render(<StreamStatusStack {...baseProps} />);
    expect(screen.queryByTestId("slow-response-hint")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("stream-status-waiting"),
    ).not.toBeInTheDocument();
  });

  it("shows the slow hint ALONGSIDE the thinking pill (both flags set)", () => {
    // This is the real production state: the hook raises isThinking and
    // isWaitingForResponse together, then the 8s timer raises isSlowResponse.
    render(
      <StreamStatusStack
        {...baseProps}
        isThinking={true}
        isWaitingForResponse={true}
        isSlowResponse={true}
      />,
    );
    expect(screen.getByTestId("slow-response-hint")).toBeInTheDocument();
  });

  it("escalates the hint copy when isVerySlowResponse is set", () => {
    const { rerender } = render(
      <StreamStatusStack
        {...baseProps}
        isThinking={true}
        isWaitingForResponse={true}
        isSlowResponse={true}
      />,
    );
    const slowText = screen.getByTestId("slow-response-hint").textContent;

    rerender(
      <StreamStatusStack
        {...baseProps}
        isThinking={true}
        isWaitingForResponse={true}
        isSlowResponse={true}
        isVerySlowResponse={true}
      />,
    );
    const verySlowText = screen.getByTestId("slow-response-hint").textContent;

    // The very-slow tier changes the hint body (no literal copy asserted).
    expect(verySlowText).not.toEqual(slowText);
  });

  it("hides the slow hint once streaming text arrives", () => {
    render(
      <StreamStatusStack
        {...baseProps}
        isThinking={true}
        isWaitingForResponse={true}
        isSlowResponse={true}
        hasStreamingText={true}
      />,
    );
    expect(screen.queryByTestId("slow-response-hint")).not.toBeInTheDocument();
  });

  it("shows the waiting indicator when waiting but not thinking", () => {
    render(
      <StreamStatusStack
        {...baseProps}
        isWaitingForResponse={true}
        isThinking={false}
      />,
    );
    expect(screen.getByTestId("stream-status-waiting")).toBeInTheDocument();
  });
});
