import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useForgotPassword } from "@/admin/hooks/useAuthApi";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/admin/validation/authSchemas";
import { Button, Input } from "@/admin/components/ui";

const CONFIRMATION_MESSAGE =
  "If that account exists, we've sent a password reset email.";

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    try {
      await forgotPassword.mutateAsync(values);
    } finally {
      // The endpoint always answers the same generic message, whatever the
      // email resolves to — never branch the UI on the outcome.
      setSent(true);
    }
  }

  return (
    <>
      <h2 className="admin-display text-xl leading-snug text-text-primary mb-1">
        Forgot password
      </h2>

      {!sent && (
        <>
          <p className="text-sm text-text-secondary mb-6">
            Enter your email and we'll send you a link to set a new password.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              error={errors.email?.message}
              {...register("email")}
            />

            <Button type="submit" loading={isSubmitting} fullWidth>
              {isSubmitting ? "Sending…" : "Send reset link"}
            </Button>
          </form>
        </>
      )}

      {sent && (
        <p className="text-sm text-text-secondary">{CONFIRMATION_MESSAGE}</p>
      )}

      <p className="mt-6 text-center text-sm text-text-muted">
        <Link
          to="/admin/login"
          className="font-semibold text-primary-600 underline-offset-4 hover:text-primary-700 hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </>
  );
}
