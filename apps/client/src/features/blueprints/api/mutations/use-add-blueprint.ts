import type { Blueprint, EditableBlueprint } from "@scrapeek/db/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toasts/toast";
import { axiosClient } from "@/lib/clients/axios";

export const useAddBlueprint = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["add-blueprint"],
		mutationFn: async (blueprint: EditableBlueprint) => {
			try {
				const response = await axiosClient<{ data: Blueprint }>({
					method: "post",
					url: "/blueprints",
					data: blueprint,
				});
				const data = await response.data;

				return data;
			} catch {
				throw new Error("Something went wrong during addition of blueprint");
			}
		},
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: ["all-blueprints"] });
			toast({
				title: "Success",
				description: `Successfully added ${response.data.type} blueprint "${response.data.name}"`,
			});
		},
	});
};
