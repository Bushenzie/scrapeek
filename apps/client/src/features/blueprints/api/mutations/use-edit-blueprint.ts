import type { Blueprint } from "@scrapeek/db/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toasts/toast";
import { axiosClient } from "@/lib/clients/axios";

export const useEditBlueprint = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["edit-blueprint"],
		mutationFn: async (blueprint: Partial<Blueprint>) => {
			try {
				const response = await axiosClient<{ data: Blueprint }>({
					method: "patch",
					url: `/blueprints/${blueprint.id}`,
					data: blueprint,
				});
				const data = await response.data;
				return data;
			} catch {
				throw new Error("Something went wrong during edit of blueprint");
			}
		},
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: ["all-blueprints"] });
			queryClient.invalidateQueries({
				queryKey: ["blueprint", response.data.id],
			});
			toast({
				title: "Success",
				description: `Successfully edited blueprint "${response.data.name}"`,
			});
		},
	});
};
