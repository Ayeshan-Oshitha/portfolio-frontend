import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangePassword } from "@/admin/hooks/useAuthApi";
import ApiError, { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/admin/validation/authSchemas";
import {
  Button,
  Input,
  PageHeader,
  PasswordInput,
} from "@/admin/components/ui";

export default function ChangePasswordPage() {
  const toast = useToast();
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
    try {
      // Answers 204 with no body — nothing to read back.
      await changePasswordMutation.mutateAsync(values);
      reset();
      toast.success("Password updated.");
    } catch (error) {
      if (error instanceof ApiError && error.code === "invalid_credentials") {
        setError("currentPassword", { type: "server", message: error.message });
        return;
      }
      toast.error(toErrorMessage(error));
    }
  }

  return (
    <div className="max-w-lg">
      <PageHeader
        title="Change password"
        description="Your new password must be at least 8 characters."
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <PasswordInput
          label="Current password"
          autoComplete="current-password"
          required
          error={errors.currentPassword?.message}
          {...register("currentPassword")}
        />

        <PasswordInput
          label="New password"
          autoComplete="new-password"
          required
          error={errors.newPassword?.message}
          {...register("newPassword")}
        />

        <PasswordInput
          label="Confirm new password"
          autoComplete="new-password"
          required
          error={errors.confirmNewPassword?.message}
          {...register("confirmNewPassword")}
        />

        <Button type="submit" loading={isSubmitting}>
          {isSubmitting ? "Updating…" : "Update password"}
        </Button>
      </form>
    </div>
  );
}
