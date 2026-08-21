import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/portfolio/components/ui/Button";
import Alert from "@/admin/components/ui/Alert";
import Card from "@/admin/components/ui/Card";
import Input from "@/admin/components/ui/Input";
import { useChangePassword } from "@/admin/hooks/useAuthApi";
import ApiError, { toErrorMessage } from "@/admin/api/ApiError";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/admin/validation/authSchemas";

export default function ChangePasswordPage() {
  const [formError, setFormError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);
  const changePasswordMutation = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  async function onSubmit(values: ChangePasswordFormValues) {
    setFormError(null);
    setSucceeded(false);
    try {
      // Answers 204 with no body — nothing to read back.
      await changePasswordMutation.mutateAsync(values);
      reset();
      setSucceeded(true);
    } catch (error) {
      if (error instanceof ApiError && error.code === "invalid_credentials") {
        setError("currentPassword", { type: "server", message: error.message });
        return;
      }
      setFormError(toErrorMessage(error));
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-text-primary mb-1">
        Change password
      </h1>
      <p className="text-sm text-text-muted mb-8">
        Your new password must be at least 8 characters.
      </p>

      <Card>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          {formError && <Alert>{formError}</Alert>}
          {succeeded && (
            <Alert variant="success">
              Your password has been updated. Your current session stays signed
              in — use the new password next time you sign in.
            </Alert>
          )}

          <Input
            label="Current password"
            type="password"
            autoComplete="current-password"
            required
            error={errors.currentPassword?.message}
            {...register("currentPassword")}
          />

          <Input
            label="New password"
            type="password"
            autoComplete="new-password"
            required
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />

          <Input
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            required
            error={errors.confirmNewPassword?.message}
            {...register("confirmNewPassword")}
          />

          <Button type="submit" loading={isSubmitting}>
            {isSubmitting ? "Updating…" : "Update password"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
