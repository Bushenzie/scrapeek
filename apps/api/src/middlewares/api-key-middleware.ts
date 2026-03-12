import { createMiddleware } from "hono/factory";
import { StatusCodes } from "http-status-codes";
import { auth } from "@/lib/auth";
import { StatusError } from "@/lib/error";

export const apiKeyMiddleware = createMiddleware(async (c, next) => {
	const apiKey = await c.req.header("x-api-key");

	if (!apiKey)
		throw new StatusError("No API Key provided", StatusCodes.UNAUTHORIZED);

	const { error, valid } = await auth.api.verifyApiKey({
		body: {
			key: apiKey,
		},
	});

	if (!valid) {
		throw new StatusError(
			error?.message ?? "API Key is invalid",
			StatusCodes.UNAUTHORIZED,
		);
	}

	await next();
});
