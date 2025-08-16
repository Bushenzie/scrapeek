import * as z from "zod";

const elementParamSelectorSchema = z.object({
  selector: z.string(),
  attribute: z.string().optional(),
});

const staticAndDynamicPaginationSchema = elementParamSelectorSchema.extend(
  z.object({
    variant: z.enum(["link", "button"]),
  })
);

const apiPaginationBase = z.object({
  fieldToCheck: z.string(),
});

const apiPaginationCursorSchema = apiPaginationBase.extend(
  z.object({
    type: z.literal("cursor"),
    path: z.tuple([z.string(), z.string()]),
  })
);

const apiPaginationNextPageSchema = apiPaginationBase.extend(
  z.object({
    type: z.literal("nextPage"),
    path: z.string(),
  })
);

const apiPaginationPageSizeSchema = apiPaginationBase.extend(
  z.object({
    type: z.literal("pageSize"),
    path: z.tuple([z.string(), z.number().positive()]),
    size: z.tuple([z.string(), z.number().positive()]),
  })
);

const apiPaginationOffsetSchema = apiPaginationBase.extend(
  z.object({
    type: z.literal("offsetLimit"),
    offset: z.tuple([z.string(), z.number().positive()]),
    limit: z.tuple([z.string(), z.number().positive()]),
  })
);

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
    z.union([z.string(), elementParamSelectorSchema])
  ),
  pagination: staticAndDynamicPaginationSchema.optional(),
});

const dynamicConfigSchema = z.object({
  elements: z.record(
    z.string(),
    z.union([z.string(), elementParamSelectorSchema])
  ),
  waitSelectorElement: z.string(),
  pagination: staticAndDynamicPaginationSchema.optional(),
});

const baseBlueprintSchema = z.object({
  id: z.uuid(),
  url: z.url().max(255),
  baseUrl: z.url().max(255),
  name: z.string().min(3),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const apiBlueprintSchema = baseBlueprintSchema.extend(
  z.object({
    type: z.literal("api"),
    config: apiConfigSchema,
  })
);

const staticBlueprintSchema = baseBlueprintSchema.extend(
  z.object({
    type: z.literal("static"),
    config: staticConfigSchema,
  })
);

const dynamicBlueprintSchema = baseBlueprintSchema.extend(
  z.object({
    type: z.literal("dynamic"),
    config: dynamicConfigSchema,
  })
);

export const blueprintSchema = z.discriminatedUnion("type", [
  apiBlueprintSchema,
  staticBlueprintSchema,
  dynamicBlueprintSchema,
]);

// TODO: make it more DRY
const apiEditableBlueprintSchema = apiBlueprintSchema.omit({
  id: true,
  updatedAt: true,
  createdAt: true,
});

const staticEditableBlueprintSchema = apiBlueprintSchema.omit({
  id: true,
  updatedAt: true,
  createdAt: true,
});

const dynamicEditableBlueprintSchema = apiBlueprintSchema.omit({
  id: true,
  updatedAt: true,
  createdAt: true,
});

export const editableBlueprintSchema = z.discriminatedUnion("type", [
  apiEditableBlueprintSchema,
  staticEditableBlueprintSchema,
  dynamicEditableBlueprintSchema,
]);

export type Blueprint = z.infer<typeof blueprintSchema>;
export type EditableBlueprint = z.infer<typeof editableBlueprintSchema>;
