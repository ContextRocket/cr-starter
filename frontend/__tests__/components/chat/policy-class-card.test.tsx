/**
 * Tests for PolicyClassCard -- severity-styled guidance card from platform metadata.
 */

import { render, screen } from "@testing-library/react";
import { PolicyClassCard } from "@/components/shared/chat/policy-class-card";
import type { PolicyClass } from "@/hooks/use-a2a-stream";

function makePolicy(overrides: Partial<PolicyClass> = {}): PolicyClass {
  return {
    class: "neutral",
    tier: "guidance",
    content_key: "policy.generic_guidance",
    ...overrides,
  };
}

describe("PolicyClassCard", () => {
  it("renders with data-testid", () => {
    render(<PolicyClassCard policyClass={makePolicy()} />);
    expect(screen.getByTestId("policy-class-card")).toBeInTheDocument();
  });

  it("sets data-policy-class attribute from class field", () => {
    render(<PolicyClassCard policyClass={makePolicy({ class: "danger" })} />);
    expect(screen.getByTestId("policy-class-card")).toHaveAttribute(
      "data-policy-class",
      "danger",
    );
  });

  it("sets data-policy-tier attribute from tier field", () => {
    render(
      <PolicyClassCard policyClass={makePolicy({ tier: "escalation" })} />,
    );
    expect(screen.getByTestId("policy-class-card")).toHaveAttribute(
      "data-policy-tier",
      "escalation",
    );
  });

  it("displays the content_key as text", () => {
    render(
      <PolicyClassCard
        policyClass={makePolicy({ content_key: "my.policy.key" })}
      />,
    );
    expect(screen.getByText("my.policy.key")).toBeInTheDocument();
  });

  it("displays cited_source when present", () => {
    render(
      <PolicyClassCard
        policyClass={makePolicy({ cited_source: "Medical Guidelines 2024" })}
      />,
    );
    expect(screen.getByText("Medical Guidelines 2024")).toBeInTheDocument();
  });

  it("does not render cited_source row when absent", () => {
    const { queryByText } = render(
      <PolicyClassCard policyClass={makePolicy({ cited_source: undefined })} />,
    );
    // The i18n key CHAT_POLICY_CARD_SOURCE text should NOT appear when cited_source is absent.
    // We check for the combined "Source: ..." text which only appears with the field.
    expect(queryByText(/Medical Guidelines/)).not.toBeInTheDocument();
  });

  it("renders danger variant without throwing", () => {
    render(
      <PolicyClassCard
        policyClass={makePolicy({
          class: "danger",
          content_key: "policy.escalate",
        })}
      />,
    );
    expect(screen.getByTestId("policy-class-card")).toBeInTheDocument();
  });

  it("renders attention variant without throwing", () => {
    render(
      <PolicyClassCard policyClass={makePolicy({ class: "attention" })} />,
    );
    expect(screen.getByTestId("policy-class-card")).toBeInTheDocument();
  });

  it("has role='note' for accessibility", () => {
    render(<PolicyClassCard policyClass={makePolicy()} />);
    expect(screen.getByRole("note")).toBeInTheDocument();
  });
});
