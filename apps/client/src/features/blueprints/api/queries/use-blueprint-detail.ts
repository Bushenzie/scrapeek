import type { Blueprint } from "@scrapeek/shared/blueprint";
import { useSuspenseQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/clients/axios";

// import { client } from "@/lib/api/hc";

type GetBlueprintDetailProps = {
  blueprintId: string;
};

export const useBlueprintDetail = ({
  blueprintId,
}: GetBlueprintDetailProps) => {
  return useSuspenseQuery<Blueprint>({
    queryKey: ["blueprint", blueprintId],
    queryFn: async () => {
      try {
        const response = await axiosClient<{ data: Blueprint }>({
          method: "get",
          url: `/blueprints/${blueprintId}`,
        });
        const blueprint = await response.data.data;
        // const response = await client.api.blueprints[":id"].$get({
        //   param: {
        //     id: blueprintId,
        //   },
        // });
        // const data = await response.json();
        // const blueprint = await data.data;
        return blueprint;
      } catch {
        throw new Error("Failed to fetch blueprint");
      }
    },
  });
};
