import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive(),
  BASE_URL: z.url(),
  DATABASE_URL: z.url(),
  AUTH_SECRET: z.string(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(parsedEnv.error.message);
}

export const env = parsedEnv.data;
