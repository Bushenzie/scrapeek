import type { Blueprint } from "@scrapeek/shared/blueprint";
import { useSuspenseQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/clients/axios";
// import { client } from "@/lib/api/hc";

export const useBlueprintsList = () => {
  return useSuspenseQuery<Blueprint[]>({
    queryKey: ["all-blueprints"],
    queryFn: async () => {
      try {
        const response = await axiosClient.get<{ data: Blueprint[] }>(
          "/blueprints"
        );
        const blueprints = await response.data.data;
        // const response = await client.api.blueprints.$get();
        // const data = await response.json();
        // const blueprints = await data.data;
        return blueprints;
        // return [] as Blueprint[];
      } catch {
        throw new Error("Failed to fetch blueprints");
      }
    },
  });
};
