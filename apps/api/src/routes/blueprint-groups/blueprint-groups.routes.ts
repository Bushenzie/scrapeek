import { db } from "@/lib/db";
import type { AuthType } from "@/lib/auth";
import { StatusError } from "@/lib/error";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { zodValidator } from "@/middlewares/custom-zod-validator";
import { Hono } from "hono";
import { editableGroup } from "./blueprint-groups.schemas";
import { schema } from "@scrapeek/db/schema";
import { eq } from "drizzle-orm";

const app = new Hono<{ Variables: AuthType }>()
  .use(authMiddleware)
  .get("/", async (c) => {
    const user = c.get("user");

    if (!user) {
      throw new StatusError("No user found", 401);
    }

    const groups = await db.query.group.findMany({
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
      throw new StatusError("No user found", 401);
    }

    const createdGroup = await db
      .insert(schema.group)
      .values({
        userId: user.id,
        name,
      })
      .returning();

    return c.json({ data: createdGroup });
  })
  .patch("/:id", zodValidator("json", editableGroup), async (c) => {
    const user = c.get("user");
    const id = c.req.param("id");
    const { name } = c.req.valid("json");

    if (!user) {
      throw new StatusError("No user found", 401);
    }

    await db.query.group
      .findFirst({
        where: {
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
      throw new StatusError("No user found", 401);
    }

    await db.query.group
      .findFirst({
        where: {
          id,
        },
      })
      .catch(() => {
        c.status(404);
        throw new Error(`Group with id '${id}' was not found`);
      });

    const deletedGroup = await db.delete(schema.group).where(eq(schema.group.id, id)).returning();

    return c.json({ data: deletedGroup });
  });

export default app;
