import { useSuspenseQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/clients/axios";

export const useApiKey = () => {
  return useSuspenseQuery({
    queryKey: ["api-key"],
    queryFn: async () => {
      try {
        const response = await axiosClient<{ key: string }>({
          method: "get",
          url: "/api-keys",
        });

        const apiKey = await response.data.key;

        return apiKey;
      } catch {
        throw new Error("Failed to fetch api key");
      }
    },
  });
};
