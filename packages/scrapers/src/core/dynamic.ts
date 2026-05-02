import type { DynamicBlueprint } from "@scrapeek/db/validators";
import { parseURL } from "@scrapeek/shared/utils";
import { chromium, type ElementHandle } from "patchright";
import type { IScraper, ScraperOptions } from "@/types";
import { canScrape } from "../utils/robots";
import { sleep } from "../utils/sleep";

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
		try {
			const { config } = this.blueprint;
			const { elements, waitSelectorElement, pagination, timeout } = config;
			const parsedURL = parseURL(this.blueprint.url);

			if (this.blueprint.respectRobotsTxt) {
				const isScrappable = await canScrape(parsedURL.originalUrl);
				if (!isScrappable)
					throw new Error(
						"Site is forbidden from being scraped due to restriction inside robots.txt",
					);
			}

			const browser = await chromium.launch({
				headless: true,
			});

			const context = await browser.newContext();
			const page = await context.newPage();

			await page.goto(this.blueprint.url);

			await page.waitForSelector(waitSelectorElement, { timeout: 15000 });

			let scrapedData: Record<string, string>[] = [];

			for (const { key, selector, attribute } of elements) {
				const locator = await page.locator(selector);

				const foundItems = await locator.evaluateAll(
					(scrapedData, props) =>
						scrapedData.map((item) => {
							if (props.attribute) {
								return item.getAttribute(props.attribute) ?? "";
							}
							return item.textContent?.trim() ?? "";
						}),
					{
						scrapedData,
						key,
						attribute,
					},
				);

				foundItems.forEach((item, index) => {
					if (!scrapedData[index]) scrapedData[index] = {};
					scrapedData[index][key] = item;
				});
			}

			const shouldPaginate =
				pagination !== undefined && !this.options?.ignorePagination;

			if (shouldPaginate) {
				const { selector, attribute, variant } = pagination;

				const isNextPageLinkVisible = await page.isVisible(selector);

				if (!isNextPageLinkVisible) {
					await browser.close();
					return scrapedData;
				}

				const locator = await page.locator(selector);

				if (variant === "button") {
					await locator.evaluate((item) =>
						(item as unknown as ElementHandle).click(),
					);
				}

				const paginationLink = await locator.evaluate(
					(item, { attribute }) => attribute ? (item.getAttribute(attribute) ?? null) : null,
					{
						attribute,
					},
				);

				if (paginationLink === null) {
					await browser.close();
					return scrapedData;
				}

				const nextPageLink = `${parsedURL.protocol}://${parsedURL.domain}${paginationLink}`;

				if (this.blueprint.url === nextPageLink) {
					await browser.close();
					return scrapedData;
				}

				await browser.close();

				this.blueprint.url = nextPageLink;

				if (timeout) await sleep(timeout);

				const newlyScrapedData = (await this.scrape()) ?? [];

				scrapedData = [...scrapedData, ...newlyScrapedData];
			}

			await browser.close();

			return scrapedData;
		} catch (err) {
			throw new Error((err as Error).message);
		}
	}
}
