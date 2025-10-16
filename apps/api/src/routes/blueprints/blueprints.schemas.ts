import { z } from "zod";

export const searchableBlueprint = z.object({
  id: z.uuid(),
});

export const paginatedBlueprint = z.object({
  page: z.coerce.number().positive().optional(),
});
