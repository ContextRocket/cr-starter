import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom/vitest";

import { DashboardBreadcrumb } from "@/components/dashboard/dashboard-breadcrumb";
import { mockPathname } from "../__mocks__/navigation";

// vi.mock factories are hoisted above the module body, so the mocks used by
// the factory live in vi.hoisted().
const { mockPageTitle, mockExtraSegments } = vi.hoisted(() => ({
  mockPageTitle: vi.fn(),
  mockExtraSegments: vi.fn(),
}));
vi.mock("../../components/dashboard/breadcrumb-context", () => ({
  usePageTitle: () => ({
    pageTitle: mockPageTitle(),
    setPageTitle: vi.fn(),
    extraSegments: mockExtraSegments(),
    setExtraSegments: vi.fn(),
  }),
}));

describe("DashboardBreadcrumb", () => {
  beforeEach(() => {
    mockPageTitle.mockReturnValue(undefined);
    mockExtraSegments.mockReturnValue([]);
  });

  it("renders only Dashboard on /dashboard", () => {
    mockPathname.value = "/dashboard";
    render(<DashboardBreadcrumb />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("makes Dashboard a link back to /dashboard when on sub-page", () => {
    mockPathname.value = "/dashboard/settings";
    mockPageTitle.mockReturnValue("Settings");
    render(<DashboardBreadcrumb />);

    const dashboardLink = screen.getByText("Dashboard").closest("a");
    expect(dashboardLink).toHaveAttribute("href", "/dashboard");
  });

  it("renders page title from context on sub-pages", () => {
    mockPathname.value = "/dashboard/settings";
    mockPageTitle.mockReturnValue("Settings");
    render(<DashboardBreadcrumb />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders extra segments from context", () => {
    mockPathname.value = "/dashboard/something";
    mockPageTitle.mockReturnValue("Something");
    mockExtraSegments.mockReturnValue([{ label: "Detail" }]);
    render(<DashboardBreadcrumb />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Something")).toBeInTheDocument();
    expect(screen.getByText("Detail")).toBeInTheDocument();
  });

  it("renders the last breadcrumb item as non-link (current page)", () => {
    mockPathname.value = "/dashboard";
    render(<DashboardBreadcrumb />);

    const dashboardEl = screen.getByText("Dashboard");
    expect(dashboardEl).toHaveAttribute("aria-current", "page");
  });
});
