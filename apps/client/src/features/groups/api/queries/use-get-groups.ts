import { axiosClient } from "@/lib/clients/axios";
import type { Group } from "@scrapeek/shared/group";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useGetGroups = () => {
  return useSuspenseQuery({
    queryKey: ["all-groups"],
    queryFn: async () => {
      try {
        const response = await axiosClient<{ data: Group[] }>({
          method: "get",
          url: "/groups",
        });
        const { data } = response.data;

        return data;
      } catch {
        throw new Error("Something went wrong during retrieval of groups");
      }
    },
  });
};
