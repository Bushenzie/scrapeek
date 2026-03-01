import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "@/lib/db";
import { schema } from "@scrapeek/db/schema";
import { StatusError } from "@/lib/error";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { zodValidator } from "@/middlewares/custom-zod-validator";
import { upvoteBlueprintParamSchema, upvoteBodySchema } from "./upvotes.schemas";

const app = new Hono()
  .use(authMiddleware)
  .post("/", zodValidator("json", upvoteBodySchema), async (c) => {
    const { blueprintId } = c.req.valid("json");
    const user = c.get("user");

    if (!user) {
      throw new StatusError("No user found", 401);
    }

    const existingUpvote = await db.query.upvote.findFirst({
      // where: (upvotes, { eq, and }) => and(eq(upvotes.blueprintId, blueprintId), eq(upvotes.userId, user.id)),
      where: {
        userId: user.id,
        blueprintId,
      },
    });

    // TODO: Redo this and make some kind of status for upvote like "active"|"inactive" to just simple update wihtout always deleting and inserting
    if (existingUpvote) {
      await db.delete(schema.upvote).where(eq(schema.upvote.id, existingUpvote.id));
    } else {
      await db.insert(schema.upvote).values({ blueprintId, userId: user.id });
    }

    return c.json({ message: "Upvote action successful" });
  })
  .get("/", async (c) => {
    const user = c.get("user");

    if (!user) {
      throw new StatusError("No user found", 401);
    }

    const allUsersUpvotes = await db.query.upvote.findMany({
      where: {
        userId: user.id,
      },
      // where: (upvotes, { eq }) => eq(upvotes.userId, user.id),
    });

    return c.json({ data: allUsersUpvotes });
  })
  .get("/:blueprintId", zodValidator("param", upvoteBlueprintParamSchema), async (c) => {
    const { blueprintId } = c.req.valid("param");
    const user = c.get("user");

    if (!user) {
      throw new StatusError("No user found", 401);
    }

    const blueprintUpvotes = await db.query.upvote.findMany({
      // where: (upvotes, { eq }) => eq(upvotes.blueprintId, blueprintId),
      where: {
        blueprintId,
      },
    });

    return c.json({ data: blueprintUpvotes });
  });

export default app;
