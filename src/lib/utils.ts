import { Axios } from "axios";
import { fileURLToPath } from "url";
import { dirname } from "path";

const userAgents = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
  "Mozilla/5.0 (Linux; Android 10; moto g fast) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Whale/2.9.115.7 Safari/537.36",
  "Mozilla/5.0 (Linux; Android 10; LM-Q730) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Mobile Safari/537.36",
];

export const axiosClient = new Axios({});

axiosClient.interceptors.request.use((config) => {
  const randomNum = Math.floor(Math.random() * userAgents.length);
  config.headers["User-Agent"] = userAgents[randomNum];
  return config;
});

export const getValueFromFlatPath = <T extends object>(
  data: T,
  path: string
) => {
  const segments = path.split(".");
  const indexedPathRegex = /\w+\[\d+\]/i;
  const indexRegex = /(?<=\[)\d+(?=\])/i;
  const indexSegmentRegex = /\[\d+\]/i;
  const arrayPathRegex = /^\[\w+\]/i;
  const bracketRegex = /[\[\]]/gi;

  let current: any;
  let index = 0;
  for (let segment of segments) {
    const isIndexed = indexedPathRegex.test(segment);
    const isArray = arrayPathRegex.test(segment);

    if (isArray) {
      const clearedSegment = segment.replaceAll(bracketRegex, "");

      const remainingSegmentsPath = segments
        .slice(index + 1, segments.length)
        .join(".");

      current = (current === undefined ? data : current)[clearedSegment];

      return current?.map((item: any) =>
        getValueFromFlatPath(item, remainingSegmentsPath)
      );
    }

    if (isIndexed) {
      const clearedSegment = segment.replace(indexSegmentRegex, "");
      const specifiedIndex = Number(indexRegex.exec(segment)?.[0]);

      current = (current === undefined ? data : current)[clearedSegment][
        specifiedIndex
      ];

      index++;
      continue;
    }

    current = (current === undefined ? data : current)[segment];

    index++;
  }

  return current;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export { __dirname, __filename };
