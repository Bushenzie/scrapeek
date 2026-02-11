import type { IScraper, ScraperOptions } from "@/types";
import { canScrape } from "@/utils/robots";
import { parseURL } from "@/utils/url";
import type { StaticBlueprint } from "@scrapeek/shared/blueprint";
import { parse } from "node-html-parser";
import { request } from "undici";

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
      const { elements, pagination } = config;
      const parsedURL = parseURL(this.blueprint.url);

      if (this.blueprint.respectRobotsTxt) {
        const isScrappable = await canScrape(parsedURL.originalUrl);
        if (!isScrappable) throw new Error("Site is forbidden from being scraped due to restriction inside robots.txt");
      }

      const { body } = await request(parsedURL.originalUrl, { method: "GET" });
      const data = await body.text();

      const root = parse(data);

      let scrapedData: Record<string, string>[] = [];

      for (const { key, selector, attribute } of elements) {
        const foundElements = root.querySelectorAll(selector);
        // const isAttributeSearch = element.attribute !== undefined;

        foundElements.forEach((element, index) => {
          let value: string;
          if (attribute !== undefined) {
            value = element.getAttribute(attribute) ?? "";
          } else {
            value = element.textContent.trim();
          }

          if (!scrapedData[index]) scrapedData[index] = {};
          scrapedData[index][key] = value;
        });
      }

      const shouldPaginate = pagination !== undefined && !this.options?.ignorePagination;

      if (shouldPaginate) {
        const { attribute, selector } = pagination;
        const nextPageLink = root.querySelector(selector)?.getAttribute(attribute);
        if (!nextPageLink) return scrapedData;

        if (nextPageLink === this.blueprint.url) return scrapedData;

        const newPageUrl = nextPageLink.startsWith("http")
          ? nextPageLink
          : `${parsedURL.protocol}://${parsedURL.domain}${nextPageLink}`;

        this.blueprint.url = newPageUrl;

        const newlyScrapedData = (await this.scrape()) ?? [];

        scrapedData = [...scrapedData, ...newlyScrapedData];
      }

      return scrapedData;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
}
