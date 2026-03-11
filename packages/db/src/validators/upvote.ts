import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-orm/zod";
import type { z } from "zod";
import { DATABASE_FIELDS } from "../lib/constants";
import type { EditableFields } from "../lib/types";
import { upvote } from "../schemas/upvote";

const omitFields = {
	...DATABASE_FIELDS,
	userId: true,
} as const;

const editableFields: EditableFields<typeof upvote.$inferSelect> = {
	blueprintId: true,
} as const;

export const upvoteSelectSchema = createSelectSchema(upvote);

export const upvoteInsertSchema = createInsertSchema(upvote)
	.pick(editableFields)
	.omit(omitFields);

export const upvoteUpdateSchema = createUpdateSchema(upvote)
	.pick(editableFields)
	.omit(omitFields);

export type Upvote = z.infer<typeof upvoteSelectSchema>;
