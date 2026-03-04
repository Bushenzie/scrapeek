import {
	createInsertSchema,
	createUpdateSchema,
	createSelectSchema,
} from "drizzle-orm/zod";
import { group } from "../schemas/group";
import type { z } from "zod";
import type { EditableFields } from "../lib/types";
import { DATABASE_FIELDS } from "../lib/constants";

const editableFields: EditableFields<typeof group.$inferSelect> = {
	name: true,
};

export const groupSelectSchema = createSelectSchema(group);

export const groupInsertSchema = createInsertSchema(group, {
	name: (field) => field.min(1).max(100),
})
	.pick(editableFields)
	.omit(DATABASE_FIELDS);

export const groupUpdateSchema = createUpdateSchema(group, {
	name: (field) => field.min(1).max(100),
})
	.pick(editableFields)
	.omit(DATABASE_FIELDS);

export type Group = z.infer<typeof groupSelectSchema>;
