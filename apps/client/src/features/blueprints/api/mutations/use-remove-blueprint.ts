import type { Blueprint } from "@scrapeek/shared/blueprint";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { axiosClient } from "@/lib/api/axios";

export const useRemoveBlueprint = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: ["remove-blueprint"],
    mutationFn: async (blueprintId: string) => {
      try {
        const response = await axiosClient<Blueprint>({
          method: "delete",
          url: `/blueprints/${blueprintId}`,
        });
        const data = await response.data;
        return data;
      } catch {
        throw new Error("Something went wrong during removal of blueprint");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-blueprints"] });
      router.navigate({ to: "/blueprints" });
    },
  });
};
