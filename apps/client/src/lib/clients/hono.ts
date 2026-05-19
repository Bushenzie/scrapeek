// TODO: Import from shared and not directly from api
import type { AppType } from "@scrapeek/api/src/server"
import { hc } from "hono/client"

export const client = hc<AppType>("http://localhost:3001", {
  init: {
    credentials: "include",
  },
})
