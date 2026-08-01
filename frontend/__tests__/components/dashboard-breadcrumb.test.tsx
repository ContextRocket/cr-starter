import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom";

import { DashboardBreadcrumb } from "@/components/dashboard/dashboard-breadcrumb";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

const mockPageTitle = jest.fn();
const mockExtraSegments = jest.fn();
jest.mock("../../components/dashboard/breadcrumb-context", () => ({
  usePageTitle: () => ({
    pageTitle: mockPageTitle(),
    setPageTitle: jest.fn(),
    extraSegments: mockExtraSegments(),
    setExtraSegments: jest.fn(),
  }),
}));

describe("DashboardBreadcrumb", () => {
  beforeEach(() => {
    mockPageTitle.mockReturnValue(undefined);
    mockExtraSegments.mockReturnValue([]);
  });

  it("renders only Dashboard on /dashboard", () => {
    mockPathname.mockReturnValue("/dashboard");
    render(<DashboardBreadcrumb />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("makes Dashboard a link back to /dashboard when on sub-page", () => {
    mockPathname.mockReturnValue("/dashboard/settings");
    mockPageTitle.mockReturnValue("Settings");
    render(<DashboardBreadcrumb />);

    const dashboardLink = screen.getByText("Dashboard").closest("a");
    expect(dashboardLink).toHaveAttribute("href", "/dashboard");
  });

  it("renders page title from context on sub-pages", () => {
    mockPathname.mockReturnValue("/dashboard/settings");
    mockPageTitle.mockReturnValue("Settings");
    render(<DashboardBreadcrumb />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders extra segments from context", () => {
    mockPathname.mockReturnValue("/dashboard/something");
    mockPageTitle.mockReturnValue("Something");
    mockExtraSegments.mockReturnValue([{ label: "Detail" }]);
    render(<DashboardBreadcrumb />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Something")).toBeInTheDocument();
    expect(screen.getByText("Detail")).toBeInTheDocument();
  });

  it("renders the last breadcrumb item as non-link (current page)", () => {
    mockPathname.mockReturnValue("/dashboard");
    render(<DashboardBreadcrumb />);

    const dashboardEl = screen.getByText("Dashboard");
    expect(dashboardEl).toHaveAttribute("aria-current", "page");
  });
});
