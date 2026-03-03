import { createUpdateSchema, createSelectSchema, createInsertSchema } from "drizzle-orm/zod";
import { result } from "../schemas/result";
import type { z } from "zod";
import type { EditableFields } from "../lib/types";
import { DATABASE_FIELDS } from "../lib/constants";

const editableFields: EditableFields<typeof result.$inferSelect> = {
  blueprintId: true,
} as const;

export const resultSelectSchema = createSelectSchema(result);

export const resultInsertSchema = createInsertSchema(result).pick(editableFields).omit(DATABASE_FIELDS);

export const resultUpdateSchema = createUpdateSchema(result).pick(editableFields).omit(DATABASE_FIELDS);

export type Result = z.infer<typeof resultSelectSchema>;
