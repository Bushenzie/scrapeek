export const groupQueryKeys = {
  all: ["groups"] as const,
  lists: () => [...groupQueryKeys.all, "list"] as const,
  details: () => [...groupQueryKeys.all, "detail"] as const,

  list: () => [...groupQueryKeys.lists(), "all"] as const,
  detail: (id: string) => [...groupQueryKeys.details(), id] as const,
}
