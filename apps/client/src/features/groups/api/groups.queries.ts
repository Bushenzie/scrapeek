import { queryOptions } from "@tanstack/react-query"
import { client } from "@/lib/clients/hono"
import { unwrap } from "@/lib/unwrap"
import { groupQueryKeys } from "./groups.keys"

export const groupsListOptions = () =>
  queryOptions({
    queryKey: groupQueryKeys.list(),
    queryFn: () => unwrap(client.api.groups.$get()),
  })
