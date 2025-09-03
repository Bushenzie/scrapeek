import type { Blueprint } from "@scrapeek/shared/blueprint";
import * as cheerio from "cheerio";
import playwright from "playwright";
import { StatusError } from "./error.ts";
import { axiosClient, getValueFromFlatPath } from "./utils.ts";

const apiScraper = async (blueprint: Blueprint) => {
	if (blueprint.type !== "api") return;
	console.log(`FINISH | API Scrape | ${blueprint.name}`);
	const { config } = blueprint;

	try {
		const response = await axiosClient.get(blueprint.url, {
			params: config.query,
		});
		const data = JSON.parse(response.data);

		let items: (typeof config.fields)[] = [];

		for (const [fieldKey, fieldValue] of Object.entries(config.fields)) {
			const isComposable = fieldValue.startsWith("$") && fieldValue.endsWith("$");
			const foundValues = getValueFromFlatPath(data, fieldValue);

			(foundValues ?? []).forEach((item: any, index: number) => {
				if (!items[index]) items[index] = {};
				items[index][fieldKey] = item;
			});

			if (!isComposable) continue;

			const variableRegex = /(?<=\{).*?(?=\})/gi;
			const cleanedComposable = fieldValue.slice(1, -1);

			const matches = cleanedComposable.match(variableRegex) ?? [];

			matches.forEach((match) => {
				const matchValues = getValueFromFlatPath(data, match);

				const isPlainString = typeof matchValues !== "object";

				if (isPlainString) {
					for (let i = 0; i < items.length; i++) {
						if (!items[i][fieldKey]) items[i][fieldKey] = cleanedComposable;
						const formatted = items[i][fieldKey].replaceAll(
							`{${match}}`,
							matchValues,
						);
						items[i][fieldKey] = formatted;
					}
					return;
				}
				matchValues.forEach((item: any, index: number) => {
					if (!items[index][fieldKey]) items[index][fieldKey] = cleanedComposable;
					const formatted = items[index][fieldKey].replaceAll(`{${match}}`, item);
					items[index][fieldKey] = formatted;
				});
			});
		}

		if (config.pagination) {
			const toCheck = config.pagination.fieldToCheck;

			const checkValue = getValueFromFlatPath(data, toCheck);

			const isCheckValueEmptyString =
				typeof checkValue === "string" && !checkValue;
			const isCheckValueEmptyArray =
				Array.isArray(checkValue) && checkValue.length === 0;

			if (isCheckValueEmptyString || isCheckValueEmptyArray) return items;

			switch (config.pagination.type) {
				case "cursor": {
					const [cursorQuery, cursorPath] = config.pagination.path;
					const cursorValue = getValueFromFlatPath(data, cursorPath);

					if (!cursorValue) return items;

					let cursorData = await apiScraper({
						...blueprint,
						config: {
							...config,
							query: {
								[cursorQuery]: cursorValue as string,
							},
						},
					});

					if (!cursorData) cursorData = [];

					items = [...items, ...cursorData];

					break;
				}
				case "nextPage": {
					const nextPagePath = config.pagination.path;
					const nextPageValue = getValueFromFlatPath(data, nextPagePath);
					if (!nextPageValue) return items;

					const nextPageUrl = `${config.apiBaseUrl}${nextPageValue}`;
					let nextPageData = await apiScraper({
						...blueprint,
						url: nextPageUrl,
					});

					if (!nextPageData) nextPageData = [];

					items = [...items, ...nextPageData];
					break;
				}
				case "offsetLimit": {
					const [offsetQuery, offsetNum] = config.pagination.offset;
					const [limitQuery, limitNum] = config.pagination.limit;

					const newOffset = offsetNum + limitNum;

					let nextOffsetData = await apiScraper({
						...blueprint,
						config: {
							...config,
							pagination: {
								...config.pagination,
								offset: [offsetQuery, newOffset],
							},
							query: {
								[offsetQuery]: newOffset,
								[limitQuery]: limitNum,
							},
						},
					});

					if (!nextOffsetData) nextOffsetData = [];

					items = [...items, ...nextOffsetData];

					break;
				}
				case "pageSize": {
					const [pageQuery, pageNum] = config.pagination.page;
					const [sizeQuery, sizeNum] = config.pagination.size;

					const newPage = pageNum + 1;

					let nextPageIncrementedData = await apiScraper({
						...blueprint,
						config: {
							...config,
							pagination: {
								...config.pagination,
								page: [pageQuery, newPage],
							},
							query: {
								[pageQuery]: newPage,
								[sizeQuery]: sizeNum,
							},
						},
					});

					if (!nextPageIncrementedData) nextPageIncrementedData = [];

					items = [...items, ...nextPageIncrementedData];
					break;
				}
			}
		}
		console.log(`FINISH | API Scrape | ${blueprint.name}`);
		return items;
	} catch (err: unknown) {
		throw new Error(err as any);
	}
};

