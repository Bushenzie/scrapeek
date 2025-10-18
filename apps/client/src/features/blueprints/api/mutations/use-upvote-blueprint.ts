import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/clients/axios";

export const useUpvoteBlueprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["upvote-blueprint"],
    mutationFn: async (blueprintId: string) => {
      try {
        await axiosClient({
          method: "post",
          url: `/upvotes/`,
          data: {
            blueprintId,
          },
        });
      } catch {
        throw new Error("Something went wrong during upvoting of blueprint");
      }
    },
    onSuccess: (_, blueprintId) => {
      // TODO: optimistic update
      queryClient.invalidateQueries({ queryKey: ["public-blueprints"] });
      queryClient.invalidateQueries({
        queryKey: ["get-blueprint-upvotes", blueprintId],
      });
    },
  });
};
