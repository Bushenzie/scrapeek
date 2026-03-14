import type { InferRequestType, InferResponseType } from "hono";
import type { client } from "@/lib/clients/hono";

export type GroupListResponse = InferResponseType<
	typeof client.api.groups.$get
>;

export type CreateGroupRequest = InferRequestType<
	typeof client.api.groups.$post
>;
