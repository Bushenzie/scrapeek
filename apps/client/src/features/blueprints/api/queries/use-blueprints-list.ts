import type { Blueprint } from "@scrapeek/db/validators";
import { useSuspenseQuery } from "@tanstack/react-query";
// import { authClient } from "@/lib/clients/auth";
import { axiosClient } from "@/lib/clients/axios";
// import { honoClient } from "@/lib/clients/hono";

export const useBlueprintsList = () => {
	return useSuspenseQuery(
		/* <Blueprint[]> */ {
			queryKey: ["all-blueprints"],
			queryFn: async () => {
				try {
					const response = await axiosClient<{ data: Blueprint[] }>({
						method: "get",
						url: "/blueprints",
					});
					const blueprints = await response.data.data;
					// const response = await honoClient.api.blueprints.$get();
					// const data = await response.json();
					// const blueprints = await data.data;
					return blueprints;
					// return [] as Blueprint[];
				} catch {
					throw new Error("Failed to fetch blueprints");
				}
			},
		},
	);
};
