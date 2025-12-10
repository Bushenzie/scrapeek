// import robotsParser from "robots-parser";

import robotsParser from "robots-parser";
import { request } from "undici";
import { parseURL } from "./url";

export const canScrape = async (url: string) => {
  try {
    const parsedUrl = parseURL(url);
    const robotsTxtUrl = `${parsedUrl.protocol}://${parsedUrl.domain}/robots.txt`;

    const { body } = await request(robotsTxtUrl, {
      method: "get",
      headers: {
        "Content-Type": "text/plain",
      },
    });

    const robotsTxt = await body.text();

    const parsedRobots = robotsParser(robotsTxtUrl, robotsTxt);

    const isAllowed = parsedRobots.isAllowed(url, "Scrapeekbot");

    return isAllowed === undefined ? true : isAllowed;
  } catch (err) {
    throw new Error((err as Error).message);
  }
};
