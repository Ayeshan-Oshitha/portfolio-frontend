import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as usersService from "@/admin/services/usersService";
import type { GetUsersParams } from "@/admin/services/usersService";
import { userKeys } from "@/admin/hooks/queryKeys";

export function useUsers(params: GetUsersParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: ({ signal }) => usersService.getUsers(params, signal),
    placeholderData: (previous) => previous,
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
