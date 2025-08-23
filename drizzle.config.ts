import { env } from "@/lib/env.ts";
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./db/migrations",
	schema: "./db/schemas/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: env.DATABASE_URL,
	},
	strict: true,
	verbose: true,
});
