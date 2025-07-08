import axios from "axios";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer-extra";
import {
  SiteConfigAPIItem,
  SiteConfigPuppeteerItem,
  SiteConfigStaticItem,
} from "./types";
import { axiosClient } from "./utils";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const staticSiteScraper = async (options: SiteConfigStaticItem) => {
  try {
    const response = await axiosClient.get(options.url);

    const $ = cheerio.load(response.data);

    let items: any[] = [];
    for (let [key, value] of Object.entries(options.elements)) {
      if (typeof value === "string") {
        $(value)
          .toArray()
          .map((item, index) => {
            if (!items[index]) items[index] = {};
            let itemValue = $(item).text().trim() ?? "";
            items[index][key] = itemValue;
          });
      } else {
        $(value.selector)
          .toArray()
          .map((item, index) => {
            if (!items[index]) items[index] = {};
            let itemValue = $(item).attr(value.attribute) ?? "";
            items[index][key] = itemValue;
          });
      }
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

const puppeteerScraper = async (options: SiteConfigPuppeteerItem) => {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36"
  );

  await page.goto(options.url, { waitUntil: "networkidle2" });

  await page.waitForSelector(options.waitSelectorElement, { timeout: 15000 });
  let items: any[] = [];

  for (let [key, value] of Object.entries(options.elements)) {
    if (typeof value === "string") {
      let resultItems = await page.evaluate(
        (value) =>
          [...document.querySelectorAll(value)].map((item, index) =>
            item.textContent?.trim()
          ),
        value
      );

      resultItems.map((item, index) => {
        if (!items[index]) items[index] = {};
        items[index][key] = item;
      });
    } else {
      let resultItems = await page.evaluate(
        (value) =>
          [...document.querySelectorAll(value.selector)].map((item, index) =>
            item.getAttribute(value.attribute)
          ),
        value
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
  puppeteerScraper,
};
