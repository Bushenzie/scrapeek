import { schema } from "@scrapeek/db/schema";
import { upvoteInsertSchema } from "@scrapeek/db/validators";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { StatusCodes } from "http-status-codes";
import { db } from "@/lib/db";
import { StatusError } from "@/lib/error";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { zodValidator } from "@/middlewares/custom-zod-validator";
import { idParamSearchSchema } from "@/schemas/id-param-search-schema";

const app = new Hono()
	.use(authMiddleware)
	.post("/", zodValidator("json", upvoteInsertSchema), async (c) => {
		const { blueprintId } = c.req.valid("json");
		const user = c.get("user");

		if (!user) {
			throw new StatusError("No user found", StatusCodes.UNAUTHORIZED);
		}

		const existingUpvote = await db.query.upvote.findFirst({
			where: {
				userId: user.id,
				blueprintId,
			},
		});

		// TODO: Redo this and make some kind of status for upvote like "active"|"inactive" to just simple update wihtout always deleting and inserting
		if (existingUpvote) {
			await db
				.delete(schema.upvote)
				.where(eq(schema.upvote.id, existingUpvote.id));
		} else {
			await db.insert(schema.upvote).values({ blueprintId, userId: user.id });
		}

		return c.json({ message: "Upvote action successful" });
	})
	.get("/", async (c) => {
		const user = c.get("user");

		if (!user) {
			throw new StatusError("No user found", StatusCodes.UNAUTHORIZED);
		}

		const allUsersUpvotes = await db.query.upvote.findMany({
			where: {
				userId: user.id,
			},
		});

		return c.json({ data: allUsersUpvotes });
	})
	.get("/:id", zodValidator("param", idParamSearchSchema), async (c) => {
		const { id } = c.req.valid("param");
		const user = c.get("user");

		if (!user) {
			throw new StatusError("No user found", StatusCodes.UNAUTHORIZED);
		}

		const blueprintUpvotes = await db.query.upvote.findMany({
			where: {
				blueprintId: id,
			},
		});

		return c.json({ data: blueprintUpvotes });
	});

export default app;
