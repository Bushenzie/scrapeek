import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { axiosClient } from "./axios";

export const useBlueprints = () => {
  return useQuery({
    queryKey: ["blueprints"],
    queryFn: async () => {
      try {
        const response = await axiosClient("/blueprints");

        const data = await response.data;

        return data.data;
      } catch {
        throw new Error("Failed blueprint fetch");
      }
    },
  });
};
