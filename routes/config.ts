import { Hono } from "hono";
import type { SiteConfigItem } from "../types/index.ts";
import { readJSON } from "../lib/json.ts";

const app = new Hono();

app.get("/", async (c) => {
  const config = await readJSON<SiteConfigItem[]>("../config.json");

  return c.json(config);
});

app.get("/:id", async (c) => {
  const { id } = c.req.param();
  const config = await readJSON<SiteConfigItem[]>("../config.json");

  const searchedItem = config.find((configItem) => configItem.id === id);

  if (!searchedItem) {
    c.status(404);
    throw new Error(`Item with id '${id}' was not found`);
  }

  return c.json(searchedItem);
});

app.post("/", async (c) => {
  const config = await readJSON<SiteConfigItem[]>("./config.json");

  return c.json(config);
});

export default app;
