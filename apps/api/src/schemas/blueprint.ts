import * as z from "zod";

const elementParamSelectorSchema = z.object({
	selector: z.string(),
	attribute: z.string(), // TODO optional?
});

const staticAndDynamicPaginationSchema = elementParamSelectorSchema.extend({
	variant: z.enum(["link", "button"]),
});

const apiPaginationBase = z.object({
	fieldToCheck: z.string(),
});

const apiPaginationCursorSchema = apiPaginationBase.extend({
	type: z.literal("cursor"),
	path: z.tuple([z.string(), z.string()]),
});

const apiPaginationNextPageSchema = apiPaginationBase.extend({
	type: z.literal("nextPage"),
	path: z.string(),
});

const apiPaginationPageSizeSchema = apiPaginationBase.extend({
	type: z.literal("pageSize"),
	page: z.tuple([z.string(), z.number().positive()]),
	size: z.tuple([z.string(), z.number().positive()]),
});

const apiPaginationOffsetSchema = apiPaginationBase.extend({
	type: z.literal("offsetLimit"),
	offset: z.tuple([z.string(), z.number().positive()]),
	limit: z.tuple([z.string(), z.number().positive()]),
});

const apiPaginationSchema = z.discriminatedUnion("type", [
	apiPaginationCursorSchema,
	apiPaginationNextPageSchema,
	apiPaginationPageSizeSchema,
	apiPaginationOffsetSchema,
]);

const apiConfigSchema = z.object({
	fields: z.record(z.string(), z.string()),
	apiBaseUrl: z.url(),
	method: z.enum(["GET", "POST"]).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	query: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
	pagination: apiPaginationSchema.optional(),
});

const staticConfigSchema = z.object({
	elements: z.record(
		z.string(),
		z.union([z.string(), elementParamSelectorSchema]),
	),
	pagination: staticAndDynamicPaginationSchema.optional(),
});

const dynamicConfigSchema = z.object({
	elements: z.record(
		z.string(),
		z.union([z.string(), elementParamSelectorSchema]),
	),
	waitSelectorElement: z.string(),
	pagination: staticAndDynamicPaginationSchema.optional(),
});

const databaseFieldsSchema = z.object({
	id: z.uuid(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

const baseBlueprintSchema = z.object({
	url: z.url().max(255),
	baseUrl: z.url().max(255),
	name: z.string().min(3),
});

const fullBaseBlueprintSchema = baseBlueprintSchema.extend(
	databaseFieldsSchema.shape,
);

const apiConfigBlueprintSchema = z.object({
	type: z.literal("api"),
	config: apiConfigSchema,
});

const staticConfigBlueprintSchema = z.object({
	type: z.literal("static"),
	config: staticConfigSchema,
});

const dynamicConfigBlueprintSchema = z.object({
	type: z.literal("dynamic"),
	config: dynamicConfigSchema,
});

const apiBlueprintSchema = fullBaseBlueprintSchema.extend(
	apiConfigBlueprintSchema.shape,
);

const staticBlueprintSchema = fullBaseBlueprintSchema.extend(
	staticConfigBlueprintSchema.shape,
);

const dynamicBlueprintSchema = fullBaseBlueprintSchema.extend(
	dynamicConfigBlueprintSchema.shape,
);

const apiEditableBlueprintSchema = baseBlueprintSchema.extend(
	apiConfigBlueprintSchema.shape,
);

const staticEditableBlueprintSchema = baseBlueprintSchema.extend(
	staticConfigBlueprintSchema.shape,
);

const dynamicEditableBlueprintSchema = baseBlueprintSchema.extend(
	dynamicConfigBlueprintSchema.shape,
);

export const blueprintSchema = z.discriminatedUnion("type", [
	apiBlueprintSchema,
	staticBlueprintSchema,
	dynamicBlueprintSchema,
]);

export const editableBlueprintSchema = z.discriminatedUnion("type", [
	apiEditableBlueprintSchema,
	staticEditableBlueprintSchema,
	dynamicEditableBlueprintSchema,
]);

export type Blueprint = z.infer<typeof blueprintSchema>;
export type EditableBlueprint = z.infer<typeof editableBlueprintSchema>;
