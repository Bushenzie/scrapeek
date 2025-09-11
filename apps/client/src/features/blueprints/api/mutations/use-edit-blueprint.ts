import type { Blueprint, EditableBlueprint } from "@scrapeek/shared/blueprint";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/api/axios";

export const useEditBlueprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["edit-blueprint"],
    mutationFn: async (blueprint: EditableBlueprint) => {
      try {
        const response = await axiosClient<Blueprint>({
          method: "patch",
          url: "/blueprints",
          data: blueprint,
        });
        const data = await response.data;
        return data;
      } catch {
        throw new Error("Something went wrong during edit of blueprint");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-blueprints"] });
    },
  });
};
