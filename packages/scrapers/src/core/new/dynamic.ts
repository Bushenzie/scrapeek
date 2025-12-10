import type { DynamicBlueprint } from "@scrapeek/shared/blueprint";
import type { IScraper, ScraperOptions } from "../../types";

export class DynamicScraper implements IScraper {
  blueprint: DynamicBlueprint;
  options?: ScraperOptions;

  constructor(blueprint: DynamicBlueprint, options?: ScraperOptions) {
    this.blueprint = blueprint;
    this.options = options ?? {
      ignorePagination: false,
      isTestRun: false,
    };
  }

  async scrape() {
    return {};
  }
}
