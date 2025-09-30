import { z } from "zod";

export const resultParamSchema = z.object({
  id: z.uuid(),
});

export const resultHeaderSchema = z.object({
  Authorization: z.templateLiteral(["Bearer scrpk_", z.jwt()]),
});
