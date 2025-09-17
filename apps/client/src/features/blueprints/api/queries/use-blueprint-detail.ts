import type { Blueprint } from "@scrapeek/shared/blueprint";
import { useSuspenseQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/api/axios";

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
        const blueprints = await response.data.data;
        return blueprints;
      } catch {
        throw new Error("Failed to fetch blueprint");
      }
    },
  });
};
