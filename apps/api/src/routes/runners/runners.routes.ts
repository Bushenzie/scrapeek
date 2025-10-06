import type { Blueprint } from "@scrapeek/shared/blueprint";
import { eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "@/db/db.ts";
import { blueprintTable } from "@/db/schemas/blueprint.ts";
import { resultTable } from "@/db/schemas/result.ts";
import { StatusError } from "@/lib/error.ts";
import { canScrape } from "@/lib/robots.ts";
import { scrapeData } from "@/lib/scrapers/index.ts";
import { zodValidator } from "@/middlewares/custom-zod-validator.ts";
import { runnerSchema } from "./runners.schemas.ts";

const app = new Hono().post(
  "/",
  zodValidator("json", runnerSchema),
  async (c) => {
    const { blueprintId, mode } = await c.req.valid("json");

    const blueprint = (await db.query.blueprintTable
      .findFirst({
        where: eq(blueprintTable.id, blueprintId),
      })
      .catch(() => {
        throw new Error("No blueprints found");
      })) as Blueprint;

    const isTestRun = mode === "test";

    const data = await scrapeData([blueprint], isTestRun);

    if (blueprint.respectRobotsTxt) {
      const isScrappable = await canScrape(blueprint.url);
      if (!isScrappable)
        throw new StatusError(
          "This page could not be scraped as it is disallowed inside robots.txt",
          401
        );
    }

    if (!isTestRun) {
      const existingResult = await db.query.resultTable.findFirst({
        where: (results, { eq }) => eq(results.blueprintId, blueprint.id),
      });

      if (!existingResult) {
        await db
          .insert(resultTable)
          .values({ blueprintId: blueprint.id, data: data[0] });
      } else {
        await db
          .update(resultTable)
          .set({
            data: data[0],
            updatedAt: sql`NOW()`,
          })
          .where(eq(resultTable.blueprintId, blueprint.id));
      }
    }

    return c.json(data);
  }
);

export default app;
