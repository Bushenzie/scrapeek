import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
// import { auth } from "@/lib/auth.ts";
import { env } from "@/lib/env.ts";
import { errorHandler } from "@/middlewares/error-handler.ts";
import blueprintRoutes from "@/routes/blueprints/blueprints.routes.ts";
import runnerRoutes from "@/routes/runners/runners.routes.ts";

const app = new Hono()
  .use(logger())
  .onError(errorHandler)
  .use("/api/*", cors())
  .basePath("/api")
  .route("/blueprints", blueprintRoutes)
  .route("/runners", runnerRoutes);

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
