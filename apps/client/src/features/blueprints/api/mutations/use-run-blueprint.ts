import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "@/lib/api/axios";

type RunBlueprintProps = {
  blueprintIds: string[];
};

export const useRunBlueprint = ({ blueprintIds }: RunBlueprintProps) => {
  return useMutation({
    mutationKey: ["blueprint", "run", blueprintIds],
    mutationFn: async (mode?: "normal" | "test") => {
      try {
        const response = await axiosClient<[any[]]>({
          method: "post",
          url: `/runners`,
          data: {
            blueprintIds,
            mode,
          },
        });
        const runnerResults = await response.data;
        return runnerResults;
      } catch {
        throw new Error("Failed to fetch blueprint");
      }
    },
  });
};
