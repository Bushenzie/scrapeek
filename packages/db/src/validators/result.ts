import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-orm/zod"
import { z } from "zod"
import { DATABASE_FIELDS } from "../lib/constants"
import type { EditableFields } from "../lib/types"
import { result } from "../schemas/result"

const editableFields: EditableFields<typeof result.$inferSelect> = {
  blueprintId: true,
} as const

export const resultSelectSchema = createSelectSchema(result, {
  createdAt: z.date().transform((d) => d.toISOString()),
  updatedAt: z.date().transform((d) => d.toISOString()),
})

export const resultInsertSchema = createInsertSchema(result)
  .pick(editableFields)
  .omit(DATABASE_FIELDS)

export const resultUpdateSchema = createUpdateSchema(result)
  .pick(editableFields)
  .omit(DATABASE_FIELDS)

export type Result = z.infer<typeof resultSelectSchema>
