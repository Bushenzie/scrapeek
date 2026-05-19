import { queryOptions } from "@tanstack/react-query"
import { client } from "@/lib/clients/hono"
import { unwrap } from "@/lib/unwrap"
import { blueprintQueryKeys } from "./blueprints.keys"
import type { GetBlueprintDetailRequest, GetPublicBlueprintListRequest } from "./blueprints.types"

export const blueprintListOptions = () =>
  queryOptions({
    queryKey: blueprintQueryKeys.list(),
    queryFn: () => unwrap(client.api.blueprints.$get()),
  })

export const blueprintListPublicOptions = (request: GetPublicBlueprintListRequest) =>
  queryOptions({
    queryKey: blueprintQueryKeys.public(request.query.page),
    queryFn: () => unwrap(client.api.blueprints.public.$get(request)),
  })

export const blueprintDetailOptions = (request: GetBlueprintDetailRequest) =>
  queryOptions({
    queryKey: blueprintQueryKeys.detail(request.param.id),
    queryFn: () => unwrap(client.api.blueprints[":id"].$get(request)),
  })

export const blueprintUpvoteListOptions = () =>
  queryOptions({
    queryKey: blueprintQueryKeys.upvotes(),
    queryFn: () => unwrap(client.api.upvotes.$get()),
  })
