import type { Blueprint } from "@scrapeek/db/validators";

export type ScraperOptions = {
	isTestRun?: boolean;
	ignorePagination?: boolean;
};

export interface IScraper {
	blueprint: Blueprint;
	options?: ScraperOptions;
	scrape: () => Promise<Record<string, any>>;
}
