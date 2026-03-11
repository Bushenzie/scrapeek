import type { Blueprint } from "@scrapeek/db/validators";
import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/clients/hono";
import { blueprintQueryKeys } from "./blueprints.keys";

export const useCreateBlueprint = () =>
	useMutation({
		mutationFn: (blueprint: Blueprint) =>
			client.api.blueprints.$post({
				json: blueprint,
			}),
		meta: {
			invalidatesQuery: blueprintQueryKeys.list(),
			errorMessage: "There was an error during creation of blueprint",
			successMessage: "Successfully created blueprint",
		},
	});

export const useDeleteBlueprint = () =>
	useMutation({
		mutationFn: (id: string) =>
			client.api.blueprints[":id"].$delete({
				param: {
					id,
				},
			}),
		meta: {
			invalidatesQuery: blueprintQueryKeys.list(),
			errorMessage: "There was an error during deletion of blueprint",
			successMessage: "Successfully deleted blueprint",
		},
	});

export const useEditBlueprint = () =>
	useMutation({
		mutationFn: (blueprint: Blueprint) =>
			client.api.blueprints[":id"].$patch({
				param: {
					id: blueprint.id,
				},
				json: blueprint,
			}),
		meta: {
			invalidatesQuery: blueprintQueryKeys.list(),
			errorMessage: "There was an error during update of blueprint",
			successMessage: "Successfully updated blueprint",
		},
	});

export const useRunBlueprint = () =>
	useMutation({
		mutationFn: ({ id, mode }: { id: string; mode?: "test" | "normal" }) =>
			client.api.runners.$post({
				json: {
					id,
					mode,
				},
			}),
		meta: {
			invalidatesQuery: blueprintQueryKeys.all,
			errorMessage: "There was an error the scraping of blueprint",
			mutateMessage: "Running blueprint",
			successMessage: "Successfully scraped blueprint",
		},
	});

export const useUpvoteBlueprint = () =>
	useMutation({
		mutationFn: (id: string) =>
			client.api.upvotes.$post({
				json: {
					blueprintId: id,
				},
			}),
		meta: {
			invalidatesQuery: blueprintQueryKeys.all,
			errorMessage: "There was an error while upvoting a blueprint",
		},
	});
