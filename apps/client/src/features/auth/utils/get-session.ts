import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { authClient } from "../../../lib/clients/auth";

export const getSession = createServerFn().handler(async () => {
	const { data: session } = await authClient.getSession({
		fetchOptions: {
			headers: getRequestHeaders() as HeadersInit,
		},
	});
	return { session };
});
