import type { IScraper, ScraperOptions } from "@/types";
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

      if (pagination !== undefined) {
        const { attribute, selector } = pagination;
        const nextPageElement = root.querySelector(selector);
        if (!nextPageElement) return scrapedData;

        const nextPageLink = nextPageElement.getAttribute(attribute);
        if (!nextPageLink) return scrapedData;

        if (nextPageLink === this.blueprint.url) return scrapedData;

        const newPageUrl = nextPageLink.startsWith("http")
          ? nextPageLink
          : `${parsedURL.protocol}://${parsedURL.domain}${nextPageLink}`;

        this.blueprint = { ...this.blueprint, url: newPageUrl };

        let newlyScrapedData = await this.scrape();

        if (!newlyScrapedData) newlyScrapedData = [];

        scrapedData = [...scrapedData, ...newlyScrapedData];
      }

      return scrapedData;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
}
