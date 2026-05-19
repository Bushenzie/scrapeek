import type {
  ContainerElementSelector,
  ElementSelector,
  StaticBlueprint,
} from "@scrapeek/db/validators"
import { type ParsedURL, parseURL } from "@scrapeek/shared/utils"
import { type HTMLElement, parse } from "node-html-parser"
import type { IScraper, ScrapedDataPrimitive, ScrapedDataShape, ScrapedDataValue } from "@/types"
import type { ScrapeOptions } from "../types"
import { axiosClient } from "../utils/axios"
import { canScrape } from "../utils/robots"
import { sleep } from "../utils/sleep"

export class StaticScraper implements IScraper {
  blueprint: StaticBlueprint
  parsedURL: ParsedURL
  scrapedData: Record<string, ScrapedDataShape[]>

  constructor(blueprint: StaticBlueprint) {
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

  async fetchPage(url: string) {
    try {
      console.log(`Fetching page "${url}".`)
      if (this.blueprint.respectRobotsTxt) await this.checkRobotsTxt()

      const { data } = await axiosClient(url, { method: "GET" })
      return data
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

  extractValue(node: HTMLElement | null, element: ElementSelector) {
    const { key, selector, attribute } = element

    try {
      const value: ScrapedDataValue =
        attribute !== undefined
          ? (node?.getAttribute(attribute) ?? null)
          : (node?.textContent?.trim() ?? null)

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

  // TODO: this is hella bloated...
  async scrapePage(url: string, elements: ContainerElementSelector[]) {
    try {
      console.log(`Scraping page "${url}".`)

      const data = await this.fetchPage(url)
      const root = parse(data)

      const values: Record<string, ScrapedDataShape[]> = {}

      for (const { key: containerKey, container } of elements) {
        const foundContainers = root.querySelectorAll(container.selector)

        if (!values[containerKey]) values[containerKey] = []

        for (const cont of foundContainers) {
          const currentObj: ScrapedDataShape = {}

          for (const element of container.elements) {
            const { key: elementKey, selector, crawl } = element
            const foundElement = cont.querySelector(selector)

            const rawValue = this.extractValue(foundElement, element)
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

              const { data: crawledScrapedData } = await this.scrapePage(
                crawlablePageLink,
                wrappedElements,
              )

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
        root,
      }
    } catch (err) {
      throw new Error(`There was error scraping "${this.parsedURL.originalUrl}" page`, {
        cause: err,
      })
    }
  }

  async handlePagination(root: HTMLElement, isTestRun?: boolean) {
    try {
      const { pagination, timeout } = this.blueprint.config

      if (!pagination) return

      const { attribute, selector } = pagination

      while (true) {
        if (!attribute) break

        const nextPageLink = root.querySelector(selector)?.getAttribute(attribute)

        if (!nextPageLink || nextPageLink === this.blueprint.url) break

        const newPageUrl = this.resolveFullURL(nextPageLink)

        if (timeout) await sleep(timeout)

        const { data: newlyScrapedData, root: newRoot } = await this.scrapePage(
          newPageUrl,
          this.blueprint.config.elements,
        )
        root = newRoot

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

  async scrape({ isTestRun }: ScrapeOptions) {
    try {
      const { data, root } = await this.scrapePage(
        this.parsedURL.originalUrl,
        this.blueprint.config.elements,
      )

      this.scrapedData = data

      if (this.blueprint.config.pagination !== undefined) {
        await this.handlePagination(root, isTestRun)
      }

      return this.scrapedData
    } catch (err) {
      throw new Error((err as Error).message)
    }
  }
}
