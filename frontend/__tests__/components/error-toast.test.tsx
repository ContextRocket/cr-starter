import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { toast } from "sonner";

import { ErrorToast } from "@/components/dashboard/error-toast";

vi.mock("sonner", () => ({
  toast: { error: vi.fn() },
}));

describe("ErrorToast", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls toast.error with the provided message on mount", () => {
    render(<ErrorToast message="Something failed" />);

    expect(toast.error).toHaveBeenCalledWith("Something failed");
  });

  it("renders nothing visible", () => {
    const { container } = render(<ErrorToast message="Error" />);

    expect(container.innerHTML).toBe("");
  });
});
