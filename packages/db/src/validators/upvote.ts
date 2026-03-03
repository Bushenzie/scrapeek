import { createUpdateSchema, createSelectSchema, createInsertSchema } from "drizzle-orm/zod";
import { upvote } from "../schemas/upvote";
import type { z } from "zod";
import type { EditableFields } from "../lib/types";
import { DATABASE_FIELDS } from "../lib/constants";

const editableFields: EditableFields<typeof upvote.$inferSelect> = {
  blueprintId: true,
} as const;

export const upvoteSelectSchema = createSelectSchema(upvote);

export const upvoteInsertSchema = createInsertSchema(upvote).pick(editableFields).omit(DATABASE_FIELDS);

export const upvoteUpdateSchema = createUpdateSchema(upvote).pick(editableFields).omit(DATABASE_FIELDS);

export type Upvote = z.infer<typeof upvoteSelectSchema>;
