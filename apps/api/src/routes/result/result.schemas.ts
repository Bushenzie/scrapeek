import { z } from "zod";

export const resultParamSchema = z.object({
	id: z.uuid(),
});
