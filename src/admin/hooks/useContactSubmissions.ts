import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as contactSubmissionsService from "@/admin/services/contactSubmissionsService";
import type { GetContactSubmissionsParams } from "@/admin/services/contactSubmissionsService";
import { contactSubmissionKeys } from "@/admin/hooks/queryKeys";
import type { ContactSubmissionUpdateRequest } from "@/admin/types";

export function useContactSubmissions(params: GetContactSubmissionsParams) {
  return useQuery({
    queryKey: contactSubmissionKeys.list(params),
    queryFn: ({ signal }) =>
      contactSubmissionsService.getContactSubmissions(params, signal),
    placeholderData: (previous) => previous,
  });
}

export function useUpdateContactSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: ContactSubmissionUpdateRequest;
    }) => contactSubmissionsService.updateContactSubmission(id, body),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: contactSubmissionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: contactSubmissionKeys.detail(id),
      });
    },
  });
}

export function useDeleteContactSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      contactSubmissionsService.deleteContactSubmission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactSubmissionKeys.lists() });
    },
  });
}
