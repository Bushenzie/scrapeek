import type { Blueprint } from "@scrapeek/db/validators";
import { useSuspenseQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/clients/axios";

type GetPublicBlueprintsProps = {
	page: number;
};

export const usePublicBlueprints = ({ page }: GetPublicBlueprintsProps) => {
	return useSuspenseQuery({
		queryKey: ["public-blueprints"],
		queryFn: async () => {
			try {
				const response = await axiosClient<{
					totalCount: number;
					page: number;
					data: Blueprint[];
				}>({
					method: "get",
					url: "/blueprints/public",
					params: {
						page,
					},
				});
				return response.data;
			} catch {
				throw new Error("Failed to fetch blueprints");
			}
		},
	});
};
