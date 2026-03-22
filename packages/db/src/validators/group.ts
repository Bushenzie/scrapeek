import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-orm/zod";
import { z } from "zod";
import { DATABASE_FIELDS } from "../lib/constants";
import { group } from "../schemas/group";

const omitFields = {
	...DATABASE_FIELDS,
	userId: true,
} as const;

export const groupSelectSchema = createSelectSchema(group, {
	createdAt: z.date().transform((d) => d.toISOString()),
	updatedAt: z.date().transform((d) => d.toISOString()),
});

export const groupInsertSchema = createInsertSchema(group, {
	name: (field) => field.min(1).max(100),
}).omit(omitFields);

export const groupUpdateSchema = createUpdateSchema(group, {
	name: (field) => field.min(1).max(100),
}).omit(omitFields);

export type Group = z.infer<typeof groupSelectSchema>;
