import type { InferRequestType, InferResponseType } from "hono";
import type { client } from "@/lib/clients/hono";

export type GroupListResponse = InferResponseType<typeof client.api.groups.$get>;

export type CreateGroupRequest = InferRequestType<typeof client.api.groups.$post>;
export type DeleteGroupRequest = InferRequestType<(typeof client.api.groups)[":id"]["$delete"]>;
export type EditGroupRequest = InferRequestType<(typeof client.api.groups)[":id"]["$patch"]>;
export type AddBlueprintToGroupRequest = InferRequestType<typeof client.api.groups.$put>;
