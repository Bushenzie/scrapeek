import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/clients/hono";
import { groupQueryKeys } from "./groups.keys";
import type { CreateGroupRequest } from "./groups.types";

export const useCreateGroup = () =>
	useMutation({
		mutationFn: (request: CreateGroupRequest) => client.api.groups.$post(request),
		meta: {
			invalidatesQuery: groupQueryKeys.all,
			successMessage: "Successfully created group",
		},
	});
