import { db } from "@/db/db";
import type { AuthType } from "@/lib/auth";
import { StatusError } from "@/lib/error";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { zodValidator } from "@/middlewares/custom-zod-validator";
import { Hono } from "hono";
import { editableGroup } from "./groups.schemas";
import { groupTable } from "@/db/schemas/group";
import { and, eq } from "drizzle-orm";

const app = new Hono<{ Variables: AuthType }>()
  .use(authMiddleware)
  .get("/", async (c) => {
    const user = c.get("user");

    if (!user) {
      throw new StatusError("No user found", 401);
    }

    const groups = await db.query.groupTable.findMany({
      where: (table) => eq(table.userId, user.id),
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
      .insert(groupTable)
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
      throw new StatusError("No user found", 401);
    }

    await db.query.groupTable
      .findFirst({
        where: (table) => and(eq(table.id, id), eq(table.userId, user.id)),
      })
      .catch(() => {
        c.status(404);
        throw new Error(`Group with id '${id}' was not found`);
      });

    const updatedGroup = await db
      .update(groupTable)
      .set({
        name,
      })
      .where(eq(groupTable.id, id))
      .returning();

    return c.json({ data: updatedGroup });
  })
  .delete("/:id", async (c) => {
    const user = c.get("user");
    const id = c.req.param("id");

    if (!user) {
      throw new StatusError("No user found", 401);
    }

    await db.query.groupTable
      .findFirst({
        where: (table) => and(eq(table.id, id), eq(table.userId, user.id)),
      })
      .catch(() => {
        c.status(404);
        throw new Error(`Group with id '${id}' was not found`);
      });

    const deletedGroup = await db.delete(groupTable).where(eq(groupTable.id, id)).returning();

    return c.json({ data: deletedGroup });
  });

export default app;
