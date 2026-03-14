import { Hono } from "hono";
import { db } from "@/lib/db";
import { apiKeyMiddleware } from "@/middlewares/api-key-middleware";
import { zodValidator } from "@/middlewares/custom-zod-validator";
import { idParamSearchSchema } from "@/schemas/id-param-search-schema";
import { StatusError } from "@/lib/error";
import { StatusCodes } from "http-status-codes";

const app = new Hono()
	.use(apiKeyMiddleware)
	.get("/:id", zodValidator("param", idParamSearchSchema), async (c) => {
		const { id } = c.req.valid("param");

		const result = await db.query.result
			.findFirst({
				where: {
					id,
				},
			})
			.catch(() => {
			  throw new StatusError(`Result was not found`,StatusCodes.NOT_FOUND);
			});

		return c.json({ data: result });
	});

export default app;
