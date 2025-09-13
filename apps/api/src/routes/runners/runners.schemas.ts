import { z } from "zod";

export const runnerSchema = z.object({
  blueprintIds: z.array(z.uuid()),
  mode: z.enum(["normal", "test"]).default("normal").optional(),
});
