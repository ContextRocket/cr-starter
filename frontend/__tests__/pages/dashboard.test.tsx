import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom/vitest";

import {
  DashboardHome,
  GuestPrompt,
} from "@/components/dashboard/dashboard-home";

/**
 * Tests for the dashboard home content components.
 *
 * We test the pure components (DashboardHome, GuestPrompt) rather than the
 * async server page itself, to avoid mocking next/headers and fetch.
 * The server page is a thin orchestration shell; the rendering contract is
 * fully expressed by the component props.
 */

describe("DashboardHome - regular user (non-operator)", () => {
  it("renders the chat card", () => {
    render(<DashboardHome isOperator={false} />);
    expect(screen.getByTestId("dashboard-card-chat")).toBeInTheDocument();
    expect(screen.getByText("Continue chatting")).toBeInTheDocument();
  });

  it("renders the profile card", () => {
    render(<DashboardHome isOperator={false} />);
    expect(screen.getByTestId("dashboard-card-profile")).toBeInTheDocument();
    expect(screen.getByText("Profile & settings")).toBeInTheDocument();
  });

  it("does NOT render the users card for non-operators", () => {
    render(<DashboardHome isOperator={false} />);
    expect(
      screen.queryByTestId("dashboard-card-users"),
    ).not.toBeInTheDocument();
  });

  it("renders conversation continuity copy", () => {
    render(<DashboardHome isOperator={false} />);
    expect(
      screen.getByText(/conversation history is saved/i),
    ).toBeInTheDocument();
  });
});

describe("DashboardHome - operator (is_superuser=true)", () => {
  it("renders all three cards", () => {
    render(<DashboardHome isOperator={true} />);
    expect(screen.getByTestId("dashboard-card-chat")).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-card-profile")).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-card-users")).toBeInTheDocument();
  });

  it("renders the users card title", () => {
    render(<DashboardHome isOperator={true} />);
    expect(screen.getByText("Users")).toBeInTheDocument();
  });

  it("users card links to /dashboard/users", () => {
    render(<DashboardHome isOperator={true} />);
    const link = screen.getByRole("link", { name: /view users/i });
    expect(link).toHaveAttribute("href", "/dashboard/users");
  });
});

describe("GuestPrompt", () => {
  it("renders the register call-to-action", () => {
    render(<GuestPrompt />);
    expect(screen.getByTestId("dashboard-guest-prompt")).toBeInTheDocument();
    expect(screen.getByText("Save your conversation")).toBeInTheDocument();
  });

  it("links to the register page", () => {
    render(<GuestPrompt />);
    const link = screen.getByRole("link", { name: /create account/i });
    expect(link).toHaveAttribute("href", "/auth/register");
  });

  it("explains conversation continuity to guests", () => {
    render(<GuestPrompt />);
    expect(
      screen.getByText(/current conversation will continue either way/i),
    ).toBeInTheDocument();
  });
});
