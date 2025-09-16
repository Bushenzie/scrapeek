import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "../lib/env.ts";
import { schema } from "./schemas/index.ts";

const sql = neon(env.DATABASE_URL);
export const db = drizzle({ client: sql, schema });
