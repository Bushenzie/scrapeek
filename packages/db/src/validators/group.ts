import { createInsertSchema, createUpdateSchema, createSelectSchema } from "drizzle-orm/zod";
import { group } from "../schemas/group";
import type { z } from "zod";

export const groupSelectSchema = createSelectSchema(group);

export const groupInsertSchema = createInsertSchema(group, {
  name: (field) => field.min(1).max(100),
}).pick({ name: true });

export const groupUpdateSchema = createUpdateSchema(group).pick({
  name: true,
});

export type Group = z.infer<typeof groupSelectSchema>;
