import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Alert from "@/admin/components/ui/Alert";
import Button from "@/admin/components/ui/Button";
import Card from "@/admin/components/ui/Card";
import ApiError, { toErrorMessage } from "@/admin/api/ApiError";
import { useResendVerification, useVerifyEmail } from "@/admin/hooks/useAuthApi";

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
          error instanceof ApiError && EXPIRED_OR_INVALID_CODES.has(error.code ?? ""),
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
    <Card>
      <h2 className="text-lg font-semibold text-text-primary mb-1">
        Email verification
      </h2>

      {state === "verifying" && (
        <p className="text-sm text-text-muted">Verifying your email…</p>
      )}

      {state === "success" && (
        <>
          <Alert variant="success">Your email has been verified.</Alert>
          <p className="mt-4 text-sm text-text-muted">
            A super admin still has to approve your account before you can
            sign in.
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
              className="w-full mt-4"
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
          className="text-primary-400 hover:text-primary-300 font-medium"
        >
          Back to sign in
        </Link>
      </p>
    </Card>
  );
}
