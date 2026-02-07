import { apiScraper } from "@scrapeek/scrapers/legacy/api";
import { dynamicSiteScraper } from "@scrapeek/scrapers/legacy/dynamic";
import { staticSiteScraper } from "@scrapeek/scrapers/legacy/static";
import type { Blueprint } from "@scrapeek/shared/blueprint";
import { StatusError } from "@/lib/error.ts";
import { StaticScraper } from "@scrapeek/scrapers/new/static";

export const scrapeData = async (blueprints: Blueprint[], testRun = false) => {
  const scrapersToRun = blueprints.map((blueprint) => {
    if (blueprint.type === "static") {
      const staticScraper = new StaticScraper(blueprint, { isTestRun: testRun });
      return staticScraper.scrape();

      // return staticSiteScraper(blueprint,testRun)
    }
    if (blueprint.type === "api") return apiScraper(blueprint, testRun);
    if (blueprint.type === "dynamic") return dynamicSiteScraper(blueprint, testRun);
    return staticSiteScraper(blueprint, testRun);
  });

  try {
    const scrapedData = await Promise.all(scrapersToRun);

    return scrapedData;
  } catch (err) {
    throw new StatusError(err as string, 500);
  }
};
