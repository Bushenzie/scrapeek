type SiteConfigItemBase = {
  url: string;
  label: string;
  baseUrl: string;
};

type ElementParamSelector = {
  selector: string;
  attribute: string;
};

export type SiteConfigAPIItem = {
  type: "api";
  query: Record<string, string | number>;
} & SiteConfigItemBase;

export type SiteConfigStaticItem = {
  type: "static";
  elements: Record<string, string | ElementParamSelector>;
  pagination?: ElementParamSelector;
} & SiteConfigItemBase;

export type SiteConfigDynamicItem = {
  type: "dynamic";
  waitSelectorElement: string;
  elements: Record<string, string | ElementParamSelector>;
  pagination?: ElementParamSelector;
} & SiteConfigItemBase;

export type SiteConfigItem =
  | SiteConfigAPIItem
  | SiteConfigStaticItem
  | SiteConfigDynamicItem;

export type ScraperOptions = {} & SiteConfigItem;
