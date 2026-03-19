export const blueprintQueryKeys = {
  all: ["blueprints"] as const,
  lists: () => [...blueprintQueryKeys.all, "list"] as const,
  details: () => [...blueprintQueryKeys.all, "detail"] as const,
  upvotes: () => [...blueprintQueryKeys.all, "upvote"] as const,

  list: () => [...blueprintQueryKeys.lists(), "all"] as const,
  detail: (id: string) => [...blueprintQueryKeys.details(), id] as const,
  public: (page?: string | string[]) => [...blueprintQueryKeys.lists(), "public", page] as const,
  upvote: (id: string) => [...blueprintQueryKeys.upvotes(), id] as const,
}
