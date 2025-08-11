import { Hono } from "hono";
import { readJSON } from "../lib/json.ts";
import type { SiteConfigItem } from "../types/index.ts";
import scrapers from "../lib/scrapers.ts";

const app = new Hono();

app.post("/", async (c) => {
  const { id } = await c.req.json();

  const config = await readJSON<SiteConfigItem[]>("../config.json");

  let items: SiteConfigItem[] = [];
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
});

export default app;
