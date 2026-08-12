import { logout } from "@/components/actions/logout-action";
import { authJwtLogout } from "@/app/clientService";
import { cookies } from "next/headers";
import type { Mock } from "vitest";
import { redirect } from "@/i18n/redirect";

vi.mock("../../app/clientService", () => ({
  authJwtLogout: vi.fn(),
}));

vi.mock("next/headers", () => {
  const mockGet = vi.fn();
  const mockDelete = vi.fn();
  return {
    cookies: vi.fn().mockResolvedValue({ get: mockGet, delete: mockDelete }),
  };
});

vi.mock("../../i18n/redirect", () => ({
  redirect: vi.fn(),
}));

describe("logout action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls logout API, deletes cookie, and redirects to login", async () => {
    const mockCookieStore = await cookies();
    (mockCookieStore.get as Mock).mockReturnValue({
      value: "test-token",
    });

    (authJwtLogout as Mock).mockResolvedValue({});

    await logout();

    expect(authJwtLogout).toHaveBeenCalledWith({
      headers: { Authorization: "Bearer test-token" },
    });
    expect(mockCookieStore.delete).toHaveBeenCalledWith("accessToken");
    expect(redirect).toHaveBeenCalledWith("/auth/login");
  });

  it("returns error when no access token", async () => {
    const mockCookieStore = await cookies();
    (mockCookieStore.get as Mock).mockReturnValue(undefined);

    const result = await logout();

    expect(authJwtLogout).not.toHaveBeenCalled();
    expect(result).toEqual({ message: "No access token found" });
  });

  it("returns error message on API failure", async () => {
    const mockCookieStore = await cookies();
    (mockCookieStore.get as Mock).mockReturnValue({
      value: "test-token",
    });

    const mockError = "UNAUTHORIZED";
    (authJwtLogout as Mock).mockResolvedValue({ error: mockError });

    const result = await logout();

    expect(result).toEqual({ message: "UNAUTHORIZED" });
    expect(mockCookieStore.delete).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });
});
