import type { APIBlueprint } from "@scrapeek/shared/blueprint";
import type { IScraper, ScraperOptions } from "../../types";

export class APIScraper implements IScraper {
  blueprint: APIBlueprint;
  options?: ScraperOptions;

  constructor(blueprint: APIBlueprint, options?: ScraperOptions) {
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
