import { schema } from "@scrapeek/db/schema";
import type { Blueprint } from "@scrapeek/db/validators";
import { eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "@/lib/db.ts";
import { scrapeData } from "@/lib/scrape.ts";
import { zodValidator } from "@/middlewares/custom-zod-validator.ts";

const app = new Hono().post(
	"/",
	zodValidator(
		"json",
		z.object({
			id: z.uuid(),
			mode: z.union([z.literal("test"), z.literal("normal")]).optional(),
		}),
	),
	async (c) => {
		const { id, mode } = await c.req.valid("json");

		const blueprint = (await db.query.blueprint
			.findFirst({
				where: {
					id,
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
