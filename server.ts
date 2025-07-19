import { serve } from "@hono/node-server";
import { Hono } from "hono";
import fs from "node:fs/promises";
import type { SiteConfigItem } from "./types.ts";
import scrapers from "./lib/scrapers.ts";

const app = new Hono();

app.get("/config", async (c) => {
  const sitesRaw = await fs.readFile("./sites.json", { encoding: "utf-8" });
  const sites = JSON.parse(sitesRaw) as SiteConfigItem[];
  return c.json(sites);
});

app.get("/jobs", async (c) => {
  const sitesRaw = await fs.readFile("./sites.json", { encoding: "utf-8" });
  const config = JSON.parse(sitesRaw) as SiteConfigItem[];

  const data = await scrapers.scrapeData(config);
  return c.json(data);
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
