import type {
  ContainerElementSelector,
  DynamicBlueprint,
  ElementSelector,
} from "@scrapeek/db/validators"
import { type ParsedURL, parseURL } from "@scrapeek/shared/utils"
import { chromium, type Browser, type Locator, type Page } from "playwright"
import type { IScraper, ScrapedDataPrimitive, ScrapedDataShape } from "@/types"
import type { ScrapeOptions } from "../types"
import { canScrape } from "../utils/robots"
import { sleep } from "../utils/sleep"

export class DynamicScraper implements IScraper {
  blueprint: DynamicBlueprint
  parsedURL: ParsedURL
  scrapedData: Record<string, ScrapedDataShape[]>

  constructor(blueprint: DynamicBlueprint) {
    this.blueprint = blueprint
    this.parsedURL = parseURL(this.blueprint.url)
    this.scrapedData = {}
  }

  async checkRobotsTxt() {
    const isScrappable = await canScrape(this.parsedURL.originalUrl)
    if (!isScrappable) {
      throw new Error("Site is forbidden from being scraped due to restriction inside robots.txt")
    }
  }

  async openPage(url: string) {
    try {
      console.log(`Fetching page "${url}".`)
      if (this.blueprint.respectRobotsTxt) await this.checkRobotsTxt()

      const browser = await chromium.launch({
        headless: true,
      })

      const context = await browser.newContext()
      const page = await context.newPage()

      return {
        browser,
        page,
      }
    } catch (err) {
      throw new Error(`There was error fetching "${this.parsedURL.originalUrl}" page`, {
        cause: err,
      })
    }
  }

  formatValue(value: string | null, element: ElementSelector) {
    const { type } = element

    let formattedValue: ScrapedDataPrimitive = value
    switch (type) {
      case "number":
        formattedValue = Number(value)
        break
      case "boolean":
        if (element.condition.operation === "equals") {
          formattedValue = value === String(element.condition.to)
        } else {
          formattedValue = value !== String(element.condition.to)
        }
        break
      case "string":
        if (value && element.removeNewLines) {
          formattedValue = value.replace(/\r?\n|\r/gm, "")
        }
        break
    }

    return formattedValue
  }

  async extractValue(locator: Locator, element: ElementSelector): Promise<string | null> {
    const { key, selector, attribute } = element

    try {
      if ((await locator.count()) === 0) return null

      const value =
        attribute !== undefined
          ? await locator.getAttribute(attribute)
          : ((await locator.textContent())?.trim() ?? null)

      return value
    } catch (err) {
      throw new Error(`There was error extracting value "key: ${key} | selector: ${selector}" `, {
        cause: err,
      })
    }
  }

  resolveFullURL(path: string) {
    return path.startsWith("http")
      ? path
      : `${this.parsedURL.protocol}://${this.parsedURL.domain}${path}`
  }

  async scrapePage(
    url: string,
    elements: ContainerElementSelector[],
    currentPage?: Page,
  ): Promise<{ data: Record<string, ScrapedDataShape[]>; page: Page; browser?: Browser }> {
    let browser: Browser | undefined

    try {
      console.log(`Scraping page "${url}".`)

      const { page, browser: openedBrowser } = currentPage
        ? { page: currentPage, browser: undefined }
        : await this.openPage(url)

      browser = openedBrowser

      await page.goto(url)
      await page.waitForSelector(this.blueprint.config.waitSelectorElement, { timeout: 15000 })

      const values: Record<string, ScrapedDataShape[]> = {}

      for (const { key: containerKey, container } of elements) {
        const foundContainers = page.locator(container.selector)
        const containerCount = await foundContainers.count()

        if (!values[containerKey]) values[containerKey] = []

        for (let index = 0; index < containerCount; index++) {
          const cont = foundContainers.nth(index)
          const currentObj: ScrapedDataShape = {}

          for (const element of container.elements) {
            const { key: elementKey, selector, crawl } = element
            const foundElement = cont.locator(selector).first()

            const rawValue = await this.extractValue(foundElement, element)
            const value = this.formatValue(rawValue, element)

            if (crawl && value !== null && typeof value === "string") {
              const crawlablePageLink = this.resolveFullURL(value)

              const wrappedElements: ContainerElementSelector[] = [
                {
                  key: elementKey,
                  container: {
                    selector: "html",
                    elements: crawl.map((c) => ({ ...c, type: "string" as const })),
                  },
                },
              ]

              const { data: crawledScrapedData, browser: crawledBrowser } = await this.scrapePage(
                crawlablePageLink,
                wrappedElements,
              )

              await crawledBrowser?.close()

              currentObj[elementKey] = crawledScrapedData[elementKey]?.[0] ?? {}
            } else {
              currentObj[elementKey] = value
            }
          }

          values[containerKey].push(currentObj)
        }
      }

      return {
        data: values,
        page,
        browser,
      }
    } catch (err) {
      await browser?.close()

      console.log(err)

      throw new Error(`There was error scraping "${this.parsedURL.originalUrl}" page`, {
        cause: err,
      })
    }
  }

  async handlePagination(page: Page, isTestRun?: boolean) {
    try {
      const { pagination, timeout } = this.blueprint.config

      if (!pagination) return

      const { attribute, selector, variant } = pagination

      while (true) {
        const nextPageElement = page.locator(selector).first()
        const isNextPageElementVisible =
          (await nextPageElement.count()) > 0 && (await nextPageElement.isVisible())

        if (!isNextPageElementVisible) break

        let nextPageLink: string | null = null
        let pageAlreadyAdvanced = false

        if (attribute) {
          nextPageLink = await nextPageElement.getAttribute(attribute)
        } else if (variant === "button") {
          const previousURL = page.url()

          await nextPageElement.click()
          await page.waitForSelector(this.blueprint.config.waitSelectorElement, { timeout: 15000 })

          const currentURL = page.url()
          nextPageLink = currentURL === previousURL ? null : currentURL
          pageAlreadyAdvanced = true
        }

        if (!nextPageLink) break

        const newPageUrl = this.resolveFullURL(nextPageLink)

        if (!pageAlreadyAdvanced && newPageUrl === page.url()) break

        if (timeout) await sleep(timeout)

        const { data: newlyScrapedData } = await this.scrapePage(
          newPageUrl,
          this.blueprint.config.elements,
          page,
        )

        for (const key of Object.keys(newlyScrapedData)) {
          this.scrapedData[key] = [...(this.scrapedData[key] ?? []), ...newlyScrapedData[key]]
        }

        if (isTestRun) break
      }

      return this.scrapedData
    } catch (err) {
      throw new Error(`There was during pagination of "${this.parsedURL.originalUrl}" page`, {
        cause: err,
      })
    }
  }

  async scrape({ isTestRun, ignorePagination }: ScrapeOptions) {
    let browser: Browser | undefined

    try {
      const {
        data,
        page,
        browser: openedBrowser,
      } = await this.scrapePage(this.parsedURL.originalUrl, this.blueprint.config.elements)

      browser = openedBrowser
      this.scrapedData = data

      if (this.blueprint.config.pagination !== undefined && !ignorePagination) {
        await this.handlePagination(page, isTestRun)
      }

      return this.scrapedData
    } catch (err) {
      throw new Error((err as Error).message)
    } finally {
      await browser?.close()
    }
  }
}
