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

export type SiteConfigAPIItem = {
  type: "api";
  items: Record<string, string>;
  query: Record<string, string | number>;
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
