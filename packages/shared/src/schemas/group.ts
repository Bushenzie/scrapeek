import z from "zod";
import { blueprintSchema } from "./blueprint";

export const editableGroupSchema = z.object({
  name: z.string().max(100),
});

const databaseFieldsSchema = z.object({
  id: z.uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  blueprints: z.array(blueprintSchema).optional(),
});

export const groupSchema = editableGroupSchema.extend(databaseFieldsSchema.shape);

export type Group = z.infer<typeof groupSchema>;
