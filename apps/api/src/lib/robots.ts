// import robotsParser from "robots-parser";

import robotsParser from "robots-parser";
import { parseURL } from "./url";
import { axiosClient } from "./utils";

export const canScrape = async (url: string) => {
  try {
    const parsedUrl = parseURL(url);
    const robotsTxtUrl = `${parsedUrl.protocol}://${parsedUrl.domain}/robots.txt`;

    const response = await axiosClient({
      method: "get",
      url: robotsTxtUrl,
      headers: {
        "Content-Type": "text/plain",
      },
    });
    const robotsTxt = await response.data;

    const parsedRobots = robotsParser(robotsTxtUrl, robotsTxt);

    return parsedRobots.isAllowed(url);
  } catch (err) {
    throw new Error((err as Error).message);
  }
};
