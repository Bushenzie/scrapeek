import type { Upvote } from "@scrapeek/shared/upvote";
import { useSuspenseQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/clients/axios";

export const useUpvotes = () => {
  return useSuspenseQuery({
    queryKey: ["get-upvotes"],
    queryFn: async () => {
      try {
        const response = await axiosClient<{
          data: Upvote[];
        }>({
          method: "get",
          url: `/upvotes`,
        });
        const upvotes = await response.data.data;
        return upvotes;
      } catch {
        throw new Error("Failed to fetch upvote");
      }
    },
  });
};
