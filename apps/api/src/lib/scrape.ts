import type { Blueprint } from "@scrapeek/shared/blueprint";
import { StatusError } from "@/lib/error.ts";
import { StaticScraper } from "@scrapeek/scrapers/new/static";
import { APIScraper } from "@scrapeek/scrapers/new/api";
import { DynamicScraper } from "@scrapeek/scrapers/new/dynamic";

export const scrapeData = async (blueprints: Blueprint[], testRun = false) => {
  const scrapersToRun = blueprints.map((blueprint) => {
    if (blueprint.type === "api") {
      const apiScraper = new APIScraper(blueprint, { isTestRun: testRun });
      return apiScraper.scrape();
    }
    if (blueprint.type === "dynamic") {
      const dynamicScraper = new DynamicScraper(blueprint, { isTestRun: testRun });
      return dynamicScraper.scrape();
    }
    const staticScraper = new StaticScraper(blueprint, { isTestRun: testRun });
    return staticScraper.scrape();
  });

  try {
    console.time("scrape");
    const scrapedData = await Promise.all(scrapersToRun);
    console.timeEnd("scrape");

    return scrapedData;
  } catch (err) {
    throw new StatusError(err as string, 500);
  }
};
