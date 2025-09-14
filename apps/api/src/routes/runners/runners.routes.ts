import type { Blueprint } from "@scrapeek/shared/blueprint";
import { inArray } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "@/db/db.ts";
import { blueprintTable } from "@/db/schemas/blueprint.ts";
import { scrapeData } from "@/lib/scrapers/index.ts";
import { zodValidator } from "@/middlewares/custom-zod-validator.ts";
import { runnerSchema } from "./runners.schemas.ts";

const app = new Hono();

app.post("/", zodValidator("json", runnerSchema), async (c) => {
  const { blueprintIds, mode } = await c.req.valid("json");

  const blueprints = (await db
    .select()
    .from(blueprintTable)
    .where(inArray(blueprintTable.id, blueprintIds))
    .catch(() => {
      throw new Error("No blueprints found");
    })) as Blueprint[];

  const isTestRun = mode === "test";

  const data = await scrapeData(blueprints, isTestRun);

  return c.json(data);
});

export default app;
