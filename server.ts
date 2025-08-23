import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "@/lib/env.ts";
import { errorHandler } from "@/middlewares/error-handler.ts";
import blueprintRoutes from "@/routes/blueprints/blueprints.routes.ts";
import runnerRoutes from "@/routes/runners/runners.routes.ts";

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
	},
);
