import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as usersService from "@/admin/services/usersService";
import type { GetUsersParams } from "@/admin/services/usersService";
import { userKeys } from "@/admin/hooks/queryKeys";
import type { RejectUserRequest } from "@/admin/types";

export function useUsers(params: GetUsersParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: ({ signal }) => usersService.getUsers(params, signal),
    placeholderData: (previous) => previous,
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