const staticSiteScraper = async (blueprint: Blueprint) => {
	if (blueprint.type !== "static") return;
	console.log(`START | STATIC Scrape | ${blueprint.name}`);
	const { config } = blueprint;

	try {
		const response = await axiosClient.get(blueprint.url);

		const $ = cheerio.load(response.data);

		let items: (typeof config.elements)[] = [];

		for (const [key, selectorProp] of Object.entries(config.elements)) {
			const isPlainSelector = typeof selectorProp === "string";

			$(isPlainSelector ? selectorProp : selectorProp.selector)
				.toArray()
				.forEach((item, index) => {
					if (!items[index]) items[index] = {};
					let itemValue = "";
					if (isPlainSelector) {
						itemValue = $(item).text().trim() ?? "";
					} else {
						itemValue = $(item).attr(selectorProp.attribute) ?? "";
					}
					items[index][key] = itemValue;
				});
		}

		if (config.pagination) {
			const { selector, attribute } = config.pagination;

			const paginationLink = $(selector).attr(attribute) ?? null;

			if (paginationLink === null) return items;
			const nextPageLink = `${blueprint.baseUrl}${paginationLink}`;

			if (nextPageLink === blueprint.url) return items;

			const newPageUrl = paginationLink.startsWith("http")
				? paginationLink
				: `${blueprint.baseUrl}${paginationLink}`;
			let nextPageItems = await staticSiteScraper({
				...blueprint,
				url: newPageUrl,
			});

			if (!nextPageItems) nextPageItems = [];

			items = [...items, ...nextPageItems];
		}
		console.log(`FINISH | STATIC Scrape | ${blueprint.name}`);
		return items;
	} catch (err: unknown) {
		throw new Error(err as any);
	}
};

const dynamicSiteScraper = async (blueprint: Blueprint) => {
	if (blueprint.type !== "dynamic") return;
	console.log(`START | DYNAMIC Scrape | ${blueprint.name}`);
	const { config } = blueprint;

	const browser = await playwright.chromium.launch({
		headless: true,
	});

	const context = await browser.newContext();
	const page = await context.newPage();

	await page.goto(blueprint.url);

	await page.waitForSelector(config.waitSelectorElement, { timeout: 15000 });
	let items: (typeof config.elements)[] = [];

	for (const [key, selectorProp] of Object.entries(config.elements)) {
		const isPlainSelector = typeof selectorProp === "string";

		const locator = await page.locator(
			isPlainSelector ? selectorProp : selectorProp.selector,
		);

		const resultItems = await locator.evaluateAll(
			(items, props) =>
				items.map((item) => {
					if (props.isPlainSelector) {
						return item.textContent?.trim() ?? "";
					}
					return item.getAttribute(props.attribute) ?? "";
				}),
			{
				items,
				key,
				isPlainSelector,
				attribute: isPlainSelector ? selectorProp : selectorProp.attribute, // TODO
			},
		);

		resultItems.forEach((item, index) => {
			if (!items[index]) items[index] = {};
			items[index][key] = item;
		});
	}

	if (config.pagination) {
		const { selector, attribute, variant } = config.pagination;

		const isNextPageLinkVisible = await page.isVisible(selector);

		if (!isNextPageLinkVisible) {
			await browser.close();
			return items;
		}

		const locator = await page.locator(selector);

		if (variant === "button") {
			await locator.evaluate((item) => (item as HTMLButtonElement).click());
		}

		const paginationLink = await locator.evaluate(
			(item, { attribute }) => item.getAttribute(attribute) ?? null,
			{ attribute },
		);

		if ((await paginationLink) === null) {
			await browser.close();
			return items;
		}

		const nextPageLink = `${blueprint.baseUrl}${paginationLink}`;

		if (blueprint.url === nextPageLink) {
			await browser.close();
			return items;
		}

		await browser.close();
		let nextPageItems = await dynamicSiteScraper({
			...blueprint,
			url: nextPageLink,
		});

		if (!nextPageItems) nextPageItems = [];

		items = [...items, ...nextPageItems];
	}

	await browser.close();
	console.log(`FINISH | DYNAMIC Scrape | ${blueprint.name}`);
	return items;
};

const scrapeData = async (blueprints: Blueprint[]) => {
	const scrapersToRun = blueprints.map((blueprint) => {
		if (blueprint.type === "api") return apiScraper(blueprint);
		if (blueprint.type === "dynamic") return dynamicSiteScraper(blueprint);
		return staticSiteScraper(blueprint);
	});

	try {
		const scrapedData = await Promise.all(scrapersToRun);

		return scrapedData;
	} catch {
		throw new StatusError("Error during scrape", 500);
	}
};

export default {
	scrapeData,
	staticSiteScraper,
	apiScraper,
	dynamicSiteScraper,
};
