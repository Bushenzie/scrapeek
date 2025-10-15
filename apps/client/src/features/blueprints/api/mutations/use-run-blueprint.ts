import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/toasts/toast";
import { axiosClient } from "@/lib/clients/axios";

type RunBlueprintProps = {
  blueprintId: string;
};

export const useRunBlueprint = ({ blueprintId }: RunBlueprintProps) => {
  return useMutation({
    mutationKey: ["blueprint", "run", blueprintId],
    mutationFn: async (mode?: "normal" | "test") => {
      try {
        const response = await axiosClient<[any[]]>({
          method: "post",
          url: `/runners`,
          data: {
            blueprintId,
            mode,
          },
        });
        const runnerResults = await response.data;
        return runnerResults;
      } catch {
        throw new Error("Failed to fetch blueprint");
      }
    },
    onMutate: (mode) => {
      toast({
        title: `Running blueprint (${mode})`,
      });
    },
    onSuccess: (_, mode) => {
      toast({
        title: `Blueprint run (${mode}) success`,
        description:
          mode === "test"
            ? "You will see more than 2 result items, if the pagination is working correctly"
            : undefined,
      });
    },
  });
};
