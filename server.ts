import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import configRoutes from "./routes/config.ts";
import runnerRoutes from "./routes/runner.ts";
import { errorHandler } from "./middlewares/error-handler.ts";

const app = new Hono();

app.onError(errorHandler);
app.use("/api/*", cors());

app
  .basePath("/api")
  .route("/config", configRoutes)
  .route("/runner", runnerRoutes);

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT ?? 3001),
  },
  (info) => {
    console.log(`Server running | Port: ${info.port}`);
  }
);
