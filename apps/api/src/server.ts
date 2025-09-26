import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "@/lib/env.ts";
import { errorHandler } from "@/middlewares/error-handler.ts";
import blueprintRoutes from "@/routes/blueprints/blueprints.routes.ts";
import resultRoutes from "@/routes/result/result.routes.ts";
import runnerRoutes from "@/routes/runners/runners.routes.ts";
import { auth } from "./lib/auth";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>()
  .basePath("/api")
  .use(logger())
  .onError(errorHandler)
  .use(
    "*",
    cors({
      origin: env.CLIENT_URL,
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    })
  )
  .use("*", async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) {
      c.set("user", null);
      c.set("session", null);
      return next();
    }
    c.set("user", session.user);
    c.set("session", session.session);
    return next();
  })
  .on(["POST", "GET"], "/auth/*", (c) => {
    return auth.handler(c.req.raw);
  })
  .route("/blueprints", blueprintRoutes)
  .route("/runners", runnerRoutes)
  .route("/result", resultRoutes);

serve(
  {
    fetch: app.fetch,
    port: Number(env.PORT ?? 3001),
  },
  (info) => {
    console.log(`Server running | Port: ${info.port}`);
  }
);

export default app;

export type AppType = typeof app;
