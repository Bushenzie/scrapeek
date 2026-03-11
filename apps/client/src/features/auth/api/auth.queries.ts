import { queryOptions } from "@tanstack/react-query";
import { authClient } from "@/lib/clients/auth";
import { apiKeyQueryKeys } from "./auth.keys";

export const apiKeyDetailOptions = (id: string) =>
	queryOptions({
		queryKey: apiKeyQueryKeys.detail(id),
		queryFn: async () => {
			const { data: apiKey, error } = await authClient.apiKey.get({
				query: {
					id,
				},
			});

			if (error) throw new Error("There was an error during retrival of API key");

			return apiKey;
		},
	});

export const apiKeyListOptions = () =>
	queryOptions({
		queryKey: apiKeyQueryKeys.list(),
		queryFn: async () => {
			const { data: apiKeys, error } = await authClient.apiKey.list();

			if (error) throw new Error("There was an error during retrival of API key");

			return apiKeys;
		},
	});
