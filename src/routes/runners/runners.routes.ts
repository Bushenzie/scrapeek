import { inArray } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "@/db/db.ts";
import { blueprintTable } from "@/db/schemas/blueprint.ts";
import scrapers from "@/lib/scrapers.ts";
import { zodValidator } from "@/middlewares/custom-zod-validator.ts";
import type { Blueprint } from "@/schemas/blueprint.ts";
import { runnerSchema } from "./runners.schemas.ts";

const app = new Hono();

app.post("/", zodValidator("json", runnerSchema), async (c) => {
  const { blueprintIds } = await c.req.valid("json");

  const blueprints = (await db
    .select()
    .from(blueprintTable)
    .where(inArray(blueprintTable.id, blueprintIds))
    .catch(() => {
      throw new Error("No blueprints found");
    })) as Blueprint[];

  const data = await scrapers.scrapeData(blueprints);

  return c.json(data);
});

export default app;
