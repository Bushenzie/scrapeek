import { useSuspenseQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/clients/auth";

type GetApiKeyProps = {
	id: string;
};

export const useApiKey = ({ id }: GetApiKeyProps) => {
	return useSuspenseQuery({
		queryKey: ["api-key", id],
		queryFn: async () => {
			try {
				const { data: apiKey } = await authClient.apiKey.get({
					query: {
						id,
					},
				});

				return apiKey;
			} catch {
				throw new Error("Failed to fetch api key");
			}
		},
	});
};
