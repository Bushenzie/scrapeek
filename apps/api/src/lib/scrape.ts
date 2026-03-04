import type { Blueprint } from "@scrapeek/db/validators";
import { APIScraper } from "@scrapeek/scrapers/api";
import { DynamicScraper } from "@scrapeek/scrapers/dynamic";
import { StaticScraper } from "@scrapeek/scrapers/static";
import { StatusError } from "@/lib/error.ts";

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
