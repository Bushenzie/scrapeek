import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/clients/axios";

export const useUpvoteBlueprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["upvote-blueprint"],
    mutationFn: async (blueprintId: string) => {
      try {
        await axiosClient({
          method: "put",
          url: `/blueprints/${blueprintId}/upvote`,
        });
      } catch {
        throw new Error("Something went wrong during upvoting of blueprint");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public-blueprints"] });
    },
  });
};
