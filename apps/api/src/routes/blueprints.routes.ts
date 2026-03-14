import { schema } from "@scrapeek/db/schema";
import {
	blueprintWithRelationsSchema,
	editableBlueprintSchema,
	insertBlueprintSchema,
} from "@scrapeek/db/validators";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import type { AuthType } from "@/lib/auth.ts";
import { db } from "@/lib/db.ts";
import { StatusError } from "@/lib/error.ts";
import { authMiddleware } from "@/middlewares/auth-middleware.ts";
import { zodValidator } from "@/middlewares/custom-zod-validator.ts";
import { idParamSearchSchema } from "@/schemas/id-param-search-schema.ts";

const paginationLimit = 12;

const app = new Hono<{ Variables: AuthType }>()
	.use(authMiddleware)
	.get(
		"/public",
		zodValidator(
			"query",
			z.object({
				page: z.coerce.number().positive(),
			}),
		),
		async (c) => {
			const user = c.get("user");
			const { page = 1 } = c.req.valid("query");

			if (!user) {
				throw new StatusError("No user found", StatusCodes.UNAUTHORIZED);
			}

			// TODO: https://github.com/drizzle-team/drizzle-orm/discussions/2639
			const blueprints = await db.query.blueprint.findMany({
				where: {
					public: true,
				},
				with: {
					user: true,
					upvotes: {
						orderBy: (t, { desc }) => desc(t.id),
					},
				},
				limit: paginationLimit,
				offset: paginationLimit * page - paginationLimit,
			});

			const totalPublicBlueprints = await db.query.blueprint.findMany({
				where: {
					public: true,
				},
			});

			return c.json({
				data: {
					blueprints: blueprints,
					totalCount: totalPublicBlueprints.length,
					page,
				},
			});
		},
	)
	.get("/", async (c) => {
		const user = c.get("user");

		if (!user) {
			throw new StatusError("No user found", StatusCodes.UNAUTHORIZED);
		}

		const blueprints = await db.query.blueprint.findMany({
			with: {
				result: {
					columns: {
						updatedAt: true,
					},
				},
			},
			where: { userId: user.id },
		});


		return c.json({ data: blueprints });
	})
	.get("/:id", zodValidator("param", idParamSearchSchema), async (c) => {
		const user = c.get("user");
		const { id } = c.req.valid("param");

		if (!user) {
			throw new StatusError("No user found", StatusCodes.UNAUTHORIZED);
		}

		const searchedBlueprint = await db.query.blueprint.findFirst({
			where: {
				userId: user.id,
				id,
			},
			with: {
				user: true,
				result: true,
			},
		});

		if (!searchedBlueprint) {
			throw new StatusError(
				`Item with id '${id}' was not found`,
				StatusCodes.NOT_FOUND,
			);
		}


		return c.json({ data: searchedBlueprint });
	})
	.post("/", zodValidator("json", insertBlueprintSchema), async (c) => {
		const body = await c.req.valid("json");

		const createdBlueprint = await db
			.insert(schema.blueprint)
			.values({
				...body,
			})
			.returning();

		return c.json({ data: createdBlueprint[0] });
	})
	.delete("/:id", zodValidator("param", idParamSearchSchema), async (c) => {
		const { id } = c.req.param();

		await db.query.blueprint
			.findFirst({
				where: {
					id,
				},
			})
			.catch(() => {
				throw new StatusError(
					`Item with id '${id}' was not found`,
					StatusCodes.NOT_FOUND,
				);
			});

		const removedBlueprint = await db
			.delete(schema.blueprint)
			.where(eq(schema.blueprint.id, id))
			.returning();

		return c.json({ data: removedBlueprint });
	})
	.patch("/:id", zodValidator("json", editableBlueprintSchema), async (c) => {
		const { id } = c.req.param();
		const body = await c.req.valid("json");

		await db.query.blueprint
			.findFirst({
				where: {
					id,
				},
			})
			.catch(() => {
				throw new StatusError(
					`Item with id '${id}' was not found`,
					StatusCodes.NOT_FOUND,
				);
			});

		const updatedBlueprint = await db
			.update(schema.blueprint)
			.set({ ...body })
			.where(eq(schema.blueprint.id, id))
			.returning();

		return c.json({ data: updatedBlueprint[0] });
	});

export default app;
