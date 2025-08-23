import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import blueprintRoutes from "@/routes/blueprints/blueprints.routes.ts";
import runnerRoutes from "@/routes/runners/runners.routes.ts";
import { errorHandler } from "./src/middlewares/error-handler.ts";
import { env } from "./src/lib/env.ts";

const app = new Hono();

app.onError(errorHandler);
app.use("/api/*", cors());

app
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
