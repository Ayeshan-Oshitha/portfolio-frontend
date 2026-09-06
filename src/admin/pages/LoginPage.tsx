import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GoogleSignInButton from "@/admin/components/GoogleSignInButton";
import useAuth from "@/admin/context/useAuth";
import { toErrorMessage } from "@/admin/api/ApiError";
import ApiError from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import { useResendVerification } from "@/admin/hooks/useAuthApi";
import {
  loginSchema,
  type LoginFormValues,
} from "@/admin/validation/authSchemas";
import { Alert, Button, Input, PasswordInput } from "@/admin/components/ui";

const CURATED_AUTH_ERROR_CODES = new Set([
  "invalid_credentials",
  "account_disabled",
  "email_verification_required",
  "account_pending",
  "account_rejected",
]);

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const resendVerification = useResendVerification();
  const [formError, setFormError] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [resendSent, setResendSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? "/admin";

  async function onSubmit(values: LoginFormValues) {
    setFormError(null);
    setUnverifiedEmail(null);
    setResendSent(false);
    try {
      await login(values);
      navigate(from, { replace: true });
    } catch (error) {
      // The API's `detail` is already user-facing for these codes.
      const isCuratedAuthError =
        error instanceof ApiError &&
        CURATED_AUTH_ERROR_CODES.has(error.code ?? "");
      if (isCuratedAuthError) {
        setFormError((error as ApiError).message);
        if ((error as ApiError).code === "email_verification_required") {
          setUnverifiedEmail(values.email);
        }
        return;
      }
      toast.error(toErrorMessage(error));
    }
  }

  async function handleResend() {
    if (!unverifiedEmail) return;
    try {
      await resendVerification.mutateAsync({ email: unverifiedEmail });
    } finally {
      setResendSent(true); // The endpoint always answers the same generic success.
    }
  }

  return (
    <>
      <h2 className="admin-display text-xl leading-snug text-text-primary mb-1">
        Sign in
      </h2>
      <p className="text-sm text-text-secondary mb-6">
        Use your admin credentials to continue.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {formError && <Alert>{formError}</Alert>}

        {unverifiedEmail && !resendSent && (
          <Button
            type="button"
            variant="secondary"
            fullWidth
            loading={resendVerification.isPending}
            onClick={handleResend}
          >
            Resend verification email
          </Button>
        )}
        {resendSent && (
          <p className="text-sm text-text-secondary">
            If that account needs verification, we've sent a new email.
          </p>
        )}

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          error={errors.email?.message}
          {...register("email")}
        />

        <PasswordInput
          label="Password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          error={errors.password?.message}
          {...register("password")}
        />

        <p className="text-right text-sm">
          <Link
            to="/admin/forgot-password"
            className="font-semibold text-primary-600 underline-offset-4 hover:text-primary-700 hover:underline"
          >
            Forgot password?
          </Link>
        </p>

        <Button type="submit" loading={isSubmitting} fullWidth>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <GoogleSignInButton onError={toast.error} />

      <p className="mt-6 text-center text-sm text-text-muted">
        Need an account?{" "}
        <Link
          to="/admin/register"
          className="font-semibold text-primary-600 underline-offset-4 hover:text-primary-700 hover:underline"
        >
          Register
        </Link>
      </p>
    </>
  );
}
