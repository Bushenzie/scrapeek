import axios from "axios";
import playwright from "playwright";
import * as cheerio from "cheerio";
import {
  SiteConfigAPIItem,
  SiteConfigDynamicItem,
  SiteConfigStaticItem,
} from "./types";
import { axiosClient } from "./utils";

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
          let itemValue: string = "";
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
    throw new Error("There was error during static scrape");
  }
};

const apiScraper = async (options: SiteConfigAPIItem) => {
  try {
    const response = await axiosClient.get(options.url);
    return response.data;
  } catch (err) {
    throw new Error("There was error during api scrape");
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
  let items: any[] = [];

  for (let [key, value] of Object.entries(options.elements)) {
    if (typeof value === "string") {
      let resultItems = await page.$$eval(value, (foundItems) =>
        foundItems.map((item) => item.textContent?.trim())
      );
      resultItems.map((item, index) => {
        if (!items[index]) items[index] = {};
        items[index][key] = item;
      });
    } else {
      let resultItems = await page.$$eval(
        value.selector,
        (foundItems, { value }) =>
          foundItems.map((item) => item.getAttribute(value.attribute)),
        { value }
      );
      resultItems.map((item, index) => {
        if (!items[index]) items[index] = {};
        items[index][key] = item;
      });
    }
  }

  await browser.close();
  return items;
};

export default {
  staticSiteScraper,
  apiScraper,
  dynamicSiteScraper,
};
