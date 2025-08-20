import { Hono } from "hono";
import { readJSON } from "../lib/json.ts";
import scrapers from "../lib/scrapers.ts";
import { zValidator } from "@hono/zod-validator";
import * as z from "zod";
import type { Blueprint } from "../schemas/blueprint.ts";
import { db } from "../db/db.ts";
import { inArray } from "drizzle-orm";
import { blueprintTable } from "../db/schemas/schema.ts";

const app = new Hono();

app.post(
  "/",
  zValidator(
    "json",
    z.object({
      id: z.array(z.string()).min(1),
    })
  ),
  async (c) => {
    const { id } = await c.req.valid("json");

    const blueprints = (await db
      .select()
      .from(blueprintTable)
      .where(inArray(blueprintTable.id, id))
      .catch(() => {
        throw new Error("No blueprints found");
      })) as Blueprint[];

    const data = await scrapers.scrapeData(blueprints);

    return c.json(data);
  }
);

export default app;
