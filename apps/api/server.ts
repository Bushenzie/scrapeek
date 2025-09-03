import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
// import { auth } from "@/lib/auth.ts";
import { env } from "@/lib/env.ts";
import { errorHandler } from "@/middlewares/error-handler.ts";
import blueprintRoutes from "@/routes/blueprints/blueprints.routes.ts";
import runnerRoutes from "@/routes/runners/runners.routes.ts";

const app = new Hono();

app.use("/api/*", cors());
app.use(logger());
app.onError(errorHandler);
// app.use(
//   "/api/auth/*",
//   cors({
//     origin: "http://localhost:3001",
//     allowHeaders: ["Content-Type", "Authorization"],
//     allowMethods: ["POST", "GET", "OPTIONS"],
//     exposeHeaders: ["Content-Length"],
//     maxAge: 600,
//     credentials: true,
//   })
// );
// app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

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
