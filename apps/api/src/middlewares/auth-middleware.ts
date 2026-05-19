import { createMiddleware } from "hono/factory"
import { StatusCodes } from "http-status-codes"
import { type AuthType, auth } from "@/lib/auth"
import { StatusError } from "@/lib/error"

export const authMiddleware = createMiddleware<{ Variables: AuthType }>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })

  if (!session) {
    throw new StatusError("Unauthorized", StatusCodes.UNAUTHORIZED)
  }

  c.set("user", session.user)
  c.set("session", session.session)
  return next()
})
