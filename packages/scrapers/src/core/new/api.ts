import type { APIBlueprint } from "@scrapeek/shared/blueprint";
import type { IScraper, ScraperOptions } from "../../types";
import { parseURL } from "@/utils/url";
import { request } from "undici";
import { getValueFromFlatPath } from "@/utils/path";
import { formatVariables, hasVariables } from "@/utils/template";
import { canScrape } from "@/utils/robots";

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
    try {
      const { config } = this.blueprint;
      const { fields, pagination, method = "GET" } = config;
      const parsedURL = parseURL(this.blueprint.url);

      if (this.blueprint.respectRobotsTxt) {
        const isScrappable = await canScrape(parsedURL.originalUrl);
        if (!isScrappable) throw new Error("Site is forbidden from being scraped due to restriction inside robots.txt");
      }

      const { body } = await request(parsedURL.originalUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Accept-Post": "application/json",
        },
      });
      const data = await body.json();

      let scrapedData: Record<string, string>[] = [];

      for (const { selector, key } of fields) {
        const foundValue = getValueFromFlatPath(data ?? {}, selector);

        if (Array.isArray(foundValue)) {
          foundValue.forEach((value, index) => {
            if (!scrapedData[index]) scrapedData[index] = {};
            scrapedData[index][key] = value;
          });
        } else {
          if (!scrapedData[0]) scrapedData[0] = {};
          scrapedData[0][key] = foundValue;
        }
      }

      const shouldPaginate = pagination !== undefined && !this.options?.ignorePagination;

      if (shouldPaginate) {
        switch (pagination.type) {
          case "cursor": {
            const { queryKey, path } = pagination.path;
            const cursorValue = getValueFromFlatPath(data ?? {}, path);

            if (!cursorValue) return scrapedData;

            this.blueprint.config.query = {
              [queryKey]: cursorValue as string,
            };

            const newlyScrapedData = (await this.scrape()) ?? [];

            scrapedData = [...scrapedData, ...newlyScrapedData];

            break;
          }
          case "nextPage": {
            const nextPagePath = pagination.path;
            const nextPageValue = getValueFromFlatPath(data ?? {}, nextPagePath);
            if (!nextPageValue) return scrapedData;

            const nextPageUrl = `${parsedURL.protocol}://${parsedURL.hostname}${nextPageValue}`;

            this.blueprint.url = nextPageUrl;

            const newlyScrapedData = (await this.scrape()) ?? [];

            scrapedData = [...scrapedData, ...newlyScrapedData];

            break;
          }
          case "offsetLimit": {
            const { queryKey: offsetQueryKey, value: offsetNumber } = pagination.offset;
            const { queryKey: limitQueryKey, value: limitNumber } = pagination.limit;

            const newOffsetValue = offsetNumber + limitNumber;

            this.blueprint.config = {
              ...config,
              pagination: {
                ...pagination,
                offset: { queryKey: offsetQueryKey, value: newOffsetValue },
              },
              query: {
                [offsetQueryKey]: newOffsetValue,
                [limitQueryKey]: limitNumber,
              },
            };

            const newlyScrapedData = (await this.scrape()) ?? [];

            scrapedData = [...scrapedData, ...newlyScrapedData];

            break;
          }
          case "pageSize": {
            const { queryKey: pageQueryKey, value: pageNumber } = pagination.page;
            const { queryKey: sizeQueryKey, value: sizeNumber } = pagination.size;

            const newPageNumber = pageNumber + 1;

            this.blueprint.config = {
              ...config,
              pagination: {
                ...pagination,
                page: {
                  queryKey: pageQueryKey,
                  value: newPageNumber,
                },
              },
              query: {
                [pageQueryKey]: newPageNumber,
                [sizeQueryKey]: sizeNumber,
              },
            };

            const newlyScrapedData = (await this.scrape()) ?? [];

            scrapedData = [...scrapedData, ...newlyScrapedData];

            break;
          }
        }
      }

      return scrapedData;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
}
