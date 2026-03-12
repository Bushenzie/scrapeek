import { z } from "zod";

export const idParamSearchSchema = z.object({
	id: z.uuid(),
});
