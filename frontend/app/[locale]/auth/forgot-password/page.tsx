"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { passwordReset } from "@/components/actions/password-reset-action";
import { useActionState } from "react";
import { SubmitButton } from "@/components/ui/submitButton";
import { Link } from "@/i18n/navigation";
import { FormError } from "@/components/ui/FormError";
import { t } from "@/i18n/keys";

export default function Page() {
  const [state, dispatch] = useActionState(passwordReset, undefined);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted px-4">
      <form action={dispatch}>
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">
              {t("auth.password.recovery.title")}
            </CardTitle>
            <CardDescription>
              {t("auth.password.recovery.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 p-6">
            <div className="grid gap-3">
              <Label htmlFor="email">{t("form.email")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t("form.placeholder.email")}
                required
              />
            </div>
            <SubmitButton text={t("auth.password.recovery.submit")} />
            <FormError state={state} />
            <div className="mt-2 text-sm text-center text-muted-foreground">
              {state?.message && <p>{state.message}</p>}
            </div>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              <Link
                href="/auth/login"
                className="underline underline-offset-4 hover:text-foreground"
              >
                {t("auth.password.recovery.back")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
