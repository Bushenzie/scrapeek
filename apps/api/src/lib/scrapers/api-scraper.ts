import type { Blueprint } from "@scrapeek/shared/blueprint";
import { parseURL } from "../url.ts";
import { axiosClient, getValueFromFlatPath } from "../utils.ts";

export const apiScraper = async (
  blueprint: Blueprint,
  testRun?: boolean,
  ignorePagination: boolean = false
) => {
  if (blueprint.type !== "api") return;
  console.log(`API Scrape | ${blueprint.name}`);
  const { config } = blueprint;
  const parsedUrl = parseURL(blueprint.url);

  try {
    const response = await axiosClient.get(blueprint.url, {
      headers: {
        "Content-Type": "application/json",
      },
      params: config.query,
    });

    const { data } = response;

    let items: any[] = [];

    for (const field of config.fields) {
      const isComposable =
        field.selector.startsWith("$") && field.selector.endsWith("$");
      const foundValues = getValueFromFlatPath(data, field.selector);

      const setItemsValue = (item: any, index: number) => {
        if (!items[index]) items[index] = {};
        items[index][field.key] = item;
      };

      const areValuesArray = Array.isArray(foundValues);
      if (testRun) {
        if (areValuesArray) setItemsValue((foundValues ?? [])[0], 0);
        else setItemsValue(foundValues, 0);
      } else {
        if (areValuesArray) (foundValues ?? [])?.forEach(setItemsValue);
        else setItemsValue(foundValues, 0);
      }

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

          const nextPageUrl = `${parsedUrl.protocol}://${parsedUrl.hostname}${nextPageValue}`;
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
  } catch (err) {
    throw new Error((err as Error).message);
  }
};
