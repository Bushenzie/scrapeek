import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/clients/auth";

export const useDeleteAPIKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-api-key"],
    mutationFn: async (id: string) => {
      try {
        await authClient.apiKey.delete({
          keyId: id,
        });
      } catch {
        throw new Error("Something went wrong during generating API key");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-key-list"] });
    },
  });
};
