import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ApiError, { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import { useSetPassword } from "@/admin/hooks/useAuthApi";
import {
  setPasswordSchema,
  type SetPasswordFormValues,
} from "@/admin/validation/authSchemas";
import { Alert, Button, Input } from "@/admin/components/ui";

type PageState = "form" | "error";

const ERROR_MESSAGES: Record<string, string> = {
  invalid_setup_token: "This link is not valid. Request a new one.",
  setup_token_already_used:
    "This link has already been used. If you didn't do that, request a new one.",
  setup_token_expired: "This link has expired. Request a new one.",
};

export default function SetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const setPassword = useSetPassword();
  // Captured once: `searchParams` itself keeps returning the original value
  // even after the URL is cleared below, but closing over a stable local
  // avoids re-reading a mutated router object at submit time.
  const [initialToken] = useState(() => searchParams.get("token"));
  const [state, setState] = useState<PageState>(
    initialToken ? "form" : "error",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(
    initialToken ? null : "This link is missing its token.",
  );

  useEffect(() => {
    // Clear the token from the address bar as soon as it's read, so it
    // doesn't linger in browser history or get captured by analytics.
    if (searchParams.get("token")) {
      window.history.replaceState(null, "", window.location.pathname);
    }
    // Runs once on mount against the token in the initial URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SetPasswordFormValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: SetPasswordFormValues) {
    if (!initialToken) return;

    try {
      await setPassword.mutateAsync({ token: initialToken, ...values });
      toast.success("Password set. Please sign in.");
      navigate("/admin/login", { replace: true });
    } catch (error) {
      const code = error instanceof ApiError ? error.code : undefined;
      if (code && code in ERROR_MESSAGES) {
        setState("error");
        setErrorMessage(ERROR_MESSAGES[code]);
        return;
      }
      toast.error(toErrorMessage(error));
    }
  }

  return (
    <>
      <h2 className="admin-display text-xl leading-snug text-text-primary mb-1">
        Set a new password
      </h2>

      {state === "form" && (
        <>
          <p className="text-sm text-text-secondary mb-6">
            Choose a new password for your account.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >
            <Input
              label="New password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              required
              error={errors.password?.message}
              {...register("password")}
            />

            <Input
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              required
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            <Button type="submit" loading={isSubmitting} fullWidth>
              {isSubmitting ? "Setting password…" : "Set password"}
            </Button>
          </form>
        </>
      )}

      {state === "error" && (
        <>
          <Alert>{errorMessage}</Alert>
          <p className="mt-4 text-sm text-text-muted">
            <Link
              to="/admin/forgot-password"
              className="font-semibold text-primary-600 underline-offset-4 hover:text-primary-700 hover:underline"
            >
              Request a new link
            </Link>
          </p>
        </>
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
