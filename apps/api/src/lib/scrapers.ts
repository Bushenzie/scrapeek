import type { Blueprint } from "@scrapeek/shared/blueprint";
import * as cheerio from "cheerio";
import playwright from "playwright";
import { StatusError } from "./error.ts";
import { axiosClient, getValueFromFlatPath } from "./utils.ts";

const apiScraper = async (
  blueprint: Blueprint,
  testRun?: boolean,
  ignorePagination: boolean = false
) => {
  if (blueprint.type !== "api") return;
  console.log(`API Scrape | ${blueprint.name}`);
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

      if (testRun) {
        if (!items[0]) items[0] = {};
        items[0][field.key] = (foundValues ?? [])[0];
        continue;
      }

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

    if (config.pagination && !ignorePagination) {
      const toCheck = config.pagination.fieldToCheck;

      const checkValue = getValueFromFlatPath(data, toCheck);

      const isCheckValueEmptyString =
        typeof checkValue === "string" && !checkValue;
      const isCheckValueEmptyArray =
        Array.isArray(checkValue) && checkValue.length === 0;

      if (isCheckValueEmptyString || isCheckValueEmptyArray) return items;

      switch (config.pagination.type) {
        case "cursor": {
          const { queryKey, path } = config.pagination.path;
          const cursorValue = getValueFromFlatPath(data, path);

          if (!cursorValue) return items;

          let cursorData = await apiScraper(
            {
              ...blueprint,
              config: {
                ...config,
                query: {
                  [queryKey]: cursorValue as string,
                },
              },
            },
            testRun,
            testRun
          );

          if (!cursorData) cursorData = [];

          items = [...items, ...cursorData];

          break;
        }
        case "nextPage": {
          const nextPagePath = config.pagination.path;
          const nextPageValue = getValueFromFlatPath(data, nextPagePath);
          if (!nextPageValue) return items;

          const nextPageUrl = `${config.apiBaseUrl}${nextPageValue}`;
          let nextPageData = await apiScraper(
            {
              ...blueprint,
              url: nextPageUrl,
            },
            testRun,
            testRun
          );

          if (!nextPageData) nextPageData = [];

          items = [...items, ...nextPageData];
          break;
        }
        case "offsetLimit": {
          const { queryKey: offsetQueryKey, value: offsetNumber } =
            config.pagination.offset;
          const { queryKey: limitQueryKey, value: limitNumber } =
            config.pagination.limit;

          const newOffsetValue = offsetNumber + limitNumber;

          let nextOffsetData = await apiScraper(
            {
              ...blueprint,
              config: {
                ...config,
                pagination: {
                  ...config.pagination,
                  offset: { queryKey: offsetQueryKey, value: newOffsetValue },
                },
                query: {
                  [offsetQueryKey]: newOffsetValue,
                  [limitQueryKey]: limitNumber,
                },
              },
            },
            testRun,
            testRun
          );

          if (!nextOffsetData) nextOffsetData = [];

          items = [...items, ...nextOffsetData];

          break;
        }
        case "pageSize": {
          const { queryKey: pageQueryKey, value: pageNumber } =
            config.pagination.page;
          const { queryKey: sizeQueryKey, value: sizeNumber } =
            config.pagination.size;

          const newPageNumber = pageNumber + 1;

          let nextPageIncrementedData = await apiScraper(
            {
              ...blueprint,
              config: {
                ...config,
                pagination: {
                  ...config.pagination,
                  // page: [pageQuery, newPage],
                  page: {
                    queryKey: pageQueryKey,
                    value: newPageNumber,
                  },
                },
                query: {
                  [pageQueryKey]: newPageNumber,
                  [sizeQueryKey]: sizeNumber,
                },
              },
            },
            testRun,
            testRun
          );

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

const staticSiteScraper = async (
  blueprint: Blueprint,
  testRun?: boolean,
  ignorePagination: boolean = false
) => {
  if (blueprint.type !== "static") return;
  console.log(`STATIC Scrape | ${blueprint.name}`);
  const { config } = blueprint;

  try {
    const response = await axiosClient.get(blueprint.url);

    const $ = cheerio.load(response.data);

    let items: any[] = [];

    for (const element of config.elements) {
      const isPlainSelector = element.attribute === undefined;

      if (testRun) {
        const $item = $(element.selector).first();
        if (!items[0]) items[0] = {};
        let itemValue = "";
        if (isPlainSelector) {
          itemValue = $item.text().trim() ?? "";
        } else {
          itemValue = $item.attr(element.attribute!) ?? "";
        }
        items[0][element.key] = itemValue;
        // items[0].page = pageNum;
        continue;
      }

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
          // items[index].page = page;
        });
    }

    if (config.pagination && !ignorePagination) {
      const { selector, attribute } = config.pagination;

      const paginationLink = $(selector).attr(attribute) ?? null;

      if (paginationLink === null) return items;
      const nextPageLink = `${blueprint.baseUrl}${paginationLink}`;

      if (nextPageLink === blueprint.url) return items;

      const newPageUrl = paginationLink.startsWith("http")
        ? paginationLink
        : `${blueprint.baseUrl}${paginationLink}`;
      let nextPageItems = await staticSiteScraper(
        {
          ...blueprint,
          url: newPageUrl,
        },
        testRun,
        // ++page,
        testRun
      );

      if (!nextPageItems) nextPageItems = [];

      items = [...items, ...nextPageItems];
    }
    console.log(`FINISH | STATIC Scrape | ${blueprint.name}`);
    return items;
  } catch (err: unknown) {
    throw new Error(err as any);
  }
};

const dynamicSiteScraper = async (
  blueprint: Blueprint,
  testRun?: boolean,
  ignorePagination: boolean = false
) => {
  if (blueprint.type !== "dynamic") return;
  console.log(`DYNAMIC Scrape | ${blueprint.name}`);
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

    if (testRun) {
      const resultItem = await locator.first().evaluate(
        (item, props) => {
          if (props.isPlainSelector) {
            return item.textContent?.trim() ?? "";
          }
          return item.getAttribute(props.attribute) ?? "";
        },
        {
          key: element.key,
          isPlainSelector,
          attribute: element.attribute!,
        }
      );

      if (!items[0]) items[0] = {};
      items[0][element.key] = resultItem;
      continue;
    }

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

  if (config.pagination && !ignorePagination) {
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
    let nextPageItems = await dynamicSiteScraper(
      {
        ...blueprint,
        url: nextPageLink,
      },
      testRun,
      testRun
    );

    if (!nextPageItems) nextPageItems = [];

    items = [...items, ...nextPageItems];
  }

  await browser.close();
  console.log(`FINISH | DYNAMIC Scrape | ${blueprint.name}`);
  return items;
};

const scrapeData = async (blueprints: Blueprint[], testRun = false) => {
  const scrapersToRun = blueprints.map((blueprint) => {
    if (blueprint.type === "api") return apiScraper(blueprint, testRun);
    if (blueprint.type === "dynamic")
      return dynamicSiteScraper(blueprint, testRun);
    return staticSiteScraper(blueprint, testRun);
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
