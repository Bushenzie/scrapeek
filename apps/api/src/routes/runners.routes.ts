import { schema } from "@scrapeek/db/schema"
import { type Blueprint, blueprintSchema } from "@scrapeek/db/validators"
import { eq, sql } from "drizzle-orm"
import { Hono } from "hono"
import { z } from "zod"
import { db } from "@/lib/db.ts"
import { scrapeData } from "@/lib/scrape.ts"
import { zodValidator } from "@/middlewares/custom-zod-validator.ts"
import { StatusError } from "@/lib/error"
import { StatusCodes } from "http-status-codes"
import {performance} from "perf_hooks"

const app = new Hono().post(
  "/",
  zodValidator(
    "json",
    z.object({
      id: z.uuid(),
      mode: z.union([z.literal("test"), z.literal("normal")]).optional(),
    }),
  ),
  async (c) => {
    const { id, mode } = await c.req.valid("json")

    const blueprint = await db.query.blueprint.findFirst({
      where: {
        id,
      },
    })

    if (!blueprint) throw new StatusError("No blueprint found", StatusCodes.NOT_FOUND)

    const parsedBlueprint = blueprintSchema.parse(blueprint)

    const isTestRun = mode === "test"

    const start = performance.now();
    const results = await scrapeData([parsedBlueprint], isTestRun)
    const end = performance.now();

    if (!isTestRun) {
      const existingResult = await db.query.result.findFirst({
        where: {
          blueprintId: parsedBlueprint.id,
        },
      })

      if (!existingResult) {
        await db.insert(schema.result).values({ blueprintId: parsedBlueprint.id, data: results[0] })
      } else {
        await db
          .update(schema.result)
          .set({
            data: results[0],
            updatedAt: sql`NOW()`,
          })
          .where(eq(schema.result.blueprintId, parsedBlueprint.id))
      }
    }

    return c.json({ results, duration: (end - start).toFixed(3) })
  },
)

export default app
