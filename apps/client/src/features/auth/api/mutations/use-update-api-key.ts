import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/clients/auth";

export const useUpdateAPIKey = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["update-api-key"],
		mutationFn: async ({ id, name }: { id: string; name: string }) => {
			try {
				await authClient.apiKey.update({
					keyId: id,
					name,
				});
			} catch {
				throw new Error("Something went wrong during generating API key");
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["api-key"] });
		},
	});
};
