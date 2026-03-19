import { Hono } from "hono"
import { type AuthType, auth } from "@/lib/auth"

const app = new Hono<{ Bindings: AuthType }>({ strict: false }).on(["POST", "GET"], "/*", (c) => {
  return auth.handler(c.req.raw)
})

export default app
