export const apiKeyQueryKeys = {
	all: ["auth"] as const,
	lists: () => [...apiKeyQueryKeys.all, "list"] as const,
	details: () => [...apiKeyQueryKeys.all, "detail"] as const,

	detail: (id: string) => [...apiKeyQueryKeys.details(), id] as const,
	list: () => [...apiKeyQueryKeys.lists(), "all"] as const,
};
