import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "@/lib/env.ts";
import { errorHandler } from "@/middlewares/error-handler";
import authRoutes from "@/routes/auth/auth.routes.ts";
import blueprintRoutes from "@/routes/blueprints/blueprints.routes.ts";
import resultRoutes from "@/routes/result/result.routes.ts";
import runnerRoutes from "@/routes/runners/runners.routes.ts";
import upvoteRoutes from "@/routes/upvotes/upvotes.routes.ts";
import type { AuthType } from "./lib/auth";

const app = new Hono<{
  Variables: AuthType;
}>({ strict: false })
  .basePath("/api")
  .use(logger())
  .onError(errorHandler)
  .use(
    "*",
    cors({
      origin: env.CLIENT_URL,
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "DELETE", "PATCH", "PUT", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    })
  )
  .route("/auth", authRoutes)
  .route("/blueprints", blueprintRoutes)
  .route("/runners", runnerRoutes)
  .route("/result", resultRoutes)
  .route("/upvotes", upvoteRoutes);

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
