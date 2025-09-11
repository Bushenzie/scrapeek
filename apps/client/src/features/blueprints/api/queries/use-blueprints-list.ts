import type { Blueprint } from "@scrapeek/shared/blueprint";
import { useSuspenseQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/api/axios";

export const useBlueprintsList = () => {
  return useSuspenseQuery<Blueprint[]>({
    queryKey: ["all-blueprints"],
    queryFn: async () => {
      try {
        const response = await axiosClient.get<{ data: Blueprint[] }>(
          "/blueprints"
        );
        const blueprints = await response.data.data;
        return blueprints;
      } catch {
        throw new Error("Failed to fetch blueprints");
      }
    },
  });
};
