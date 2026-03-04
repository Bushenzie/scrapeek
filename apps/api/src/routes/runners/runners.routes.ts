import { schema } from "@scrapeek/db/schema";
import type { Blueprint } from "@scrapeek/db/validators";
import { eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "@/lib/db.ts";
import { scrapeData } from "@/lib/scrape.ts";
import { zodValidator } from "@/middlewares/custom-zod-validator.ts";
import { runnerSchema } from "./runners.schemas.ts";

const app = new Hono().post(
	"/",
	zodValidator("json", runnerSchema),
	async (c) => {
		const { blueprintId, mode } = await c.req.valid("json");

		const blueprint = (await db.query.blueprint
			.findFirst({
				where: {
					id: blueprintId,
				},
			})
			.catch(() => {
				throw new Error("No blueprints found");
			})) as Blueprint;

		const isTestRun = mode === "test";

		const data = await scrapeData([blueprint], isTestRun);

		if (!isTestRun) {
			const existingResult = await db.query.result.findFirst({
				where: {
					blueprintId: blueprint.id,
				},
			});

			if (!existingResult) {
				await db
					.insert(schema.result)
					.values({ blueprintId: blueprint.id, data: data[0] });
			} else {
				await db
					.update(schema.result)
					.set({
						data: data[0],
						updatedAt: sql`NOW()`,
					})
					.where(eq(schema.result.blueprintId, blueprint.id));
			}
		}

		return c.json(data);
	},
);

export default app;
