import axios from "axios";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";
import {
  ScraperOptions,
  SiteConfigAPIItem,
  SiteConfigStaticItem,
} from "./types";
import { axiosClient } from "./utils";

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

const puppeteerScraper = async (options: ScraperOptions) => {};

export default {
  staticSiteScraper,
  apiScraper,
  puppeteerScraper,
};
