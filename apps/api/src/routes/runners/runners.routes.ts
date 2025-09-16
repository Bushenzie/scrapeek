import type { Blueprint } from "@scrapeek/shared/blueprint";
import { eq, inArray, sql } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "@/db/db.ts";
import { blueprintTable } from "@/db/schemas/blueprint.ts";
import { resultTable } from "@/db/schemas/result.ts";
import { scrapeData } from "@/lib/scrapers/index.ts";
import { zodValidator } from "@/middlewares/custom-zod-validator.ts";
import { runnerSchema } from "./runners.schemas.ts";

const app = new Hono();

app.post("/", zodValidator("json", runnerSchema), async (c) => {
  const { blueprintIds, mode } = await c.req.valid("json");

  const blueprints = (await db.query.blueprintTable
    .findMany({
      where: inArray(blueprintTable.id, blueprintIds),
      with: {
        result: true,
      },
    })
    .catch(() => {
      throw new Error("No blueprints found");
    })) as Blueprint[];

  const isTestRun = mode === "test";

  const data = await scrapeData(blueprints, isTestRun);

  if (!isTestRun) {
    const existingResult = await db.query.resultTable.findFirst({
      where: (results, { eq }) => eq(results.blueprintId, blueprints[0].id),
    });

    if (!existingResult) {
      await db
        .insert(resultTable)
        .values({ blueprintId: blueprints[0].id, data: data[0] });
    } else {
      await db
        .update(resultTable)
        .set({
          data: data[0],
          updatedAt: sql`NOW()`,
        })
        .where(eq(resultTable.blueprintId, blueprints[0].id));
    }
  }

  return c.json(data);
});

export default app;
