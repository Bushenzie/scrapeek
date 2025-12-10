import type { Blueprint } from "@scrapeek/shared/blueprint";

export type ScraperOptions = {
  isTestRun?: boolean;
  ignorePagination?: boolean;
};

export interface IScraper {
  blueprint: Blueprint;
  options?: ScraperOptions;
  scrape: () => Promise<Record<string, any>>;
}
