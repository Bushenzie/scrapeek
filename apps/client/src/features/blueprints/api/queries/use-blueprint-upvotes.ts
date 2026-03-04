import type { Upvote } from "@scrapeek/db/validators";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { axiosClient } from "@/lib/clients/axios";

type GetBlueprintUpvotesProps = {
	blueprintId: string;
};

export const useBlueprintUpvotes = ({
	blueprintId,
}: GetBlueprintUpvotesProps) => {
	return useSuspenseQuery({
		queryKey: ["get-blueprint-upvotes", blueprintId],
		queryFn: async () => {
			try {
				const response = await axiosClient<{
					data: Upvote[];
				}>({
					method: "get",
					url: `/upvotes/${blueprintId}`,
				});
				const blueprints = await response.data.data;
				return blueprints;
			} catch (err) {
				if ((err as AxiosError).status === 404) return null;
				throw new Error("Failed to fetch upvote");
			}
		},
	});
};
