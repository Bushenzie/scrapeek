import {
  type Blueprint,
  editableBlueprintSchema,
} from "@scrapeek/shared/blueprint";
import { count, desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "@/db/db.ts";
import { user as userTable } from "@/db/schemas/auth.ts";
import { blueprintTable } from "@/db/schemas/blueprint.ts";
import { upvoteTable } from "@/db/schemas/upvote.ts";
import type { AuthType } from "@/lib/auth.ts";
import { StatusError } from "@/lib/error.ts";
import { authMiddleware } from "@/middlewares/auth-middleware.ts";
import { zodValidator } from "@/middlewares/custom-zod-validator.ts";
import {
  paginatedBlueprint,
  searchableBlueprint,
} from "./blueprints.schemas.ts";

const paginationLimit = 10;

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
        ...getTableColumns(blueprintTable),
        user: {
          name: userTable.name,
          image: userTable.image,
        },
        upvotes: count(upvoteTable.id).as("upvotes"),
      })
      .from(blueprintTable)
      .leftJoin(userTable, eq(blueprintTable.userId, userTable.id))
      .leftJoin(upvoteTable, eq(upvoteTable.blueprintId, blueprintTable.id))
      .where(eq(blueprintTable.public, true))
      .groupBy(blueprintTable.id, userTable.id, userTable.name, userTable.image)
      .orderBy(desc(count(upvoteTable.id)))
      .limit(paginationLimit)
      .offset(paginationLimit * page - paginationLimit);

    const totalCount = await db.select({ count: count() }).from(blueprintTable);

    return c.json({ data: blueprints, totalCount, page });
  })
  .get("/", zodValidator("query", paginatedBlueprint), async (c) => {
    const user = c.get("user");

    if (!user) {
      throw new StatusError("No user found", 401);
    }

    const blueprints = (await db.query.blueprintTable.findMany({
      with: {
        result: {
          columns: {
            updatedAt: true,
          },
        },
      },

      where: (blueprintTable, { eq }) => eq(blueprintTable.userId, user.id),
    })) as Blueprint[];

    return c.json({ data: blueprints });
  })
  .get("/:id", zodValidator("param", searchableBlueprint), async (c) => {
    const { id } = c.req.valid("param");

    // TODO: Check userId
    const searchedBlueprint = (await db.query.blueprintTable.findFirst({
      where: (blueprints, { eq }) => eq(blueprints.id, id),
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
  .put("/:id/upvote", zodValidator("param", searchableBlueprint), async (c) => {
    const { id } = c.req.valid("param");
    const user = c.get("user");

    if (!user) {
      throw new StatusError("No user found", 401);
    }

    const existingUpvote = await db.query.upvoteTable.findFirst({
      where: (upvotes, { eq, and }) =>
        and(eq(upvotes.blueprintId, id), eq(upvotes.userId, user.id)),
    });

    console.log(existingUpvote);

    if (existingUpvote) {
      await db.delete(upvoteTable).where(eq(upvoteTable.id, existingUpvote.id));
    } else {
      await db.insert(upvoteTable).values({ blueprintId: id, userId: user.id });
    }

    return c.json({});
  })
  .post("/", zodValidator("json", editableBlueprintSchema), async (c) => {
    const body = await c.req.valid("json");
    const createdBlueprint = await db
      .insert(blueprintTable)
      .values({
        ...body,
      })
      .returning();

    return c.json({ data: createdBlueprint[0] });
  })
  .delete("/:id", zodValidator("param", searchableBlueprint), async (c) => {
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
  })
  .patch("/:id", zodValidator("json", editableBlueprintSchema), async (c) => {
    const { id } = c.req.param();
    const body = await c.req.valid("json");

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

    return c.json({ data: updatedBlueprint[0] });
  });

export default app;
