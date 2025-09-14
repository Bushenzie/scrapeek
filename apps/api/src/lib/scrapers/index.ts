import type { Blueprint } from "@scrapeek/shared/blueprint";
import { StatusError } from "../error.ts";
import { apiScraper } from "./api-scraper.ts";
import { dynamicSiteScraper } from "./dynamic-scraper.ts";
import { staticSiteScraper } from "./static-scraper.ts";

export const scrapeData = async (blueprints: Blueprint[], testRun = false) => {
  const scrapersToRun = blueprints.map((blueprint) => {
    if (blueprint.type === "api") return apiScraper(blueprint, testRun);
    if (blueprint.type === "dynamic")
      return dynamicSiteScraper(blueprint, testRun);
    return staticSiteScraper(blueprint, testRun);
  });

  try {
    const scrapedData = await Promise.all(scrapersToRun);

    return scrapedData;
  } catch (err) {
    throw new StatusError(err as string, 500);
  }
};
