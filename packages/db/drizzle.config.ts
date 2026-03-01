import { defineConfig } from "drizzle-kit";
import { env } from "./src/lib/env.ts";

export default defineConfig({
  out: "./migrations",
  schema: "./src/schemas/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  strict: true,
  verbose: true,
});
