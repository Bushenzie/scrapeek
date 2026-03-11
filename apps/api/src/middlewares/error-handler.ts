import type { ErrorHandler } from "hono";
import { StatusError } from "@/lib/error.ts";

export const errorHandler: ErrorHandler = async (err, c) => {
	console.error(err.message);
	if (err instanceof StatusError) {
		return c.json({ error: err.message, status: err.statusCode }, err.statusCode);
	}
	return c.json({
		error: err.message,
	});
};
