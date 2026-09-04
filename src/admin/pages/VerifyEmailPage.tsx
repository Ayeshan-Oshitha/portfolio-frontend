import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ApiError, { toErrorMessage } from "@/admin/api/ApiError";
import {
  useResendVerification,
  useVerifyEmail,
} from "@/admin/hooks/useAuthApi";
import { Alert, Button } from "@/admin/components/ui";

type VerifyState = "verifying" | "success" | "error";

const EXPIRED_OR_INVALID_CODES = new Set([
  "invalid_verification_token",
  "verification_token_expired",
]);

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const verifyEmail = useVerifyEmail();
  const resendVerification = useResendVerification();
  const [state, setState] = useState<VerifyState>(
    token ? "verifying" : "error",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(
    token ? null : "This verification link is missing its token.",
  );
  const [canResend, setCanResend] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current || !token) return;
    attempted.current = true;

    verifyEmail
      .mutateAsync({ token })
      .then(() => setState("success"))
      .catch((error: unknown) => {
        setState("error");
        setCanResend(
          error instanceof ApiError &&
            EXPIRED_OR_INVALID_CODES.has(error.code ?? ""),
        );
        setErrorMessage(toErrorMessage(error));
      });
    // Runs once on mount against the token in the URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleResend() {
    const email = window.prompt("Enter the email you registered with:");
    if (!email) return;
    try {
      await resendVerification.mutateAsync({ email });
      setResendSent(true);
    } catch {
      setResendSent(true); // The endpoint always answers the same generic success.
    }
  }

  return (
    <>
      <h2 className="admin-display text-xl leading-snug text-text-primary mb-1">
        Email verification
      </h2>

      {state === "verifying" && (
        <p className="text-sm text-text-secondary">Verifying your email…</p>
      )}

      {state === "success" && (
        <>
          <Alert variant="success">Your email has been verified.</Alert>
          <p className="mt-4 text-sm text-text-muted">
            A super admin still has to approve your account before you can sign
            in.
          </p>
        </>
      )}

      {state === "error" && (
        <>
          <Alert>{errorMessage}</Alert>
          {canResend && !resendSent && (
            <Button
              type="button"
              variant="secondary"
              fullWidth
              className="mt-4"
              loading={resendVerification.isPending}
              onClick={handleResend}
            >
              Resend verification email
            </Button>
          )}
          {resendSent && (
            <p className="mt-4 text-sm text-text-muted">
              If that account needs verification, we've sent a new email.
            </p>
          )}
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
