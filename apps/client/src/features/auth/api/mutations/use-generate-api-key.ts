import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/clients/axios";

export const useGenerateAPIKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["generate-api-key"],
    mutationFn: async () => {
      try {
        const response = await axiosClient<{ key: string }>({
          method: "post",
          url: `/api-keys`,
        });
        const apiKey = await response.data.key;
        return apiKey;
      } catch {
        throw new Error("Something went wrong during generating API key");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-key"] });
    },
  });
};
