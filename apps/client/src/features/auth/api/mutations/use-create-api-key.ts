import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/clients/auth";

export const useCreateAPIKey = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["create-api-key"],
		mutationFn: async (name: string) => {
			try {
				const { data } = await authClient.apiKey.create({
					name,
				});
				const apiKey = await data?.key;
				return apiKey;
			} catch {
				throw new Error("Something went wrong during generating API key");
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["api-key-list"] });
		},
	});
};
