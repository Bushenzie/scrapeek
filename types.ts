type SiteConfigItemBase = {
  url: string;
  label: string;
  baseUrl: string;
};

type ElementParamSelector = {
  selector: string;
  attribute: string;
};

type PaginationParamSelector = {
  type: "link" | "button";
} & ElementParamSelector;

type APIPaginationBase = {
  check: string;
};

type APIPaginationCursor = {
  type: "cursor";
  path: [string, string];
};

type APIPaginationNextPage = {
  type: "nextPage";
  path: string;
};

type APIPaginationLink = {
  type: "link";
};

type APIPaginationPageSize = {
  type: "pageSize";
  page: [string, number];
  size: [string, number];
};

type APIPaginationOffsetLimit = {
  type: "offsetLimit";
  offset: [string, number];
  limit: [string, number];
};

type APIPagination = APIPaginationBase &
  (
    | APIPaginationCursor
    | APIPaginationNextPage
    | APIPaginationLink
    | APIPaginationPageSize
    | APIPaginationOffsetLimit
  );

export type SiteConfigAPIItem = {
  type: "api";
  fields: Record<string, string>;
  baseUrlAPI: string;
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  query?: Record<string, string | number>;
  pagination?: APIPagination;
} & SiteConfigItemBase;

export type SiteConfigStaticItem = {
  type: "static";
  elements: Record<string, string | ElementParamSelector>;
  searchQuery?: string;
  pagination?: PaginationParamSelector;
} & SiteConfigItemBase;

export type SiteConfigDynamicItem = {
  type: "dynamic";
  waitSelectorElement: string;
  elements: Record<string, string | ElementParamSelector>;
  pagination?: PaginationParamSelector;
  searchQuery?: string;
} & SiteConfigItemBase;

export type SiteConfigItem =
  | SiteConfigAPIItem
  | SiteConfigStaticItem
  | SiteConfigDynamicItem;

export type ScraperOptions = {} & SiteConfigItem;
