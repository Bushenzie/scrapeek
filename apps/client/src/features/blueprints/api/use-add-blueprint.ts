import type { Blueprint, EditableBlueprint } from "@scrapeek/shared/blueprint";
import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "@/lib/api/axios";

export const useAddBlueprint = () => {
  return useMutation({
    mutationKey: ["add-blueprint"],
    mutationFn: async (blueprint: EditableBlueprint) => {
      try {
        const response = await axiosClient<Blueprint>({
          method: "post",
          url: "/blueprints",
          data: blueprint,
        });
        const data = await response.data;
        return data;
      } catch {
        throw new Error("Something went wrong during addition of blueprint");
      }
    },
  });
};
