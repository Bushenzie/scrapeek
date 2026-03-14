import type { client } from "@/lib/clients/hono";
import type { InferRequestType, InferResponseType } from "hono";

export type BlueprintListResponse = InferResponseType<typeof client.api.blueprints.$get>
export type BlueprintPublicListResponse = InferResponseType<typeof client.api.blueprints.public.$get>
export type BlueprintDetailResponse = InferResponseType<typeof client.api.blueprints[":id"]["$get"]>
export type BlueprintUpvoteListResponse = InferResponseType<typeof client.api.upvotes.$get>

export type GetPublicBlueprintListRequest = InferRequestType<typeof client.api.blueprints.public.$get>
export type GetBlueprintDetailRequest = InferRequestType<typeof client.api.blueprints[":id"]["$get"]>


export type CreateBlueprintRequest = InferRequestType<typeof client.api.blueprints.$post>
export type DeleteBlueprintRequest = InferRequestType<typeof client.api.blueprints[":id"]["$delete"]>
export type EditBlueprintRequest = InferRequestType<typeof client.api.blueprints[":id"]["$patch"]>
export type RunBlueprintRequest = InferRequestType<typeof client.api.runners.$post>
export type UpvoteBlueprintRequest = InferRequestType<typeof client.api.upvotes.$post>
