import { z } from "zod";

export const upvoteBodySchema = z.object({
  blueprintId: z.uuid(),
});

export const upvoteBlueprintParamSchema = z.object({
  blueprintId: z.uuid(),
});
