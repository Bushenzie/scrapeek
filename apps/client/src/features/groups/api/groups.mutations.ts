import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/clients/hono";
import { groupQueryKeys } from "./groups.keys";

export const useCreateGroup = () =>
	useMutation({
		mutationFn: async (name: string) => {
			await client.api.groups.$post({
				json: {
					name,
				},
			});
		},
		meta: {
			invalidatesQuery: groupQueryKeys.all,
			successMessage: "Successfully created group",
		},
	});
