import { Axios } from "axios";

export const axiosClient = new Axios({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
  },
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

  let current;
  let index = 0;
  for (let segment of segments) {
    const isIndexed = indexedPathRegex.test(segment);
    const isArray = arrayPathRegex.test(segment);

    if (isArray) {
      const clearedSegment = segment.replaceAll(bracketRegex, "");

      const remainingSegmentsPath = segments
        .slice(index + 1, segments.length)
        .join(".");

      if (current === undefined) {
        current = data[clearedSegment];

        return current?.map((item) =>
          getValueFromFlatPath(item, remainingSegmentsPath)
        );
      }

      current = current[clearedSegment];

      return current?.map((item) =>
        getValueFromFlatPath(item, remainingSegmentsPath)
      );
    }

    if (isIndexed) {
      const clearedSegment = segment.replace(indexSegmentRegex, "");
      const specifiedIndex = Number(indexRegex.exec(segment)?.[0]);

      if (current === undefined) {
        current = data[clearedSegment][specifiedIndex];
        index++;
        continue;
      }

      current = current[clearedSegment][specifiedIndex];
      index++;
      continue;
    }

    if (current === undefined) {
      current = data[segment];
      index++;
      continue;
    }

    current = current[segment];
    index++;
  }

  return current;
};
