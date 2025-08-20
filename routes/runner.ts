import { Hono } from "hono";
import { readJSON } from "../lib/json.ts";
import scrapers from "../lib/scrapers.ts";
import { zValidator } from "@hono/zod-validator";
import * as z from "zod";
import type { Blueprint } from "../schemas/blueprint.ts";

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

    const config = await readJSON<Blueprint[]>("../config.json");

    let items: Blueprint[] = [];
    if (Array.isArray(id)) {
      items = config.filter((configItem) => id.includes(configItem.id));
    } else {
      const searchedItem = config.find((configItem) => configItem.id === id);
      if (searchedItem) items.push(searchedItem);
    }

    if (items.length === 0) {
      c.status(404);
      throw new Error(`Item with id '${id}' was not found`);
    }

    const data = await scrapers.scrapeData(items);

    return c.json(data);
  }
);

export default app;
