"use server";

import { resetForgotPassword, resetResetPassword } from "@/app/clientService";
import { redirect } from "@/i18n/redirect";
import { passwordResetConfirmSchema } from "@/lib/definitions";
import { getErrorMessage } from "@/lib/utils";
import { t } from "@/i18n/keys";
import { createLogger } from "@/lib/logger";

const logger = createLogger("passwordResetAction");

export async function passwordReset(prevState: unknown, formData: FormData) {
  const input = {
    body: {
      email: formData.get("email") as string,
    },
  };

  try {
    const { error } = await resetForgotPassword(input);
    if (error) {
      return { server_validation_error: getErrorMessage(error) };
    }
    return { message: t("auth.password.reset.success") };
  } catch (err) {
    logger.error("Password reset error:", err);
    return {
      server_error: t("error.unexpected"),
    };
  }
}

export async function passwordResetConfirm(
  prevState: unknown,
  formData: FormData,
) {
  const validatedFields = passwordResetConfirmSchema.safeParse({
    token: formData.get("resetToken") as string,
    password: formData.get("password") as string,
    passwordConfirm: formData.get("passwordConfirm") as string,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { token, password } = validatedFields.data;
  const input = {
    body: {
      token,
      password,
    },
  };
  try {
    const { error } = await resetResetPassword(input);
    if (error) {
      return { server_validation_error: getErrorMessage(error) };
    }
    return await redirect("/auth/login");
  } catch (err) {
    logger.error("Password reset confirmation error:", err);
    return {
      server_error: t("error.unexpected"),
    };
  }
}
