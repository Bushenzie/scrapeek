import type { InferRequestType } from "hono";
import type { client } from "@/lib/clients/hono";

export type CreateGroupRequest = InferRequestType<
	typeof client.api.groups.$post
>;
