import { z } from "zod";

export const runnerSchema = z.object({
	// blueprintId: z.uuid().or(z.array(z.uuid())),
	blueprintId: z.uuid(),
	mode: z.enum(["normal", "test"]).default("normal").optional(),
});
