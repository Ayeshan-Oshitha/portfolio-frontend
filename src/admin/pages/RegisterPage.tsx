import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import GoogleSignInButton from "@/admin/components/GoogleSignInButton";
import useAuth from "@/admin/context/useAuth";
import ApiError, { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/admin/validation/authSchemas";
import { Button, Input } from "@/admin/components/ui";

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const toast = useToast();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    try {
      await registerUser(values);
      setSubmittedEmail(values.email);
    } catch (error) {
      // A duplicate email belongs on the field, not in the banner.
      if (error instanceof ApiError && error.code === "email_taken") {
        setError("email", { type: "server", message: error.message });
        return;
      }
      toast.error(toErrorMessage(error));
    }
  }

  if (submittedEmail) {
    return (
      <>
        <h2 className="admin-display text-xl leading-snug text-text-primary mb-1">
          Check your email
        </h2>
        <p className="text-sm text-text-secondary">
          We sent a verification link to <strong>{submittedEmail}</strong>. Once
          you confirm it, a super admin still has to approve your account before
          you can sign in.
        </p>

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

  return (
    <>
      <h2 className="admin-display text-xl leading-snug text-text-primary mb-1">
        Create an account
      </h2>
      <p className="text-sm text-text-secondary mb-6">
        Verify your email, then a super admin has to approve your account before
        you can sign in.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First name"
            autoComplete="given-name"
            placeholder="Ada"
            required
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <Input
            label="Last name"
            autoComplete="family-name"
            placeholder="Lovelace"
            required
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>

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
          autoComplete="new-password"
          placeholder="At least 8 characters"
          required
          error={errors.password?.message}
          {...register("password")}
        />

        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          required
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button type="submit" loading={isSubmitting} fullWidth>
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <GoogleSignInButton onError={toast.error} />

      <p className="mt-6 text-center text-sm text-text-muted">
        Already have an account?{" "}
        <Link
          to="/admin/login"
          className="font-semibold text-primary-600 underline-offset-4 hover:text-primary-700 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
