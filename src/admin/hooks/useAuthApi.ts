import { useMutation, useQuery } from "@tanstack/react-query";
import * as authService from "@/admin/services/authService";
import { authKeys } from "@/admin/hooks/queryKeys";

/** Disabled by default — `AuthProvider` drives this manually during bootstrap. */
export function useMe(enabled: boolean) {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: ({ signal }) => authService.getMe(signal),
    enabled,
    retry: false,
  });
}

export function useLogin() {
  return useMutation({ mutationFn: authService.login });
}

export function useGoogleSignIn() {
  return useMutation({ mutationFn: authService.googleSignIn });
}

export function useRegister() {
  return useMutation({ mutationFn: authService.register });
}

export function useVerifyEmail() {
  return useMutation({ mutationFn: authService.verifyEmail });
}

export function useResendVerification() {
  return useMutation({ mutationFn: authService.resendVerification });
}

export function useChangePassword() {
  return useMutation({ mutationFn: authService.changePassword });
}
