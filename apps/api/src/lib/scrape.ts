import { apiScraper } from "@scrapeek/scrapers/legacy/api";
import { dynamicSiteScraper } from "@scrapeek/scrapers/legacy/dynamic";
import { staticSiteScraper } from "@scrapeek/scrapers/legacy/static";
import type { Blueprint } from "@scrapeek/shared/blueprint";
import { StatusError } from "@/lib/error.ts";
import { StaticScraper } from "@scrapeek/scrapers/new/static";
import { APIScraper } from "@scrapeek/scrapers/new/api";
import { DynamicScraper } from "@scrapeek/scrapers/new/dynamic";

export const scrapeData = async (blueprints: Blueprint[], testRun = false) => {
  const scrapersToRun = blueprints.map((blueprint) => {
    if (blueprint.type === "static") {
      const staticScraper = new StaticScraper(blueprint, { isTestRun: testRun });
      return staticScraper.scrape();
      // return staticSiteScraper(blueprint, testRun);
    }
    if (blueprint.type === "api") {
      const apiScraper = new APIScraper(blueprint, { isTestRun: testRun });
      return apiScraper.scrape();
      // return apiScraper(blueprint, testRun);
    }
    if (blueprint.type === "dynamic") {
      const dynamicScraper = new DynamicScraper(blueprint, { isTestRun: testRun });
      return dynamicScraper.scrape();
      // return dynamicSiteScraper(blueprint, testRun)
    }
    return staticSiteScraper(blueprint, testRun);
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
