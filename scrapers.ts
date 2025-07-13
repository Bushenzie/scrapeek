import axios from "axios";
import playwright from "playwright";
import * as cheerio from "cheerio";
import {
  SiteConfigAPIItem,
  SiteConfigDynamicItem,
  SiteConfigStaticItem,
} from "./types";
import { axiosClient, getValueFromFlatPath } from "./utils";

const apiScraper = async (options: SiteConfigAPIItem) => {
  try {
    const response = await axiosClient.get(options.url);
    const data = JSON.parse(response.data);

    let items: (typeof options.fields)[] = [];

    for (let [fieldKey, fieldValue] of Object.entries(options.fields)) {
      const isComposable =
        fieldValue.startsWith("$") && fieldValue.endsWith("$");
      const foundValues = getValueFromFlatPath(data, fieldValue);

      (foundValues ?? []).map((item, index) => {
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
            let formatted = items[i][fieldKey].replaceAll(
              `{${match}}`,
              matchValues
            );
            items[i][fieldKey] = formatted;
          }
          return;
        }
        matchValues.map((item, index) => {
          if (!items[index][fieldKey])
            items[index][fieldKey] = cleanedComposable;
          let formatted = items[index][fieldKey].replaceAll(`{${match}}`, item);
          items[index][fieldKey] = formatted;
        });
      });
    }

    return items;
  } catch (err) {
    throw new Error(err);
  }
};

const staticSiteScraper = async (options: SiteConfigStaticItem) => {
  try {
    const response = await axiosClient.get(options.url);

    const $ = cheerio.load(response.data);

    let items: (typeof options.elements)[] = [];

    for (let [key, selectorProp] of Object.entries(options.elements)) {
      const isPlainSelector = typeof selectorProp === "string";

      $(isPlainSelector ? selectorProp : selectorProp.selector)
        .toArray()
        .map((item, index) => {
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

    if (options.pagination) {
      const { selector, attribute } = options.pagination;

      const paginationLink = $(selector).attr(attribute) ?? null;

      if (paginationLink === null) return items;
      const nextPageLink = `${options.baseUrl}${paginationLink}`;

      if (nextPageLink === options.url) return items;

      const nextPageItems = await staticSiteScraper({
        ...options,
        url: `${options.baseUrl}${paginationLink}`,
      });

      items = [...items, ...nextPageItems];
    }
    return items;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

const dynamicSiteScraper = async (options: SiteConfigDynamicItem) => {
  const browser = await playwright["chromium"].launch({
    headless: true,
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(options.url);

  await page.waitForSelector(options.waitSelectorElement, { timeout: 15000 });
  let items: (typeof options.elements)[] = [];

  for (let [key, selectorProp] of Object.entries(options.elements)) {
    const isPlainSelector = typeof selectorProp === "string";

    const locator = await page.locator(
      isPlainSelector ? selectorProp : selectorProp.selector
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
      }
    );

    resultItems.map((item, index) => {
      if (!items[index]) items[index] = {};
      items[index][key] = item;
    });
  }

  if (options.pagination) {
    const { selector, attribute, type } = options.pagination;

    const isNextPageLinkVisible = await page.isVisible(selector);

    if (!isNextPageLinkVisible) {
      await browser.close();
      return items;
    }

    const locator = await page.locator(selector);

    if (type === "button") {
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

    const nextPageLink = `${options.baseUrl}${paginationLink}`;

    if (options.url === nextPageLink) {
      await browser.close();
      return items;
    }

    await browser.close();
    const nextPageItems = await dynamicSiteScraper({
      ...options,
      url: nextPageLink,
    });

    items = [...items, ...nextPageItems];
  }

  await browser.close();
  return items;
};

export default {
  staticSiteScraper,
  apiScraper,
  dynamicSiteScraper,
};
