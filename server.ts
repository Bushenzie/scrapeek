import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import fs from "node:fs/promises";
import type { SiteConfigItem } from "./types/index.ts";
import scrapers from "./lib/scrapers.ts";

const app = new Hono();

app.use("/api/*", cors());

app.get("/api/config", async (c) => {
  const sitesRaw = await fs.readFile("./sites.json", { encoding: "utf-8" });
  const sites = JSON.parse(sitesRaw) as SiteConfigItem[];
  return c.json(sites);
});

app.get("/api/jobs", async (c) => {
  const sitesRaw = await fs.readFile("./sites.json", { encoding: "utf-8" });
  const config = JSON.parse(sitesRaw) as SiteConfigItem[];

  const data = await scrapers.scrapeData(config);
  return c.json(data);
});

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT ?? 3001),
  },
  (info) => {
    console.log(`Server running | Port: ${info.port}`);
  }
);
