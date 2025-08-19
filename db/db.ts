import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schemas/schema.ts";
import { env } from "../lib/env.ts";

const sql = neon(env.DATABASE_URL);
export const db = drizzle({ client: sql, schema });
