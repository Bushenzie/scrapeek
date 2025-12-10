import { apiScraper } from "@scrapeek/scrapers/api";
import { dynamicSiteScraper } from "@scrapeek/scrapers/dynamic";
import { staticSiteScraper } from "@scrapeek/scrapers/static";
import type { Blueprint } from "@scrapeek/shared/blueprint";
import { StatusError } from "@/lib/error.ts";

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
