import { queryOptions } from "@tanstack/react-query";
import { client } from "@/lib/clients/hono";
import { unwrap } from "@/lib/unwrap";
import { blueprintQueryKeys } from "./blueprints.keys";

export const blueprintListOptions = () =>
	queryOptions({
		queryKey: blueprintQueryKeys.list(),
		queryFn: () => unwrap(client.api.blueprints.$get()),
	});

export const blueprintListPublicOptions = () =>
	queryOptions({
		queryKey: blueprintQueryKeys.public(),
		queryFn: () =>
			unwrap(
				client.api.blueprints.public.$get({
					query: {
						page: "1",
					},
				}),
			),
	});

export const blueprintDetailOptions = (id: string) =>
	queryOptions({
		queryKey: blueprintQueryKeys.detail(id),
		queryFn: () =>
			unwrap(
				client.api.blueprints[":id"].$get({
					param: {
						id,
					},
				}),
			),
	});

export const blueprintUpvoteListOptions = () =>
	queryOptions({
		queryKey: blueprintQueryKeys.upvotes(),
		queryFn: () => unwrap(client.api.upvotes.$get()),
	});

export const blueprintUpvotesOptions = (id: string) =>
	queryOptions({
		queryKey: blueprintQueryKeys.upvote(id),
		queryFn: () =>
			unwrap(
				client.api.upvotes[":id"].$get({
					param: {
						id,
					},
				}),
			),
	});
