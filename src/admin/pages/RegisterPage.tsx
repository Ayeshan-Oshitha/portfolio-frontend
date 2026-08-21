import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/admin/components/ui/Button";
import Card from "@/admin/components/ui/Card";
import Input from "@/admin/components/ui/Input";
import GoogleSignInButton from "@/admin/components/GoogleSignInButton";
import useAuth from "@/admin/context/useAuth";
import ApiError, { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/admin/validation/authSchemas";

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

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
      navigate("/admin", { replace: true });
    } catch (error) {
      // A duplicate email belongs on the field, not in the banner.
      if (error instanceof ApiError && error.code === "email_taken") {
        setError("email", { type: "server", message: error.message });
        return;
      }
      toast.error(toErrorMessage(error));
    }
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold text-text-primary mb-1">
        Create an account
      </h2>
      <p className="text-sm text-text-muted mb-6">
        A super admin has to approve your account before you can sign in.
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

        <Button type="submit" loading={isSubmitting} className="w-full">
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <GoogleSignInButton onError={toast.error} />

      <p className="mt-6 text-center text-sm text-text-muted">
        Already have an account?{" "}
        <Link
          to="/admin/login"
          className="text-primary-400 hover:text-primary-300 font-medium"
        >
          Sign in
        </Link>
      </p>
    </Card>
  );
}
