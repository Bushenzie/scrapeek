import { useSuspenseQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/clients/auth";

export const useApiKeyList = () => {
  return useSuspenseQuery({
    queryKey: ["api-key-list"],
    queryFn: async () => {
      try {
        const { data: apiKeys } = await authClient.apiKey.list();

        return apiKeys;
      } catch {
        throw new Error("Failed to fetch api key");
      }
    },
  });
};
