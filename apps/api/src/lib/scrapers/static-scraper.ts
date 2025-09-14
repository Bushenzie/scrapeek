import type { Blueprint } from "@scrapeek/shared/blueprint";
import * as cheerio from "cheerio";
import { axiosClient } from "../utils.ts";

export const staticSiteScraper = async (
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
