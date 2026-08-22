import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitReview } from "@/client/services/reviewsService";

export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}
