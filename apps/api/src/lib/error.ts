import type { ContentfulStatusCode } from "hono/utils/http-status";
import { StatusCodes } from "http-status-codes";

export class StatusError extends Error {
	public statusCode: ContentfulStatusCode;
	constructor(message: string, statusCode: ContentfulStatusCode) {
		super(message);
		this.statusCode = statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
	}
}
