import { z } from "zod";

export const searchableBlueprint = z.object({
  id: z.uuid(),
});
