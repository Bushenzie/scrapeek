export const BLUEPRINT_TYPES = ["api", "static", "dynamic"] as const;

export const STATIC_DYNAMIC_BLUEPRINT_PAGINATION_VARIANTS = ["link", "button"] as const;

export const BLUEPRINT_HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "OPTIONS", "DELETE"] as const;

export const DATABASE_FIELDS = {
  id: true,
  createdAt: true,
  updatedAt: true,
} as const;

export enum API_BLUEPRINT_PAGINATION_TYPES {
  Cursor = "cursor",
  NextPage = "nextPage",
  PageSize = "pageSize",
  OffsetLimit = "offsetLimit",
}
