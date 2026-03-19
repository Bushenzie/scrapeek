import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/clients/hono";
import { groupQueryKeys } from "./groups.keys";
import type {
	AddBlueprintToGroupRequest,
	CreateGroupRequest,
	DeleteGroupRequest,
	EditGroupRequest,
} from "./groups.types";

export const useCreateGroup = () =>
	useMutation({
		mutationFn: (request: CreateGroupRequest) => client.api.groups.$post(request),
		meta: {
			invalidatesQuery: groupQueryKeys.all,
			successMessage: "Successfully created group",
		},
	});

export const useDeleteGroup = () =>
	useMutation({
		mutationFn: (request: DeleteGroupRequest) => client.api.groups[":id"]["$delete"](request),
		meta: {
			invalidatesQuery: groupQueryKeys.list(),
			successMessage: "Successfully deleted group",
		},
	});

export const useEditGroup = () =>
	useMutation({
		mutationFn: (request: EditGroupRequest) => client.api.groups[":id"]["$patch"](request),
		meta: {
			invalidatesQuery: groupQueryKeys.list(),
			successMessage: "Successfully updated group",
		},
	});

export const useAddBlueprintToGroup = () =>
	useMutation({
		mutationFn: (request: AddBlueprintToGroupRequest) => client.api.groups.$put(request),
		meta: {
			invalidatesQuery: groupQueryKeys.list(),
			successMessage: "Successfully added blueprint to group(s)",
		},
	});
