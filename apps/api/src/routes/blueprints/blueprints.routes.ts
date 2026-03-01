import { type Blueprint, editableBlueprintSchema } from "@scrapeek/shared/blueprint";
import { count, desc, eq, getColumns } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "@/lib/db.ts";
import { schema } from "@scrapeek/db/schema";
import type { AuthType } from "@/lib/auth.ts";
import { StatusError } from "@/lib/error.ts";
import { authMiddleware } from "@/middlewares/auth-middleware.ts";
import { zodValidator } from "@/middlewares/custom-zod-validator.ts";
import { paginatedBlueprint, searchableBlueprint } from "./blueprints.schemas.ts";

const paginationLimit = 12;

const app = new Hono<{ Variables: AuthType }>()
  .use(authMiddleware)
  .get("/public", zodValidator("query", paginatedBlueprint), async (c) => {
    const user = c.get("user");
    const { page = 1 } = c.req.valid("query");

    if (!user) {
      throw new StatusError("No user found", 401);
    }

    // TODO: https://github.com/drizzle-team/drizzle-orm/discussions/2639
    const blueprints = await db
      .select({
        ...getColumns(schema.blueprint),
        user: {
          name: schema.user.name,
          image: schema.user.image,
        },
        upvotes: count(schema.upvote.id).as("upvotes"),
      })
      .from(schema.blueprint)
      .leftJoin(schema.user, eq(schema.blueprint.userId, user.id))
      .leftJoin(schema.upvote, eq(schema.upvote.blueprintId, schema.blueprint.id))
      .where(eq(schema.blueprint.public, true))
      .groupBy(schema.blueprint.id, schema.user.id, schema.user.name, schema.user.image)
      .orderBy(desc(count(schema.upvote.id)))
      .limit(paginationLimit)
      .offset(paginationLimit * page - paginationLimit);

    const totalCount = await db.select({ count: count() }).from(schema.blueprint);

    return c.json({ data: blueprints, totalCount: totalCount[0].count, page });
  })
  .get("/", zodValidator("query", paginatedBlueprint), async (c) => {
    const user = c.get("user");

    if (!user) {
      throw new StatusError("No user found", 401);
    }

    const blueprints = (await db.query.blueprint.findMany({
      with: {
        result: {
          columns: {
            updatedAt: true,
          },
        },
      },

      // where: (blueprint, { eq }) => eq(blueprint.userId, user.id),
      where: { userId: user.id },
    })) as Blueprint[];

    return c.json({ data: blueprints });
  })
  .get("/:id", zodValidator("param", searchableBlueprint), async (c) => {
    const user = c.get("user");
    const { id } = c.req.valid("param");

    if (!user) {
      throw new StatusError("No user found", 401);
    }

    const searchedBlueprint = (await db.query.blueprint.findFirst({
      where: {
        userId: user.id,
        id,
      },
      // where: (blueprints, { eq, and }) => and(eq(blueprints.id, id), eq(blueprints.userId, user.id)),
      with: {
        result: true,
      },
    })) as Blueprint;

    if (!searchedBlueprint) {
      c.status(404);
      throw new Error(`Item with id '${id}' was not found`);
    }

    return c.json({ data: searchedBlueprint });
  })
  .post("/", zodValidator("json", editableBlueprintSchema), async (c) => {
    const body = await c.req.valid("json");
    const createdBlueprint = await db
      .insert(schema.blueprint)
      .values({
        ...body,
      })
      .returning();

    return c.json({ data: createdBlueprint[0] });
  })
  .delete("/:id", zodValidator("param", searchableBlueprint), async (c) => {
    const { id } = c.req.param();

    await db.query.blueprint
      .findFirst({
        where: {
          id,
        },
      })
      .catch(() => {
        c.status(404);
        throw new Error(`Item with id '${id}' was not found`);
      });

    const removedBlueprint = await db.delete(schema.blueprint).where(eq(schema.blueprint.id, id)).returning();

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
        c.status(404);
        throw new Error(`Item with id '${id}' was not found`);
      });

    const updatedBlueprint = await db
      .update(schema.blueprint)
      .set({ ...body })
      .where(eq(schema.blueprint.id, id))
      .returning();

    return c.json({ data: updatedBlueprint[0] });
  });

export default app;
