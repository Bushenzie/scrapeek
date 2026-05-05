import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-orm/zod";
import { z } from "zod";
import {
	BLUEPRINT_HTTP_METHODS,
	BlueprintType,
	DATABASE_FIELDS,
} from "../lib/constants";
import { blueprint } from "../schemas";
import { userSelectSchema } from "./auth";
import { resultSelectSchema } from "./result";
import { upvoteSelectSchema } from "./upvote";

const elementParamSelectorSchema = z.object({
	selector: z.string(),
  attribute: z.string().optional(), // TODO: optional?
});


const elementsSchema = z.object({
  key: z.string(),
  container: z.object({
    selector: z.string(),
    elements: z.object({
        key: z.string(),
        selector: z.string(),
        attribute: z.string().optional()
        // quantity: z.enum(["all","single"]),
        // type: z.enum(["className"])
      }).array()
  }),
})


const staticAndDynamicPaginationSchema = elementParamSelectorSchema.extend({
	variant: z.enum(["link", "button"]),
});

const apiPaginationBase = z.object({
	fieldToCheck: z.string(),
});

const apiPaginationCursorSchema = apiPaginationBase.extend({
	type: z.literal("cursor"),
	path: z.object({
		queryKey: z.string(),
		path: z.string(),
	}),
});

const apiPaginationNextPageSchema = apiPaginationBase.extend({
	type: z.literal("nextPage"),
	path: z.string(),
});

const apiPaginationPageSizeSchema = apiPaginationBase.extend({
	type: z.literal("pageSize"),
	page: z.object({
		queryKey: z.string(),
		value: z.number().positive(),
	}),
	size: z.object({
		queryKey: z.string(),
		value: z.number().positive(),
	}),
});

const apiPaginationOffsetSchema = apiPaginationBase.extend({
	type: z.literal("offsetLimit"),
	offset: z.object({
		queryKey: z.string(),
		value: z.number().positive(),
	}),
	limit: z.object({
		queryKey: z.string(),
		value: z.number().positive(),
	}),
});

const apiPaginationSchema = z.discriminatedUnion("type", [
	apiPaginationCursorSchema,
	apiPaginationNextPageSchema,
	apiPaginationPageSizeSchema,
	apiPaginationOffsetSchema,
]);

const apiConfigSchema = z.object({
	fields: z.array(z.object({ key: z.string(), selector: z.string() })),
	timeout: z.number().min(0).max(5000).optional(),
	method: z.enum(BLUEPRINT_HTTP_METHODS),
	headers: z.record(z.string(), z.string()).optional(),
	query: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
	pagination: apiPaginationSchema.optional(),
});

const staticConfigSchema = z.object({
	elements: z.array(elementsSchema),
	timeout: z.number().min(0).max(5000).optional(),
	pagination: staticAndDynamicPaginationSchema.optional(),
});

const dynamicConfigSchema = z.object({
	elements: z.array(elementsSchema),
	timeout: z.number().min(0).max(5000).optional(),
	waitSelectorElement: z.string(),
	pagination: staticAndDynamicPaginationSchema.optional(),
});

const baseRefinements = {
	url: z.url().min(1).max(512),
	name: (field: z.ZodString) => field.min(3).max(255),
	description: (field: z.ZodString) => field.max(255).optional(),
	userId: (field: z.ZodString) => field.min(32).max(32),
	config: z.unknown(),
	createdAt: z.date().transform((d) => d.toISOString()),
	updatedAt: z.date().transform((d) => d.toISOString()),
};

//select
const baseSelectSchema = createSelectSchema(blueprint, baseRefinements).omit({
	type: true,
	config: true,
});

export const apiBlueprintSchema = baseSelectSchema.extend({
	type: z.literal(BlueprintType.API),
	config: apiConfigSchema,
});

export const staticBlueprintSchema = baseSelectSchema.extend({
	type: z.literal(BlueprintType.Static),
	config: staticConfigSchema,
});

export const dynamicBlueprintSchema = baseSelectSchema.extend({
	type: z.literal(BlueprintType.Dynamic),
	config: dynamicConfigSchema,
});

export const blueprintSchema = z.discriminatedUnion("type", [
	apiBlueprintSchema,
	staticBlueprintSchema,
	dynamicBlueprintSchema,
]);

