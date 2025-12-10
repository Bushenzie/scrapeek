import type { StaticBlueprint } from "@scrapeek/shared/blueprint";
import { parse } from "node-html-parser";
import { request } from "undici";
import type { IScraper, ScraperOptions } from "@/types";
import { parseURL } from "@/utils/url";

export class StaticScraper implements IScraper {
  blueprint: StaticBlueprint;
  options?: ScraperOptions;

  constructor(blueprint: StaticBlueprint, options?: ScraperOptions) {
    this.blueprint = blueprint;
    this.options = options ?? {
      ignorePagination: false,
      isTestRun: false,
    };
  }

  async scrape() {
    try {
      const { config } = this.blueprint;
      const parsedURL = parseURL(this.blueprint.url);

      const { body } = await request(parsedURL.originalUrl, { method: "GET" });
      const data = await body.text();

      const root = parse(data);
    } catch (err) {
      throw new Error((err as Error).message);
    }

    return {};
  }
}
