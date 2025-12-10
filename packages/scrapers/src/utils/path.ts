export const getValueFromFlatPath = <T extends object>(
  data: T,
  path: string
) => {
  const segments = path.split(".");
  const indexedPathRegex = /\w+\[\d+\]/i;
  const indexRegex = /(?<=\[)\d+(?=\])/i;
  const indexSegmentRegex = /\[\d+\]/i;
  const arrayPathRegex = /^\[\w+\]/i;
  const bracketRegex = /[[\]]/gi;

  // string | object | boolean | number | any
  let current: any;
  let index = 0;
  for (const segment of segments) {
    const isIndexed = indexedPathRegex.test(segment);
    const isArray = arrayPathRegex.test(segment);

    if (isArray) {
      const clearedSegment = segment.replaceAll(bracketRegex, "");

      const remainingSegmentsPath = segments
        .slice(index + 1, segments.length)
        .join(".");

      current = (current === undefined ? data : current)[clearedSegment];

      return current?.map((item: any) => {
        return getValueFromFlatPath(item, remainingSegmentsPath);
      });
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
