import type { Group } from "@scrapeek/db/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toasts/toast";
import { axiosClient } from "@/lib/clients/axios";

export const useAddGroup = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["add-group"],
		mutationFn: async (groupName: string) => {
			try {
				const response = await axiosClient<{ data: Group }>({
					method: "post",
					url: "/groups",
					data: {
						name: groupName,
					},
				});
				const data = await response.data;

				return data;
			} catch {
				throw new Error("Something went wrong during addition of group");
			}
		},
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: ["all-groups"] });
			toast({
				title: "Success",
				description: `Successfully added group "${response.data.name}"`,
			});
		},
	});
};
