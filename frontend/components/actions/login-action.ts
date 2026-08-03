"use server";

import { cookies } from "next/headers";

import { authJwtLogin } from "@/app/clientService";
import { redirect } from "@/i18n/redirect";
import { loginSchema } from "@/lib/definitions";
import { getErrorMessage } from "@/lib/utils";
import { t } from "@/i18n/keys";
import { createLogger } from "@/lib/logger";

const logger = createLogger("loginAction");

export async function login(prevState: unknown, formData: FormData) {
  const validatedFields = loginSchema.safeParse({
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, password } = validatedFields.data;

  const input = {
    body: {
      username,
      password,
    },
  };

  try {
    const { data, error } = await authJwtLogin(input);

    if (error) {
      return { server_validation_error: getErrorMessage(error) };
    }
    // Auth cookie hardening: httpOnly (no client-side JS reads -- all
    // consumers are server components/actions), secure in production,
    // sameSite lax for top-level navigation flows.
    (await cookies()).set("accessToken", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  } catch (err) {
    logger.error("[LOGIN] Error:", err);
    return {
      server_error: t("ERROR_UNEXPECTED"),
    };
  }
  return await redirect("/dashboard");
}
