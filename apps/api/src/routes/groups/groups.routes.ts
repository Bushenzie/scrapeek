import { schema } from "@scrapeek/db/schema";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { StatusCodes } from "http-status-codes";
import type { AuthType } from "@/lib/auth";
import { db } from "@/lib/db";
import { StatusError } from "@/lib/error";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { zodValidator } from "@/middlewares/custom-zod-validator";
import { editableGroup } from "./groups.schemas";

const app = new Hono<{ Variables: AuthType }>()
	.use(authMiddleware)
	.get("/", async (c) => {
		const user = c.get("user");

		if (!user) {
			throw new StatusError("No user found", StatusCodes.UNAUTHORIZED);
		}

		const groups = await db.query.group.findMany({
			where: {
				userId: user.id,
			},
			with: {
				blueprints: true,
			},
		});

		return c.json({ data: groups });
	})
	.post("/", zodValidator("json", editableGroup), async (c) => {
		const user = c.get("user");
		const { name } = c.req.valid("json");

		if (!user) {
			throw new StatusError("No user found", StatusCodes.UNAUTHORIZED);
		}

		const createdGroup = await db
			.insert(schema.group)
			.values({
				name,
				userId: user.id,
			})
			.returning();

		return c.json({ data: createdGroup[0] });
	})
	.patch("/:id", zodValidator("json", editableGroup), async (c) => {
		const user = c.get("user");
		const id = c.req.param("id");
		const { name } = c.req.valid("json");

		if (!user) {
			throw new StatusError("No user found", StatusCodes.UNAUTHORIZED);
		}

		await db.query.group
			.findFirst({
				where: {
					userId: user.id,
					id,
				},
			})
			.catch(() => {
				c.status(404);
				throw new Error(`Group with id '${id}' was not found`);
			});

		const updatedGroup = await db
			.update(schema.group)
			.set({
				name,
			})
			.where(eq(schema.group.id, id))
			.returning();

		return c.json({ data: updatedGroup });
	})
	.delete("/:id", async (c) => {
		const user = c.get("user");
		const id = c.req.param("id");

		if (!user) {
			throw new StatusError("No user found", StatusCodes.UNAUTHORIZED);
		}

		await db.query.group
			.findFirst({
				where: {
					userId: user.id,
					id,
				},
			})
			.catch(() => {
				c.status(404);
				throw new Error(`Group with id '${id}' was not found`);
			});

		const deletedGroup = await db
			.delete(schema.group)
			.where(eq(schema.group.id, id))
			.returning();

		return c.json({ data: deletedGroup });
	});

export default app;
