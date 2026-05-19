import type { ZodType, z } from "zod"

export const parseEnv = <T extends ZodType>(schema: T, env: NodeJS.ProcessEnv): z.infer<T> => {
  const parsedEnv = schema.safeParse(env)

  if (!parsedEnv.success) {
    throw new Error(parsedEnv.error.message)
  }

  return parsedEnv.data
}
