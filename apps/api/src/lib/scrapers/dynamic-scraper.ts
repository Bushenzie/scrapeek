import type { Blueprint } from "@scrapeek/shared/blueprint";
import playwright, { type ElementHandle } from "playwright";

export const dynamicSiteScraper = async (
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
  let items: Record<string, string>[] = [];

  for (const element of config.elements) {
    const locator = await page.locator(element.selector);

    if (testRun) {
      const resultItem = await locator.first().evaluate(
        (item, props) => {
          if (props.attribute) {
            return item.getAttribute(props.attribute) ?? "";
          }
          return item.textContent?.trim() ?? "";
        },
        {
          key: element.key,
          attribute: element.attribute,
        }
      );

      if (!items[0]) items[0] = {};
      items[0][element.key] = resultItem;
      continue;
    }

    const resultItems = await locator.evaluateAll(
      (items, props) =>
        items.map((item) => {
          if (props.attribute) {
            return item.getAttribute(props.attribute) ?? "";
          }
          return item.textContent?.trim() ?? "";
        }),
      {
        items,
        key: element.key,
        attribute: element.attribute,
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
      await locator.evaluate((item) => (item as ElementHandle).click());
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
