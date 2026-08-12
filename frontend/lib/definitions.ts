import { z } from "zod";
import { t } from "@/i18n/keys";

const passwordSchema = z
  .string()
  .min(8, t("form.validation.password.min"))
  .refine((password) => /[A-Z]/.test(password), {
    message: t("form.validation.password.uppercase"),
  })
  .refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
    message: t("form.validation.password.special"),
  });

export const passwordResetConfirmSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: z.string(),
    token: z.string({ message: t("form.validation.token.required") }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: t("form.validation.passwords.match"),
    path: ["passwordConfirm"],
  });

export const registerSchema = z.object({
  password: passwordSchema,
  email: z.string().email({ message: t("form.validation.email.invalid") }),
});

export const loginSchema = z.object({
  password: z
    .string()
    .min(1, { message: t("form.validation.password.required") }),
  username: z
    .string()
    .min(1, { message: t("form.validation.username.required") }),
});
