import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as certificatesService from "@/admin/services/certificatesService";
import type { GetCertificatesParams } from "@/admin/services/certificatesService";
import { certificateKeys } from "@/admin/hooks/queryKeys";
import type {
  CertificateReorderRequest,
  CertificateWriteRequest,
} from "@/admin/types";

export function useCertificates(params: GetCertificatesParams) {
  return useQuery({
    queryKey: certificateKeys.list(params),
    queryFn: ({ signal }) => certificatesService.getCertificates(params, signal),
    placeholderData: (previous) => previous,
  });
}

export function useCreateCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CertificateWriteRequest) =>
      certificatesService.createCertificate(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: certificateKeys.lists() });
    },
  });
}

export function useUpdateCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: CertificateWriteRequest }) =>
      certificatesService.updateCertificate(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: certificateKeys.lists() });
    },
  });
}

export function useDeleteCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => certificatesService.deleteCertificate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: certificateKeys.lists() });
    },
  });
}

/**
 * No `invalidateQueries` here — the caller writes the reordered rows straight
 * into the cache as an optimistic update, and a successful reorder leaves
 * that cache exactly matching the server, so there's nothing left to refetch.
 */
export function useReorderCertificates() {
  return useMutation({
    mutationFn: (body: CertificateReorderRequest) =>
      certificatesService.reorderCertificates(body),
  });
}
