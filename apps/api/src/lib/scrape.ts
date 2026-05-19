import type { Blueprint } from "@scrapeek/db/validators"
import { APIScraper } from "@scrapeek/scrapers/api"
import { DynamicScraper } from "@scrapeek/scrapers/dynamic"
import { StaticScraper } from "@scrapeek/scrapers/static"
import { StatusCodes } from "http-status-codes"
import { StatusError } from "@/lib/error.ts"

export const scrapeData = async (blueprints: Blueprint[], isTestRun = false) => {
  const scrapersToRun = blueprints.map((blueprint) => {
    if (blueprint.type === "api") {
      const apiScraper = new APIScraper(blueprint, { isTestRun })
      return apiScraper.scrape()
    }
    if (blueprint.type === "dynamic") {
      const dynamicScraper = new DynamicScraper(blueprint)
      return dynamicScraper.scrape({ isTestRun })
    }
    const staticScraper = new StaticScraper(blueprint)
    return staticScraper.scrape({ isTestRun })
  })

  try {
    const scrapedData = await Promise.all(scrapersToRun)

    return scrapedData
  } catch (err) {
    throw new StatusError(err as string, StatusCodes.INTERNAL_SERVER_ERROR)
  }
}
