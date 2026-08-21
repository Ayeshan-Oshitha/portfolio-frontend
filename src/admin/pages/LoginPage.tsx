import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "@/portfolio/components/ui/Button";
import Alert from "@/admin/components/ui/Alert";
import Card from "@/admin/components/ui/Card";
import Input from "@/admin/components/ui/Input";
import GoogleSignInButton from "@/admin/components/GoogleSignInButton";
import useAuth from "@/admin/context/useAuth";
import { toErrorMessage } from "@/admin/api/ApiError";
import ApiError from "@/admin/api/ApiError";
import {
  loginSchema,
  type LoginFormValues,
} from "@/admin/validation/authSchemas";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState<string | null>(null);

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
    try {
      await login(values);
      navigate(from, { replace: true });
    } catch (error) {
      // The API's `detail` is already user-facing for invalid_credentials
      // and account_disabled, so surface it as-is.
      setFormError(
        error instanceof ApiError ? error.message : toErrorMessage(error),
      );
    }
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold text-text-primary mb-1">Sign in</h2>
      <p className="text-sm text-text-muted mb-6">
        Use your admin credentials to continue.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {formError && <Alert>{formError}</Alert>}

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          error={errors.password?.message}
          {...register("password")}
        />

        <Button type="submit" loading={isSubmitting} className="w-full">
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <GoogleSignInButton onError={setFormError} />

      <p className="mt-6 text-center text-sm text-text-muted">
        Need an account?{" "}
        <Link
          to="/admin/register"
          className="text-primary-400 hover:text-primary-300 font-medium"
        >
          Register
        </Link>
      </p>
    </Card>
  );
}
