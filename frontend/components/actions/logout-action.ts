"use server";

import { cookies } from "next/headers";
import { authJwtLogout } from "@/app/clientService";
import { redirect } from "@/i18n/redirect";

export async function logout() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return { message: "No access token found" };
  }

  const { error } = await authJwtLogout({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (error) {
    return { message: error };
  }

  cookieStore.delete("accessToken");
  return await redirect("/auth/login");
}
