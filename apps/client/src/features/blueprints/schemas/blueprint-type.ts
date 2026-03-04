import { BLUEPRINT_TYPES } from "@scrapeek/db/constants";
import { z } from "zod";

export const blueprintTypeSelectSchema = z.object({
	type: z.enum(BLUEPRINT_TYPES),
});
