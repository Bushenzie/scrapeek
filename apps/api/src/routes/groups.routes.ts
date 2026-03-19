import { schema } from "@scrapeek/db/schema"
import { groupInsertSchema, groupUpdateSchema } from "@scrapeek/db/validators"
import { eq } from "drizzle-orm"
import { Hono } from "hono"
import { StatusCodes } from "http-status-codes"
import z from "zod"
import type { AuthType } from "@/lib/auth"
import { db } from "@/lib/db"
import { StatusError } from "@/lib/error"
import { authMiddleware } from "@/middlewares/auth-middleware"
import { zodValidator } from "@/middlewares/custom-zod-validator"

const app = new Hono<{ Variables: AuthType }>()
  .use(authMiddleware)
  .get("/", async (c) => {
    const user = c.get("user")

    if (!user) {
      throw new StatusError("No user found", StatusCodes.UNAUTHORIZED)
    }

    const groups = await db.query.group.findMany({
      where: {
        userId: user.id,
      },
      with: {
        blueprints: true,
      },
    })

    return c.json({ data: groups })
  })
  .post("/", zodValidator("json", groupInsertSchema), async (c) => {
    const user = c.get("user")
    const { name } = c.req.valid("json")

    if (!user) {
      throw new StatusError("No user found", StatusCodes.UNAUTHORIZED)
    }

    const createdGroup = await db
      .insert(schema.group)
      .values({
        name,
        userId: user.id,
      })
      .returning()

    return c.json({ data: createdGroup[0] })
  })
  .put(
    "/",
    zodValidator(
      "json",
      z.object({
        blueprintId: z.string(),
        groupIds: z.string().array(),
      }),
    ),
    async (c) => {
      const user = c.get("user")
      const { blueprintId, groupIds } = c.req.valid("json")

      if (!user) {
        throw new StatusError("No user found", StatusCodes.UNAUTHORIZED)
      }

      const createdBlueprintGroups = await db
        .insert(schema.blueprintGroup)
        .values(
          groupIds.map((groupId) => ({
            blueprintId,
            groupId,
          })),
        )
        .returning()

      return c.json({ data: createdBlueprintGroups })
    },
  )
  .patch("/:id", zodValidator("json", groupUpdateSchema), async (c) => {
    const user = c.get("user")
    const id = c.req.param("id")
    const { name } = c.req.valid("json")

    if (!user) {
      throw new StatusError("No user found", StatusCodes.UNAUTHORIZED)
    }

    await db.query.group
      .findFirst({
        where: {
          userId: user.id,
          id,
        },
      })
      .catch(() => {
        throw new StatusError(`Group with id '${id}' was not found`, StatusCodes.NOT_FOUND)
      })

    const updatedGroup = await db
      .update(schema.group)
      .set({
        name,
      })
      .where(eq(schema.group.id, id))
      .returning()

    return c.json({ data: updatedGroup })
  })
  .delete("/:id", async (c) => {
    const user = c.get("user")
    const id = c.req.param("id")

    if (!user) {
      throw new StatusError("No user found", StatusCodes.UNAUTHORIZED)
    }

    await db.query.group
      .findFirst({
        where: {
          userId: user.id,
          id,
        },
      })
      .catch(() => {
        throw new StatusError(`Group with id '${id}' was not found`, StatusCodes.NOT_FOUND)
      })

    const deletedGroup = await db.delete(schema.group).where(eq(schema.group.id, id)).returning()

    return c.json({ data: deletedGroup })
  })

export default app
