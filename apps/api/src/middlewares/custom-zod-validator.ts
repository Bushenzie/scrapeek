import { zValidator } from "@hono/zod-validator"
import type { ValidationTargets } from "hono"
import { StatusCodes } from "http-status-codes"
import type { z } from "zod"
import { StatusError } from "@/lib/error.ts"

export const zodValidator = <Target extends keyof ValidationTargets, Schema extends z.ZodType>(
  target: Target,
  schema: Schema,
) => {
  return zValidator(target, schema, (result) => {

    if (!result.success) {
      const { issues } = result.error

      const formattedIssues = issues.map((issue) => {
        return `[${target}]{${issue.path.join(".")}}: ${issue.message}`
      })

      const errorMessage = formattedIssues.join(" | ")

      throw new StatusError(errorMessage, StatusCodes.BAD_REQUEST)
    }
  })
}
