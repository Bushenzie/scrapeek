import type { ElementSelector, StaticBlueprint } from "@scrapeek/db/validators";
import { parseURL, type ParsedURL } from "@scrapeek/shared/utils";
import { HTMLElement, parse } from "node-html-parser";
import type { IScraper, ScraperOptions } from "@/types";
import { canScrape } from "../utils/robots";
import { sleep } from "../utils/sleep";
import { axiosClient } from "../utils/axios";

export class StaticScraper implements IScraper {
	blueprint: StaticBlueprint;
  parsedURL: ParsedURL;
  scrapedData: Record<string, Record<string, string | null>[]>;
  options?: ScraperOptions;

	constructor(blueprint: StaticBlueprint, options?: ScraperOptions) {
		this.blueprint = blueprint;
		this.options = options ?? {
			ignorePagination: false,
			isTestRun: false,
    };
    this.parsedURL = parseURL(this.blueprint.url);
		this.scrapedData = {}
  }

  async checkRobotsTxt() {

    const isScrappable = await canScrape(this.parsedURL.originalUrl);
		if (!isScrappable) {
			throw new Error(
				"Site is forbidden from being scraped due to restriction inside robots.txt",
      );
    }
	}

  async scrapePage(url: string) {
    try {
      console.log(`Scraping page \"${url}\".`)

      if (this.blueprint.respectRobotsTxt) await this.checkRobotsTxt()

      const { data } = await axiosClient(url, { method: "GET" });
      const root = parse(data);

      const values: Record<string, Array<Record<string,string|null>>> = {}

      for (const { key: containerKey, container } of this.blueprint.config.elements) {
        const foundContainers = root.querySelectorAll(container.selector)

        if(!values[containerKey]) values[containerKey] = []

        foundContainers.forEach(cont => {
          let currentObj: Record<string,string|null> = {}
          container.elements.forEach(({ key: elementKey, selector, attribute }) => {
            const foundElement = cont.querySelector(selector);

            if (!foundElement) {
              return {[elementKey]: null}
            }

            currentObj[elementKey] = attribute !== undefined ? foundElement.getAttribute(attribute) ?? null : foundElement.textContent.trim()
          })

          values[containerKey].push(currentObj)
        })
      }

      return {
        data: values,
        root,
      }
    } catch {
      throw new Error(`There was error scraping "${this.parsedURL.originalUrl}" page`);
		}
  }

  async handlePagination(root: HTMLElement) {
    try {
      const { pagination, timeout } = this.blueprint.config
      const { attribute, selector } = pagination!;

      while (true) {

        if (!attribute) break;

        const nextPageLink = root.querySelector(selector)?.getAttribute(attribute);

        if (!nextPageLink || nextPageLink === this.blueprint.url) break;

  			let newPageUrl = nextPageLink.startsWith("http")
  				? nextPageLink
  				: `${this.parsedURL.protocol}://${this.parsedURL.domain}${nextPageLink}`;

   			if (timeout) await sleep(timeout);

   			let {data: newlyScrapedData, root: newRoot} = await this.scrapePage(newPageUrl);
        root = newRoot;

   			for (const key of Object.keys(newlyScrapedData)) {
    				this.scrapedData[key] = [...(this.scrapedData[key] ?? []), ...newlyScrapedData[key]];
   			}
        }

        return this.scrapedData;
    } catch {
      throw new Error(`There was during pagination of "${this.parsedURL.originalUrl}" page`);
    }
  }

	async scrape() {
		try {

			if (this.blueprint.respectRobotsTxt) await this.checkRobotsTxt()

			let {data, root} = await this.scrapePage(this.parsedURL.originalUrl)

			this.scrapedData = data

      if (this.blueprint.config.pagination !== undefined && !this.options?.ignorePagination) {
        await this.handlePagination(root)
			}

			return this.scrapedData;
		} catch (err) {
			throw new Error((err as Error).message);
		}
	}
}
