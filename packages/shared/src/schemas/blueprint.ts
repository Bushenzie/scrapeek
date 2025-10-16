import { z } from "zod";

export enum BlueprintType {
  API = "api",
  STATIC = "static",
  DYNAMIC = "dynamic",
}

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
  method: z.enum(["GET", "POST"]).optional(),
  headers: z.record(z.string(), z.string()).optional(),
  query: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
  pagination: apiPaginationSchema.optional(),
});

const staticConfigSchema = z.object({
  elements: z.array(
    z.object({
      key: z.string(),
      selector: z.string(),
      attribute: z.string().optional(),
    })
  ),
  pagination: staticAndDynamicPaginationSchema.optional(),
});

const dynamicConfigSchema = z.object({
  elements: z.array(
    z.object({
      key: z.string(),
      selector: z.string(),
      attribute: z.string().optional(),
    })
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
  url: z.url("Provided string must be URL").max(255),
  name: z.string().min(3, "Minimum length of name is 3 chars").max(255),
  description: z.string().max(255).optional(),
  respectRobotsTxt: z.boolean(),
  public: z.boolean(),
  userId: z.string().min(32).max(32),
  result: z
    .object({
      id: z.uuid(),
      createdAt: z.date(),
      updatedAt: z.date(),
      data: z.json(),
      blueprintId: z.uuid(),
    })
    .optional(),
  user: z
    .object({
      name: z.string(),
      image: z.url(),
    })
    .optional(),
  upvotes: z.number().optional(),
});

const fullBaseBlueprintSchema = baseBlueprintSchema.extend(
  databaseFieldsSchema.shape
);

const apiConfigBlueprintSchema = z.object({
  type: z.literal(BlueprintType.API),
  config: apiConfigSchema,
});

const staticConfigBlueprintSchema = z.object({
  type: z.literal(BlueprintType.STATIC),
  config: staticConfigSchema,
});

const dynamicConfigBlueprintSchema = z.object({
  type: z.literal(BlueprintType.DYNAMIC),
  config: dynamicConfigSchema,
});

export const apiBlueprintSchema = fullBaseBlueprintSchema.extend(
  apiConfigBlueprintSchema.shape
);

export const staticBlueprintSchema = fullBaseBlueprintSchema.extend(
  staticConfigBlueprintSchema.shape
);

export const dynamicBlueprintSchema = fullBaseBlueprintSchema.extend(
  dynamicConfigBlueprintSchema.shape
);

export const apiEditableBlueprintSchema = baseBlueprintSchema
  .omit({ result: true })
  .extend(apiConfigBlueprintSchema.shape);

export const staticEditableBlueprintSchema = baseBlueprintSchema
  .omit({ result: true })
  .extend(staticConfigBlueprintSchema.shape);

export const dynamicEditableBlueprintSchema = baseBlueprintSchema
  .omit({ result: true })
  .extend(dynamicConfigBlueprintSchema.shape);

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

export type APIBlueprint = z.infer<typeof apiBlueprintSchema>;
export type EditableAPIBlueprint = z.infer<typeof apiEditableBlueprintSchema>;
export type StaticBlueprint = z.infer<typeof staticBlueprintSchema>;
export type EditableStaticBlueprint = z.infer<
  typeof staticEditableBlueprintSchema
>;
export type DynamicBlueprint = z.infer<typeof dynamicBlueprintSchema>;
export type EditableDynamicBlueprint = z.infer<
  typeof dynamicEditableBlueprintSchema
>;

export type Blueprint = z.infer<typeof blueprintSchema>;
export type EditableBlueprint = z.infer<typeof editableBlueprintSchema>;
