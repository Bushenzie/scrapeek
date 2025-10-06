import { z } from "zod";

export const runnerSchema = z.object({
  blueprintId: z.uuid(),
  mode: z.enum(["normal", "test"]).default("normal").optional(),
});
