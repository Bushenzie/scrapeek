import type { Blueprint } from "@scrapeek/shared/blueprint";
import * as cheerio from "cheerio";
import { parseURL } from "../url.ts";
import { axiosClient } from "../utils.ts";

export const staticSiteScraper = async (
  blueprint: Blueprint,
  testRun?: boolean,
  ignorePagination: boolean = false
) => {
  if (blueprint.type !== "static") return;
  console.log(`STATIC Scrape | ${blueprint.name}`);
  const { config } = blueprint;
  const parsedUrl = parseURL(blueprint.url);

  try {
    const response = await axiosClient.get(blueprint.url);

    const $ = cheerio.load(response.data);

    let items: Record<string, string>[] = [];

    for (const element of config.elements) {
      if (testRun) {
        const $item = $(element.selector).first();
        if (!items[0]) items[0] = {};
        let itemValue = "";
        if (element.attribute !== undefined) {
          itemValue = $item.attr(element.attribute) ?? "";
        } else {
          itemValue = $item.text().trim() ?? "";
        }
        items[0][element.key] = itemValue;
        continue;
      }

      $(element.selector)
        .toArray()
        .forEach((item, index) => {
          if (!items[index]) items[index] = {};
          let itemValue = "";
          if (element.attribute !== undefined) {
            itemValue = $(item).attr(element.attribute) ?? "";
          } else {
            itemValue = $(item).text().trim() ?? "";
          }
          items[index][element.key] = itemValue;
        });
    }

    if (config.pagination && !ignorePagination) {
      const { selector, attribute } = config.pagination;

      const paginationLink = $(selector).attr(attribute) ?? null;

      if (paginationLink === null) return items;
      const nextPageLink = `${parsedUrl.protocol}://${parsedUrl.domain}${paginationLink}`;

      if (nextPageLink === blueprint.url) return items;

      const newPageUrl = paginationLink.startsWith("http")
        ? paginationLink
        : `${parsedUrl.protocol}://${parsedUrl.domain}${paginationLink}`;
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
  } catch (err) {
    throw new Error((err as Error).message);
  }
};
