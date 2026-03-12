export const blueprintQueryKeys = {
	all: ["blueprints"] as const,
	lists: () => [...blueprintQueryKeys.all, "list"] as const,
	details: () => [...blueprintQueryKeys.all, "detail"] as const,
	upvotes: () => [...blueprintQueryKeys.all, "upvote"] as const,

	list: () => [...blueprintQueryKeys.lists(), "all"] as const,
	detail: (id: string) => [...blueprintQueryKeys.details(), id] as const,
	public: () => [...blueprintQueryKeys.lists(), "public"] as const,
	upvote: (id: string) => [...blueprintQueryKeys.upvotes(), id] as const,
};
