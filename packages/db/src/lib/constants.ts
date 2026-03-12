export enum BlueprintType {
	API = "api",
	Static = "static",
	Dynamic = "dynamic",
}

export enum APIBlueprintPaginationType {
	Cursor = "cursor",
	NextPage = "nextPage",
	PageSize = "pageSize",
	OffsetLimit = "offsetLimit",
}

export const BLUEPRINT_HTTP_METHODS = [
	"GET",
	"POST",
	"PUT",
	"PATCH",
	"OPTIONS",
	"DELETE",
] as const;

export const DATABASE_FIELDS = {
	id: true,
	createdAt: true,
	updatedAt: true,
} as const;

export const BLUEPRINT_TYPES = [
	BlueprintType.API,
	BlueprintType.Dynamic,
	BlueprintType.Static,
] as const;
