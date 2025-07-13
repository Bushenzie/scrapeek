import scrapers from "./scrapers";
import * as fs from "node:fs/promises";
import { SiteConfigItem } from "./types";

const CONFIG_FILE = "./sites.json";

const start = async () => {
  const sitesRaw = await fs.readFile(CONFIG_FILE, { encoding: "utf-8" });
  const sites = JSON.parse(sitesRaw) as SiteConfigItem[];
  for (let site of sites) {
    let data;
    console.log(`${site.type.toUpperCase()} Scrape | ${site.label}`);
    switch (site.type) {
      case "api":
        data = await scrapers.apiScraper(site);
        console.log(data);
        console.log(data.length);
        break;
      case "static":
        data = await scrapers.staticSiteScraper(site);
        console.log(data);
        console.log(data.length);
        break;
      case "dynamic":
        data = await scrapers.dynamicSiteScraper(site);
        console.log(data);
        console.log(data.length);
        break;
    }
  }
};

start();
