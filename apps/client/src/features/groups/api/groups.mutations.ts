import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/clients/hono";
import { groupQueryKeys } from "./groups.keys";
import type { CreateGroupRequest } from "./groups.types";

export const useCreateGroup = () =>
	useMutation({
		mutationFn: async (request: CreateGroupRequest) => {
			await client.api.groups.$post(request);
		},
		meta: {
			invalidatesQuery: groupQueryKeys.all,
			successMessage: "Successfully created group",
		},
	});