const baseSelectSchemaWithRelationsSchema = baseSelectSchema.extend({
	user: userSelectSchema.nullish(),
	result: resultSelectSchema.nullish(),
	upvotes: upvoteSelectSchema.array().nullish(),
});

export const apiBlueprintWithRelationsSchema =
	baseSelectSchemaWithRelationsSchema.extend({
		type: z.literal(BlueprintType.API),
		config: apiConfigSchema,
	});

export const staticBlueprintWithRelationsSchema =
	baseSelectSchemaWithRelationsSchema.extend({
		type: z.literal(BlueprintType.Static),
		config: staticConfigSchema,
	});

export const dynamicBlueprintWithRelationsSchema =
	baseSelectSchemaWithRelationsSchema.extend({
		type: z.literal(BlueprintType.Dynamic),
		config: dynamicConfigSchema,
	});

export const blueprintWithRelationsSchema = z.discriminatedUnion("type", [
	apiBlueprintWithRelationsSchema,
	staticBlueprintWithRelationsSchema,
	dynamicBlueprintWithRelationsSchema,
]);

//update
const baseUpdateSchema = createUpdateSchema(blueprint, baseRefinements).omit({
	type: true,
	config: true,
	...DATABASE_FIELDS,
});

export const apiUpdateBlueprintSchema = baseUpdateSchema.extend({
	type: z.literal(BlueprintType.API),
	config: apiConfigSchema.optional(),
});

export const staticUpdateBlueprintSchema = baseUpdateSchema.extend({
	type: z.literal(BlueprintType.Static),
	config: staticConfigSchema.optional(),
});

export const dynamicUpdateBlueprintSchema = baseUpdateSchema.extend({
	type: z.literal(BlueprintType.Dynamic),
	config: dynamicConfigSchema.optional(),
});

export const editableBlueprintSchema = z.discriminatedUnion("type", [
	apiUpdateBlueprintSchema,
	staticUpdateBlueprintSchema,
	dynamicUpdateBlueprintSchema,
]);

//insert
const baseInsertSchema = createInsertSchema(blueprint, baseRefinements).omit({
	type: true,
	config: true,
	...DATABASE_FIELDS,
});

export const apiInsertBlueprintSchema = baseInsertSchema.extend({
	type: z.literal(BlueprintType.API),
	config: apiConfigSchema,
});

export const staticInsertBlueprintSchema = baseInsertSchema.extend({
	type: z.literal(BlueprintType.Static),
	config: staticConfigSchema,
});

export const dynamicInsertBlueprintSchema = baseInsertSchema.extend({
	type: z.literal(BlueprintType.Dynamic),
	config: dynamicConfigSchema,
});

export const insertBlueprintSchema = z.discriminatedUnion("type", [
	apiInsertBlueprintSchema,
	staticInsertBlueprintSchema,
	dynamicInsertBlueprintSchema,
]);

//types
export type Blueprint = z.infer<typeof blueprintSchema>;
export type APIBlueprint = z.infer<typeof apiBlueprintSchema>;
export type StaticBlueprint = z.infer<typeof staticBlueprintSchema>;
export type DynamicBlueprint = z.infer<typeof dynamicBlueprintSchema>;

export type BlueprintWithRelations = z.infer<
	typeof blueprintWithRelationsSchema
>;
export type APIBlueprintWithRelations = z.infer<
	typeof apiBlueprintWithRelationsSchema
>;
export type StaticBlueprintWithRelations = z.infer<
	typeof staticBlueprintWithRelationsSchema
>;
export type DynamicBlueprintWithRelations = z.infer<
	typeof dynamicBlueprintWithRelationsSchema
>;

export type EditableBlueprint = z.infer<typeof editableBlueprintSchema>;
export type EditableAPIBlueprint = z.infer<typeof apiUpdateBlueprintSchema>;
export type EditableStaticBlueprint = z.infer<
	typeof staticUpdateBlueprintSchema
>;
export type EditableDynamicBlueprint = z.infer<
	typeof dynamicUpdateBlueprintSchema
>;

export type InsertBlueprint = z.infer<typeof insertBlueprintSchema>;
export type InsertAPIBlueprint = z.infer<typeof apiInsertBlueprintSchema>;
export type InsertStaticBlueprint = z.infer<typeof staticInsertBlueprintSchema>;
export type InsertDynamicBlueprint = z.infer<
	typeof dynamicInsertBlueprintSchema
  >;

export type ElementSelector = z.infer<typeof elementsSchema>
