import z from "zod";

export const editableGroup = z.object({
	name: z.string().max(100),
});
