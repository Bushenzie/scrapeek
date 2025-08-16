import { Hono } from "hono";
import { db } from "../db/index.ts";
import { blueprintTable } from "../db/schemas/schema.ts";
import { type Blueprint } from "../schemas/blueprint.ts";
import { eq } from "drizzle-orm";

const app = new Hono();

app.get("/", async (c) => {
  const blueprints = await db.query.blueprintTable.findMany();

  return c.json({ data: blueprints });
});

app.get("/:id", async (c) => {
  const { id } = c.req.param();

  const searchedBlueprint = await db.query.blueprintTable.findFirst({
    where: (blueprints, { eq }) => eq(blueprints.id, id),
  });

  if (!searchedBlueprint) {
    c.status(404);
    throw new Error(`Item with id '${id}' was not found`);
  }

  return c.json({ data: searchedBlueprint });
});

app.post("/", async (c) => {
  const body = (await c.req.json()) as Omit<
    Blueprint,
    "id" | "createdAt" | "updatedAt"
  >;
  const createdBlueprint = await db
    .insert(blueprintTable)
    .values({
      ...body,
    })
    .returning();

  return c.json({ data: createdBlueprint });
});

app.delete("/:id", async (c) => {
  const { id } = c.req.param();

  await db.query.blueprintTable
    .findFirst({
      where: (blueprints, { eq }) => eq(blueprints.id, id),
    })
    .catch(() => {
      c.status(404);
      throw new Error(`Item with id '${id}' was not found`);
    });

  const removedBlueprint = await db
    .delete(blueprintTable)
    .where(eq(blueprintTable.id, id))
    .returning();

  return c.json({ data: removedBlueprint });
});

app.patch("/:id", async (c) => {
  const { id } = c.req.param();
  const body = (await c.req.json()) as Omit<
    Blueprint,
    "id" | "createdAt" | "updatedAt"
  >;

  await db.query.blueprintTable
    .findFirst({
      where: (blueprints, { eq }) => eq(blueprints.id, id),
    })
    .catch(() => {
      c.status(404);
      throw new Error(`Item with id '${id}' was not found`);
    });

  const updatedBlueprint = await db
    .update(blueprintTable)
    .set({ ...body })
    .where(eq(blueprintTable.id, id))
    .returning();

  return c.json({ data: updatedBlueprint });
});

export default app;
