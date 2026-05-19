import type { Blueprint } from "@scrapeek/db/validators"

export type ScrapeOptions = {
  isTestRun?: boolean
  ignorePagination?: boolean
}

export type ScraperOptions = ScrapeOptions

export type ScrapedDataPrimitive = string | number | boolean | null
export type ScrapedDataValue =
  | ScrapedDataPrimitive
  | ScrapedDataValue[]
  | { [key: string]: ScrapedDataValue }
export type ScrapedDataShape = { [key: string]: ScrapedDataValue }

export interface IScraper {
  blueprint: Blueprint
  scrape: (options: ScrapeOptions) => Promise<Record<string, any>>
}
