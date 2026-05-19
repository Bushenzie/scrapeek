import { createSelectSchema } from "drizzle-orm/zod"
import { z } from "zod"
import { user } from "../schemas"

export const userSelectSchema = createSelectSchema(user, {
  createdAt: z.date().transform((d) => d.toISOString()),
  updatedAt: z.date().transform((d) => d.toISOString()),
})
