import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as usersService from "@/admin/services/usersService";
import type { GetUsersParams } from "@/admin/services/usersService";
import { userKeys } from "@/admin/hooks/queryKeys";
import type { RejectUserRequest } from "@/admin/types";

/**
 * `enabled` defaults to `true`; pass `false` for a caller that isn't sure yet
 * whether the current user is a super admin — this list is super-admin-only
 * server-side, so a regular admin must never fire the request at all.
 */
export function useUsers(params: GetUsersParams, enabled = true) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: ({ signal }) => usersService.getUsers(params, signal),
    placeholderData: (previous) => previous,
    enabled,
  });
}

export function useApproveUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersService.approveUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useRejectUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: RejectUserRequest }) =>
      usersService.rejectUser(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useDisableUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersService.disableUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
