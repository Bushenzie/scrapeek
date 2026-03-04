import type { Blueprint } from "@scrapeek/db/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "@/components/ui/toasts/toast";
import { axiosClient } from "@/lib/clients/axios";

export const useDeleteBlueprint = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationKey: ["delete-blueprint"],
		mutationFn: async (blueprintId: string) => {
			try {
				const response = await axiosClient<Blueprint>({
					method: "delete",
					url: `/blueprints/${blueprintId}`,
				});
				const data = await response.data;
				return data;
			} catch {
				throw new Error("Something went wrong during delete of blueprint");
			}
		},
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: ["all-blueprints"] });

			console.log(response);

			toast({
				title: "Success",
				description: `Blueprint "${response.name}" was successfully deleted`,
			});
			router.navigate({ to: "/blueprints" });
		},
	});
};
