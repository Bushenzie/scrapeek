import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-orm/zod";
import { z } from "zod";
import { DATABASE_FIELDS } from "../lib/constants";
import type { EditableFields } from "../lib/types";
import { group } from "../schemas/group";

const omitFields = {
	...DATABASE_FIELDS,
	userId: true,
} as const;

const editableFields: EditableFields<typeof group.$inferSelect> = {
	name: true,
};

export const groupSelectSchema = createSelectSchema(group, {
	createdAt: z.date().transform((d) => d.toISOString()),
	updatedAt: z.date().transform((d) => d.toISOString()),
});

export const groupInsertSchema = createInsertSchema(group, {
	name: (field) => field.min(1).max(100),
})
	.pick(editableFields)
	.omit(omitFields);

export const groupUpdateSchema = createUpdateSchema(group, {
	name: (field) => field.min(1).max(100),
})
	.pick(editableFields)
	.omit(omitFields);

export type Group = z.infer<typeof groupSelectSchema>;
