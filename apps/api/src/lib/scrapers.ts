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

    let items: any[] = [];

    for (const field of config.fields) {
      const isComposable =
        field.selector.startsWith("$") && field.selector.endsWith("$");
      const foundValues = getValueFromFlatPath(data, field.selector);

      (foundValues ?? []).forEach((item: any, index: number) => {
        if (!items[index]) items[index] = {};
        items[index][field.key] = item;
      });

      if (!isComposable) continue;

      const variableRegex = /(?<=\{).*?(?=\})/gi;
      const cleanedComposable = field.selector.slice(1, -1);

      const matches = cleanedComposable.match(variableRegex) ?? [];

      matches.forEach((match) => {
        const matchValues = getValueFromFlatPath(data, match);

        const isPlainString = typeof matchValues !== "object";

        if (isPlainString) {
          for (let i = 0; i < items.length; i++) {
            if (!items[i][field.key]) items[i][field.key] = cleanedComposable;
            const formatted = items[i][field.key].replaceAll(
              `{${match}}`,
              matchValues
            );
            items[i][field.key] = formatted;
          }
          return;
        }
        matchValues.forEach((item: any, index: number) => {
          if (!items[index][field.key])
            items[index][field.key] = cleanedComposable;
          const formatted = items[index][field.key].replaceAll(
            `{${match}}`,
            item
          );
          items[index][field.key] = formatted;
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

    let items: any[] = [];

    for (const element of config.elements) {
      const isPlainSelector = element.attribute === undefined;

      $(element.selector)
        .toArray()
        .forEach((item, index) => {
          if (!items[index]) items[index] = {};
          let itemValue = "";
          if (isPlainSelector) {
            itemValue = $(item).text().trim() ?? "";
          } else {
            itemValue = $(item).attr(element.attribute!) ?? "";
          }
          items[index][element.key] = itemValue;
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
  let items: any[] = [];

  for (const element of config.elements) {
    const isPlainSelector = element.attribute === undefined;

    const locator = await page.locator(element.selector);

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
        key: element.key,
        isPlainSelector,
        attribute: element.attribute!,
      }
    );

    resultItems.forEach((item, index) => {
      if (!items[index]) items[index] = {};
      items[index][element.key] = item;
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
      { attribute }
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
  } catch (err) {
    throw new StatusError(err as string, 500);
  }
};

export default {
  scrapeData,
  staticSiteScraper,
  apiScraper,
  dynamicSiteScraper,
};
